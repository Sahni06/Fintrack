import { SpeedInsights } from "@vercel/speed-insights/next"
import React from 'react'

const MainLayout = ({children}) => {
  return (
    <div className='container mx-auto my-32'>
      {children}
      <SpeedInsights />
    </div>
  )
}

export default MainLayout
