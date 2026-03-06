import { socket } from "../Socket/Socket";

let peer;
let localStream;
let currentCallId = null;
let iceCandidateQueue = [];

// ==========================
// CALLER SIDE
// ==========================
export async function CreatePeer(getRemoteUserId, localVideoRef, remoteVideoRef) {
    //remoteUserId(here it is getKey)->who to call , localVideoRef -> where to show local video , remoteVideoRef ->  where to show remote video

    currentCallId = crypto.randomUUID();
    console.log("callId" ,currentCallId);
  // 1️⃣ Get camera & mic
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    localVideoRef.current.srcObject = localStream;
  } catch (err) {
    
    return;
  }

  // 2️⃣ Create RTCPeerConnection
  peer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });

  // 3️⃣ Send local tracks
  localStream.getTracks().forEach(track =>
    peer.addTrack(track, localStream)
  );

  // 4️⃣ Receive remote tracks
  peer.ontrack = event => {
    remoteVideoRef.current.srcObject = event.streams[0];
  };

  // 5️⃣ Send ICE candidates
  peer.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        callId:currentCallId,
        to: getRemoteUserId,
        candidate: event.candidate
      });
    }
  };

  // 6️⃣ Create OFFER
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);

  // 7️⃣ Send offer via signaling
  socket.emit("call-user", {
    callId:currentCallId,
    to: getRemoteUserId,
    offer
  });
}

// ==========================
// RECEIVER SIDE
// ==========================
export async function AnswerCall(callId , fromUserId, offer, localVideoRef, remoteVideoRef,callTimer) {
  currentCallId = callId;
  clearTimeout(callTimer);
  // 1️⃣ Get camera & mic
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });
  localVideoRef.current.srcObject = localStream;

  // 2️⃣ Create RTCPeerConnection
  peer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });

  // 3️⃣ Add local tracks
  localStream.getTracks().forEach(track =>
    peer.addTrack(track, localStream)
  );

  // 4️⃣ Receive remote tracks
  peer.ontrack = event => {
    remoteVideoRef.current.srcObject = event.streams[0];
  };

  // 5️⃣ ICE candidates
  peer.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        callId,
        to: fromUserId,
        candidate: event.candidate
      });
    }
  };

  // 6️⃣ Set remote offer
  await peer.setRemoteDescription(offer);

  // 7️⃣ Create ANSWER
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);

  // 8️⃣ Send answer
  socket.emit("accept-call", {
    to: fromUserId,
    answer
  });
}

// =========================
// call end    //first send end call req to server then server cut the call from both
// =========================

export function callEnd(reason="hangup"){
  if(!currentCallId) return;

  socket.emit("end-call" ,{
    callId:currentCallId,
    reason,
  })
  cleanUp();

}
export function rejectCall(callId, fromUserId) {
  socket.emit("reject-call", {
    callId,
    to: fromUserId
  });
}
export const cleanUp = ()=>{
  peer?.close();
  peer = null;

  localStream?.getTracks().forEach(t => t.stop());
  localStream = null;

  currentCallId = null;
}

// ==========================
// COMMON SOCKET LISTENERS
// ==========================
socket.on("call-accepted", async ({ answer }) => {
  await peer.setRemoteDescription(answer);
});


