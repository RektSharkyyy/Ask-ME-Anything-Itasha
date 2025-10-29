import React, { useState } from 'react'
import SideBar from './components/SideBar'
import { Route, Routes } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'

const App = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
    {!isMenuOpen && <img src={assets.menu_icon} className='dark:bg-linear-to-b dark:from-[#242124] dark:to-[#000000] dark:text-white' 
    onClick={()=>setIsMenuOpen(true)}/>}
      <div className='dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className='flex h-screen w-screen'>
        <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
        <Routes>
          <Route path='/' element={<ChatBox/>}/>
          <Route path='/credits' element={<Credits/>}/>
          <Route path='/community' element={<Community/>}/>
        </Routes>
        </div>
      </div>
      
    </>
  )
}

export default App