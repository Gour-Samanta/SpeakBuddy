import './App.css'
import Home from "./Dashboard/Home.jsx";
import Login from './Dashboard/Login.jsx';
import Signup from './Dashboard/Signup.jsx'
import {Routes , Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
    <ToastContainer position="top-right" autoClose={4000} />

      <Routes>
        <Route path='/*' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </>
  )
}

export default App
