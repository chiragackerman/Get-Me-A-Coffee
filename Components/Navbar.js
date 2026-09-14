'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Player } from '@lordicon/react'
import SearchIcon from '../public/Search.json'

const Navbar = () => {
  const searchIconRef = useRef(null)
  const pathname = usePathname()

  const replaySearchIcon = () => {
    searchIconRef.current?.playFromBeginning()
  }

  const navLinkClass = (href) => `nav-link ${pathname === href ? 'active text-espresso' : 'text-mocha hover:text-espresso'} font-label-md text-label-md transition-colors duration-200`

  return (
    <nav className="sticky top-0 z-10 bg-warm-white border-b border-coffee-border">
      <div className='flex justify-between items-center p-4 py-3 px-5 w-full mx-auto'>
        <div className="logo flex items-center gap-3 text-2xl font-bold">
          <div className="img flex items-center bg-coffee p-2 rounded-xl"><img className="h-8 w-8 " src="/Logo.png" alt="Coffee-Cup" /></div>
          <div className="text flex-row">
            <span className='text-espresso'>GetMeACoffee</span>
            <p className='text-mocha text-sm font-semibold'>Support Creators. Fuel Ideas</p>
          </div>
        </div>
        <div className="flex text-lg font-bold space-x-9 ">
          <Link className={navLinkClass('/')} href="/">
            Home
          </Link>
          <Link className={navLinkClass('/about')} href="/about">
            About
          </Link>
          <Link className={navLinkClass('/projects')} href="/projects">
            Projects
          </Link>
          <Link className={navLinkClass('/contact')} href="/contact">
            Contact
          </Link>
        </div>
        <div className=" flex items-center gap-6 pr-1">
          <div
            className="cursor-pointer flex h-8 w-8 items-center justify-center"
            onMouseEnter={replaySearchIcon}
            role="img"
            aria-label="Search"
          >
            <Player ref={searchIconRef} icon={SearchIcon} size={32} />
          </div>
          <button className="text-lg cursor-pointer rounded-4xl bg-coffee px-6 py-3 font-medium text-warm-white transition-colors hover:bg-dark-roast duration-300">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
