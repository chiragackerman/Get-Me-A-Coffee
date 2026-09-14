'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Player } from '@lordicon/react'
import GithubIcon from '../public/github_logo.json'
import InstagramIcon from '../public/instagram_logo.json'
import YoutubeIcon from '../public/youtube_logo.json'

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
    <nav className="fixed bottom-0 z-10 bg-espresso border-t border-coffee-border w-full text-warm-white">
      <div className='flex justify-between items-center p-4 py-3 px-5 w-full mx-auto'>
        <div className="logo flex items-center gap-3 text-2xl font-bold">
          <Link className="img cursor-pointer flex items-center bg-coffee p-2 rounded-xl" href="/">
            <img className="h-8 w-8 " src="/Logo.png" alt="Coffee-Cup" />
          </Link>
          <div className="text flex-row">
            <span className='text-warm-white cursor-pointer'><Link href="/">GetMeACoffee</Link></span>
            <p className='text-soft-latte text-sm font-semibold cursor-default'>Support Creators. Fuel Ideas. Keep the Internet Creative.</p>
          </div>
        </div>
        <div className="flex text-lg font-medium space-x-9 ">
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
        <div className="flex w-[15%] justify-end text-lg font-semibold space-x-5 pr-4 ">
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
      <div className="cursor-default px-6 py-3 flex justify-between text-soft-latte">
        <p>&copy; {new Date().getFullYear()} GetMeACoffee. All rights reserved.</p>
        <p className="text-center sm:text-right pr-2">
          Built with <span className="text-[#C47A44]">☕</span> &{" "}
          <span className="text-[#C47A44]">❤️</span> by{" "}
          <span className="font-medium">
            Chirag.ackerman
          </span>
        </p>
      </div>
    </nav>
  )
}

export default Footer
