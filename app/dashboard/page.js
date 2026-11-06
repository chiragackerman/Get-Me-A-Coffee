'use client'

import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const fallbackProfileImage = '/user_pofile_icon.png'

export default function Dashboard() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/signin')
    },
  })

  if (status !== 'authenticated') {
    return (
      <main className="flex flex-1 items-center justify-center bg-cream px-4 py-12">
        <p className="text-mocha">Checking your session...</p>
      </main>
    )
  }

  const userName = session.user?.name || 'there'
  const profileImage = session.user?.image || fallbackProfileImage

  return (
    <main className="flex flex-1 items-center justify-center bg-latte px-4 py-12 sm:px-6">
      <section className="w-full max-w-lg rounded-2xl border border-coffee-border bg-warm-white px-6 py-10 text-center shadow-[0_8px_30px_rgba(111,78,55,0.08)] sm:px-10">
        <Image
          src={profileImage}
          alt={`${userName}'s profile`}
          width={112}
          height={112}
          unoptimized
          className="mx-auto h-28 w-28 rounded-full border-4 border-latte bg-white object-cover shadow-sm"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = fallbackProfileImage
          }}
        />
        <h1 className="mt-6 font-heading text-3xl font-bold text-espresso sm:text-4xl">
          Welcome, {userName}!
        </h1>
        <div className="buttons flex-col gap-2">
          <button
            className="mt-6 cursor-pointer rounded-full px-7 py-3 font-semibold transition-colors border border-coffee bg-latte text-coffee hover:bg-soft-latte duration-300">
            Setup your profile
          </button>
          <br />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/signin' })}
            className="mt-2 cursor-pointer rounded-full bg-coffee px-7 py-3 text-sm font-semibold text-warm-white transition-colors duration-200 hover:bg-dark-roast"
          >
            Sign Out
          </button>
        </div>
      </section>
    </main>
  )
}
