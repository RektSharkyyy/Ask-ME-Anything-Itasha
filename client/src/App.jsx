import React, { useState } from 'react'
import SideBar from './components/SideBar'
import { Route, Routes } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'

const App = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          alt="menu"
          onClick={() => setIsMenuOpen(true)}
          className="w-7 h-7 fixed top-4 left-4 cursor-pointer z-50 not-dark:invert md:hidden"
        />
      )}
      <div className='dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className='flex h-screen w-screen'>
          <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path='/' element={<ChatBox />} />
            <Route path='/credits' element={<Credits />} />
            <Route path='/community' element={<Community />} />
          </Routes>
        </div>
      </div>

    </>
  )
}

export default App