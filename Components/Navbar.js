import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-warm-white border-b border-coffee-border">
        <div className="logo flex items-center gap-2 text-2xl font-bold"><div className="img flex items-center bg-[#6F4E37] p-2 rounded-xl"><img className="h-6 w-6 " src="/Logo.png" alt="Coffee-Cup" /></div><div className="text">GetMeACoffee</div></div>
        <ul className="flex text-lg font-semibold space-x-7">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
        </ul>
    </nav>
  )
}

export default Navbar
