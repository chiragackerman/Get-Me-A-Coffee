'use client'
import { useSession } from "next-auth/react"
import React, { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Player } from '@lordicon/react'
import SearchIcon from '../public/Search.json'

const Navbar = () => {
  const { data: session, status } = useSession()
  const searchIconRef = useRef(null)
  const pathname = usePathname()
  const fallbackProfileImage = "/user_pofile_icon.png"

  const replaySearchIcon = () => {
    searchIconRef.current?.playFromBeginning()
  }

  const navLinkClass = (href) => `nav-link ${pathname === href ? 'active text-espresso' : 'text-mocha hover:text-espresso'} font-label-md text-label-md transition-colors duration-200`

  return (
    
  <nav className="sticky top-0 z-10 border-b border-coffee-border bg-warm-white">
    <div className='mx-auto flex w-full items-center justify-between gap-2 p-3 px-3 sm:gap-6 sm:p-4 sm:px-5'>
      <div className="logo flex min-w-0 items-center gap-2 text-xl font-bold sm:gap-3 sm:text-2xl">
        <Link className="img flex shrink-0 items-center rounded-xl bg-coffee p-2" href="/">
          <img className="h-8 w-8" src="/Logo.png" alt="Coffee-Cup" />
        </Link>
        <div className="text min-w-0">
          <span className='block truncate text-espresso'><Link href="/">GetMeACoffee</Link></span>
          <p className='hidden text-sm font-semibold text-mocha sm:block'>Support Creators. Fuel Ideas.</p>
        </div>
      </div>
      <div className="hidden text-lg font-bold space-x-9 md:flex">
        <Link className={navLinkClass('/')} href="/">
          Home
        </Link>
        <Link className={navLinkClass('/about')} href="/about">
          About
        </Link>
        <Link className={navLinkClass('/contact')} href="/contact">
          Contact
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          aria-label="Search creators"
          className="flex h-8 w-8 shrink-0 items-center justify-center"
          href="/creators?focus=search"
          onMouseEnter={replaySearchIcon}
          title="Search creators"
        >
          <Player ref={searchIconRef} icon={SearchIcon} size={32} />
        </Link>
        <div
          className={`flex h-[42px] shrink-0 items-center justify-end sm:h-[52px] ${
            status === "loading" || status === "authenticated"
              ? "w-[42px]"
              : "w-[84px] sm:w-[120px]"
          }`}
        >
          {status === "loading" ? (
            <span
              aria-label="Checking sign-in status"
              className="coffee-skeleton h-[42px] w-[42px] rounded-full border border-coffee-border"
              role="status"
            />
          ) : status === "authenticated" ? (
            <Link
              aria-label="Open dashboard"
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-coffee-border bg-coffee transition-all duration-200 hover:scale-105 hover:border-coffee hover:shadow-sm"
              href="/dashboard"
              title="Dashboard"
            >
              <img
                alt=""
                className="h-full w-full rounded-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = fallbackProfileImage
                }}
                src={session.user?.image || fallbackProfileImage}
              />
            </Link>
          ) : (
            <Link className="cursor-pointer rounded-4xl bg-coffee px-4 py-2 text-sm font-medium text-warm-white transition-colors hover:bg-dark-roast duration-300 sm:px-6 sm:py-3 sm:text-lg" href="/signin">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  </nav>
  )
}

export default Navbar
