import CopyrightIcon from '@mui/icons-material/Copyright';
import Navbar from './Navbar.jsx'
import Hero from "./hero.jsx"
import "./home.css"

export default function Home(){

    return (
        <>
        <Navbar/>   
              <Hero/>
        
              <div className='footer'><p><CopyrightIcon sx={{fontSize:"0.95rem"}}/>SpeakBuddy, 2026</p></div>    
        </>
    )
}