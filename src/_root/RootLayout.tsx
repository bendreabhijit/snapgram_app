import BottomBar from '@/components/Shared/BottomBar'
import LeftSideBar from '@/components/Shared/LeftSideBar'
import Topbar from '@/components/Shared/TopBar'

import React from 'react'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSideBar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <BottomBar />
    </div>
  )
}

export default RootLayout