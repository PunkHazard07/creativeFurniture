// import React from 'react'
// import { Router, Routes, Route } from 'react-router-dom'
// import Login from './components/Login'
// import Register from './components/Register'
// import Dashboard from './pages/Dashboard'
// import Add from './pages/Add'
// import List from './pages/List'
// import Orders from './pages/Orders'

// const App = () => {
//   return (
//     <div>
//       <Router>
//         <Routes>
//           {/* Auth Routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Admin Panel Routes */}
//           <Route path='/dashboard' element={<Dashboard />} />
//           <Route path='/add' element={<Add />} />
//           <Route path='/list' element={<List />} />
//           <Route path='/orders' element={<Orders />} />
//         </Routes>
//       </Router>

//     </div>
//   )
// }

// export default App

import React from 'react'
import VerifyToken from './components/verifyToken'

const App = () => {
  return (
    <div>
      <VerifyToken /> 
    </div>

  )
}

export default App


