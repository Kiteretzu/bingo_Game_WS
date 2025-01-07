import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function Profile() {
    const [queryParams, updateQueryParams] = useSearchParams()
    const navigate = useNavigate()
    useEffect(() => {
        const token = queryParams.get('token')
        if (token) {
            localStorage.setItem("auth-token", token)
            navigate("/")
        }
    }, [])
    return (
        <div className='w-full min-h-screen flex items-center justify-center'>
            <span className='text-4xl font-bold'>Hello</span>
        </div>
    )
}

export default Profile
