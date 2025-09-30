import React, { Suspense } from 'react'
import DashboardPage from './page'
import {BarLoader} from "react-spinners"

const DashboardLayout = () => {
  return (
    <div className='px-5'>
      <div className="flex items-center justify-between mb-5">
      <h1 className='text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 mb-5'>
        Dashboard 
        </h1>
        </div>
    <Suspense 
    fallback={<BarLoader className='mt-4' width={"100%"} color= "#9333ea"/>}
    >
    <DashboardPage/>
    </Suspense>
    </div>
  )
}

export default DashboardLayout
