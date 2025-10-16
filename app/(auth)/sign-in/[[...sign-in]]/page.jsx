import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return <SignIn fallbackRedirectUrl="/dashboard"/>
}

export default page
