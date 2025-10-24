import React from 'react'
import Admin from './Admin/Admin'
import Adminlogin from './Admin/Adminlogin'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Creatuser from './Admin/Creatuser';
import Userprofile from './Admin/Userprofile';
import Products from './Admin/Products';
import Home from './User/Home';
import AdminChat from './Admin/Adminchat';
function App() {
  return (
    <div>

    <Router>
         <Routes>
        <Route path="/" element={<Adminlogin />} />
        <Route path="/Admin" element={<Admin/>} />
        <Route path="/Creatuser" element={<Creatuser/>} />
       <Route path="/Userprofile/:id/:username" element={<Userprofile />} />
           <Route path="/Products" element={<Products />} />
              <Route path="/UserHome" element={<Home />} />
                <Route path="/AdminChat" element={<AdminChat />} />
      </Routes>
    </Router>
     


    </div>
  )
}

export default App