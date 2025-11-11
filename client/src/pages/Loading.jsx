import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Loading = () => {
  const navigate = useNavigate()
  const {fetchUser} = useAppContext()

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUser()
      navigate('/')
    }, 8000)
    return () => clearTimeout(timeout)
  }, [navigate])

  return (
    <div className='bg-linear-to-b from-[#100b2c] to-[#100820] backdrop-opacity-60 
    flex items-center justify-center h-screen w-screen text-white text-2xl'>
      <div className="w-12 h-12 rounded-full border-4 border-white/60 border-t-transparent animate-spin"></div>
    </div>
  )
}

export default Loading