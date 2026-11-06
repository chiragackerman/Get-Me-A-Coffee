'use client'
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image'

const SignInPage = () => {
    const { data: session } = useSession()
      if (session) {
        return <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      }
      
    return (
        
        <main className="relative isolate flex min-h-[calc(100svh-77px)] items-center overflow-hidden border-b border-coffee-border bg-[#f8ecd9] px-4 py-8 sm:px-8">
            <Image
                className="object-cover object-right"
                src="/CafeBg.png"
                alt=""
                aria-hidden="true"
                fill
                sizes="100vw"
                loading="eager"
            />
            <div className="relative z-10 w-full max-w-md">
                <div className="w-full max-w-md rounded-2xl border border-[var(--color-coffee-border)] bg-[var(--color-warm-white)] px-8 py-7 ml-[30%] shadow-[0_8px_30px_rgba(111,78,55,0.08)]">

                    {/* Logo + Brand */}
                    <div className="mb-6 flex flex-col items-center">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-coffee)] text-xl shadow-sm">
                                ☕
                            </div>

                            <div>
                                <h2 className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-espresso)]">
                                    GetMeACoffee
                                </h2>

                                <p className="text-xs text-[var(--color-muted-coffee)]">
                                    Support Creators. Fuel Ideas.
                                </p>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-bold text-[var(--color-espresso)]">
                            Sign In
                        </h1>

                        <p className="mt-2 text-sm text-[var(--color-mocha)]">
                            Welcome back! Please sign in to continue.
                        </p>
                    </div>

                    {/* Social Sign In Options */}
                    <div className="space-y-3">

                        {/* Google */}
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            type="button"
                            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-[var(--color-coffee-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-espresso)] transition-all duration-200 hover:bg-[var(--color-latte)] hover:shadow-sm active:scale-[0.98]"
                        >
                            <span className="text-lg font-bold"><img src="/google_icon.png" alt="" className='w-6' /></span>
                            <span>Continue with Google</span>
                        </button>

                        {/* GitHub */}
                        <button
                            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                            type="button"
                            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-[var(--color-coffee-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-espresso)] transition-all duration-200 hover:bg-[var(--color-latte)] hover:shadow-sm active:scale-[0.98]"
                        >
                            <span className="text-lg"><img src="/github_icon_2.png" alt="" className='w-6' /></span>
                            <span>Continue with GitHub</span>
                        </button>

                        {/* Apple */}
                        {/* <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--color-coffee-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-espresso)] transition-all duration-200 hover:bg-[var(--color-latte)] hover:shadow-sm active:scale-[0.98]"
                        >
                            <span className="text-lg">●</span>
                            <span>Continue with Apple</span>
                        </button> */}

                        {/* Discord */}
                        {/* <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--color-coffee-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-espresso)] transition-all duration-200 hover:bg-[var(--color-latte)] hover:shadow-sm active:scale-[0.98]"
                        >
                            <span className="text-lg">◉</span>
                            <span>Continue with Discord</span>
                        </button> */}

                    </div>

                    {/* Divider */}
                    {/* <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-[var(--color-coffee-border)]" />

                        <span className="text-xs font-medium text-[var(--color-muted-coffee)]">
                            or
                        </span>

                        <div className="h-px flex-1 bg-[var(--color-coffee-border)]" />
                    </div> */}

                    {/* Email */}
                    {/* <button
                        type="button"
                        className="flex w-full items-center justify-center gap-3 rounded-full bg-[var(--color-coffee)] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-dark-roast)] hover:shadow-md active:scale-[0.98]"
                    >
                        <span className="text-lg">✉</span>
                        <span>Continue with Email</span>
                    </button> */}

                    {/* Sign Up */}
                    <p className="mt-5 text-center text-sm text-[var(--color-mocha)]">
                        Don&apos;t have an account?{" "}
                        <a
                            // href="/signup"
                            className="font-semibold text-[var(--color-caramel)] transition-colors hover:text-[var(--color-dark-roast)]"
                        >
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default SignInPage
