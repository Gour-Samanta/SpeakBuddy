import CopyrightIcon from '@mui/icons-material/Copyright';
import Hero from "./hero.jsx"
import "./home.css"

export default function Home({allOnlineUsers,isLogged , userId}){

    return (
        <>
        
              <Hero allOnlineUsers={allOnlineUsers} isLogged={isLogged} userId={userId}/>
        
              <div className='footer'><p><CopyrightIcon sx={{fontSize:"1rem"}}/> 2026 SpeakBuddy</p></div>    
        </>
    )
}