import CopyrightIcon from '@mui/icons-material/Copyright';
import Hero from "./hero.jsx"
import "./home.css"

export default function Home({allOnlineUsers,isLogged}){

    return (
        <>
        
              <Hero allOnlineUsers={allOnlineUsers} isLogged={isLogged}/>
        
              <div className='footer'><p><CopyrightIcon sx={{fontSize:"0.95rem"}}/> 2026 SpeakBuddy</p></div>    
        </>
    )
}