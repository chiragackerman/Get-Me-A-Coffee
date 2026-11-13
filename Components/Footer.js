'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Player } from '@lordicon/react'
import GithubIcon from '../public/github_logo.json'
import InstagramIcon from '../public/instagram_logo.json'
import YoutubeIcon from '../public/youtube_logo.json'
import { formatDateIST } from '@/lib/dateTime'

const Footer = () => {
  const githubIconRef = useRef(null)
  const youtubeIconRef = useRef(null)
  const instagramIconRef = useRef(null)
  const pathname = usePathname()

  const replayIcon = (iconRef) => {
    iconRef.current?.playFromBeginning()
  }

  const navLinkClass = (href) => `nav-link ${pathname === href ? 'active text-warm-white' : 'text-soft-latte hover:text-warm-white'} font-label-md text-label-md transition-colors duration-200`

  return (
    <footer className=" z-10 bg-espresso border-t border-coffee-border w-full text-warm-white">
      <div className='flex w-full flex-col gap-5 p-4 px-5 py-5 lg:mx-auto lg:flex-row lg:items-center lg:justify-between'>
        <div className="logo flex items-center gap-3 text-lg font-bold sm:text-2xl">
          <Link className="img cursor-pointer flex shrink-0 items-center bg-coffee p-2 rounded-xl" href="/">
            <img className="h-8 w-8 " src="/Logo.png" alt="Coffee-Cup" />
          </Link>
          <div className="text min-w-0">
            <span className='block text-warm-white cursor-pointer'><Link href="/">GetMeACoffee</Link></span>
            <p className='text-soft-latte text-xs font-semibold cursor-default sm:text-sm'>Support Creators. Fuel Ideas. Keep the Internet Creative.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-base font-medium sm:text-lg lg:gap-x-9">
          <Link className="text-soft-latte hover:text-warm-white transition-colors duration-200" href="/about">
            About
          </Link>
          <Link className="text-soft-latte hover:text-warm-white transition-colors duration-200" href="/privacy">
            Privacy
          </Link>
          <Link className="text-soft-latte hover:text-warm-white transition-colors duration-200" href="/terms">
            Terms
          </Link>
          <Link className="text-soft-latte hover:text-warm-white transition-colors duration-200" href="/contact">
            Contact
          </Link>
        </div>
        <div className="flex w-fit items-center gap-5 text-lg font-semibold lg:ml-auto lg:w-[15%] lg:justify-end lg:pr-4">
          <Link className="text-warm-white hover:text-soft-latte transition-colors duration-200" href="https://github.com/chiragackerman/Get-Me-A-Coffee" target="_blank" rel="noopener noreferrer">
            <div
              className="cursor-pointer flex h-8 w-8 items-center justify-center"
              onMouseEnter={() => replayIcon(githubIconRef)}
              role="img"
              aria-label="Github"
            >
              <Player ref={githubIconRef} icon={GithubIcon} size={32} />
            </div>
          </Link>
          <Link className="text-warm-white hover:text-soft-latte transition-colors duration-200" href="https://www.youtube.com/@Chirag.ackerman" target="_blank" rel="noopener noreferrer">
            <div
              className="cursor-pointer flex h-8 w-8 items-center justify-center"
              onMouseEnter={() => replayIcon(youtubeIconRef)}
              role="img"
              aria-label="Youtube"
            >
              <Player ref={youtubeIconRef} icon={YoutubeIcon} size={32} />
            </div>
          </Link>
          <Link className="text-warm-white hover:text-soft-latte transition-colors duration-200" href="https://www.instagram.com/chirag.ackerman/" target="_blank" rel="noopener noreferrer">
            <div
              className="cursor-pointer flex h-8 w-8 items-center justify-center"
              onMouseEnter={() => replayIcon(instagramIconRef)}
              role="img"
              aria-label="Instagram"
            >
              <Player ref={instagramIconRef} icon={InstagramIcon} size={32} />
            </div>
          </Link>
        </div>
      </div>
      <hr className="border-coffee w-[98%] mx-auto my-1" />
      <div className="cursor-default flex flex-col items-center gap-2 px-4 py-3 text-center text-soft-latte sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p>&copy; {formatDateIST(new Date(), { year: 'numeric' })} GetMeACoffee. All rights reserved.</p>
        <p className="text-center sm:pr-2 sm:text-right">
          Built with <span className="text-[#C47A44]">☕</span> &{" "}
          <span className="text-[#C47A44]">❤️</span> by{" "}
          <span className="font-medium">
            Chirag.ackerman
          </span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
