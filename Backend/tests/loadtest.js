import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://speakbuddybackend.onrender.com';

export const options = {
  stages: [
    { duration: '15s', target: 250  }, 
    { duration: '15s', target: 500  }, 
    // { duration: '15s', target: 750  }, 
    // { duration: '15s', target: 1000 }, 
    { duration: '15s', target: 0    }, 
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/users/find?lang=All`);
  check(res, {
    'status ok': (r) => r.status === 200 || r.status === 304,
  });
  sleep(1);
}