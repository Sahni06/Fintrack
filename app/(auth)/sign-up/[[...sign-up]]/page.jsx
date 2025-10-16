   "use client"
import { SignUp } from '@clerk/nextjs'
import React from 'react'
    
    const page = () => {
      return <SignUp fallbackRedirectUrl="/dashboard"/>
    }
    
    export default page
    