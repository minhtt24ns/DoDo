import React, { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router'
import { useState } from 'react'

const ProtectedRoute = ({children}) => {
    const {accessToken, user, loading, refresh,fetchMe} = useAuthStore()
    const [starting, setStarting] = useState(true);

    const init = async () =>{
        if(!accessToken){
            await refresh();
        }
        if(accessToken && !user){
            await fetchMe()
        }
        setStarting(false);
    }

    // useeffect dùng để gọi init
    useEffect(() => {
        init()
    },[])
    
    if (starting || loading){
        return <div className='flex items-center justify-center h-screen'>Đang tải trang...</div>
    }
    if (!accessToken){
        return (
        <Navigate
             to="/signin"
             replace 
        />
    )
    }

  return <Outlet></Outlet>
}

export default ProtectedRoute