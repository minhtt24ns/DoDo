import React from 'react'
import Logout from './auth/logout'
import { useAuthStore } from '@/stores/useAuthStore'

const Header = () => {
  const {user} = useAuthStore()
  return (
    <div className='space-y-2 text-center'>
      <h1 className='text-4xl font-bold text-transparent bg-primary bg-clip-text'>DoDo!</h1>
      <p className='text-lg text-muted-foreground'>Không có việc gì khó, chỉ sợ bạn không làm 💪</p>
      {user?.displayName}
      <Logout />
    </div>
  )
}

export default Header