import React from 'react'
import Admin from './Admin/Admin'
import Adminlogin from './Admin/Adminlogin'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Creatuser from './Admin/Creatuser';
import Userprofile from './Admin/Userprofile';
function App() {
  return (
    <div>

    <Router>
         <Routes>
        <Route path="/" element={<Adminlogin />} />
        <Route path="/Admin" element={<Admin/>} />
        <Route path="/Creatuser" element={<Creatuser/>} />
       <Route path="/Userprofile/:id/:username" element={<Userprofile />} />
      </Routes>
    </Router>
     


    </div>
  )
}

export default App