import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import toast from 'react-hot-toast'

const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {

  const { chats, selectedChats, setSelectedChat, theme, setTheme, user, navigate, createNewChat, axios, setChats, fetchUsersChats, setToken, token } = useAppContext()
  const [search, setSearch] = useState('')

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    toast.success('Logged out successfully')
  }

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation()
      const confirm = window.confirm('Are you sure you want to delete this chat?')
      if (!confirm) return
      const { data } = await axios.post('/api/chat/delete', { chatId }, { headers: { Authorization: token } })
      if (data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId))
        await fetchUsersChats()
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className={`flex flex-col h-screen min-h-72 p-5 dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30
    border-r border-[#80609f]/30 backdrop:blur-3xl transition-all duration-500 
    max-md:absolute left-0 z-10 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
      {/* logo */}
      <img src={theme === 'dark' ? assets.logo_full : assets.logo_full} alt="" className='w-full max-w-48' />

      {/* new chat button */}
      <button onClick={createNewChat} className="flex justify-center items-center w-full py-2 mt-10 text-white 
      bg-linear-to-b from-[#5af5f5] to-[#3D81F6] 
      dark:bg-linear-to-b dark:from-[#2949fa] dark:to-[#3D81F6]
      rounded-lg transition-all duration-300">
        <span className="mr-2 text-xl">+</span> Ask Me
      </button>

      {/* Search Conversations */}
      <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400
      dark:border-white rounded-md'>
        <img src={assets.search_icon} alt="" className='w-4 not-dark:invert' />
        <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" placeholder='Search conversations..' className='text-xs 
        placeholder:text-gray-400 outline-none'/>
      </div>

      {/* Recent chats */}
      {chats.length > 0 && <p>Recent chats</p>}

      <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3'>
        {
          chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
            <div onClick={() => { navigate('/'); setSelectedChat(chat); setIsMenuOpen(false) }} key={chat._id} className='p-2 px-4 dark:bg-[#57317C]/15 border border-gray-300
            dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between group'>
              <div>
                <p className='truncate w-full'>
                  {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                </p>
                <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>{moment(chat.updatedAt).fromNow()}</p>
              </div>
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  toast.promise(
                    deleteChat(e, chat._id),
                    {
                      loading: 'Deleting...',
                      success: 'Deleted',
                      error: (err) => err.message || 'Failed to delete',
                    }
                  );
                }}
                src={assets.bin_icon}
                className='hidden group-hover:block w-4 cursor-pointer'
                alt=''
              />

            </div>
          ))
        }
      </div>

      {/* community images */}
      <div onClick={() => { navigate('/community'); setIsMenuOpen(false) }} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15
      rounded-md cursor-pointer hover:scale-105 transition-all'>
        <img src={assets.gallery_icon} className='w-4 not-dark:invert' alt="" />
        <div className='flex flex-col text-sm'>
          <p>Community Images</p>
        </div>
      </div>

      {/* credit purchase option */}
      <div onClick={() => { navigate('/credits'); setIsMenuOpen(false) }} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15
      rounded-md cursor-pointer hover:scale-103 transition-all'>
        <img src={assets.diamond_icon} className='w-4 dark:invert' alt="" />
        <div className='flex flex-col text-sm'>
          <p>Credits : {user?.credits}</p>
          <p className='text-xs text-gray-400'>Purschase credits to use Itasha</p>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className='flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md'>
        <div className='flex items-center gap-2 text-sm'>
          <img src={assets.theme_icon} className='w-4 not-dark:invert' alt='' />
          <p>Dark Mode</p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            type="checkbox"
            className="sr-only peer"
            checked={theme === 'dark'}
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full overflow-hidden peer-checked:bg-blue-600 transition-all relative">
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transform transition-transform duration-300 peer-checked:translate-x-4"></span>
          </div>
        </label>

      </div>

      {/* User Account */}
      <div className='flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15
      rounded-md cursor-pointer group'>
        <img src={assets.user_icon} className='w-7 rounded-full' alt="" />
        <p className='flex-1 text-sm dark:text-primary truncate'>{user ? user.name : 'Login your account'}</p>
        {user && <img onClick={logout} src={assets.logout_icon} alt='' className='h-5 cursor-pointer group-hover:block not-dark:invert' />}
      </div>

      <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' alt="" />

    </div>
  )
}

export default SideBar