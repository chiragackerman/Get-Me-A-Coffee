"use client"

import { useEffect, useRef, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const fallbackProfileImage = '/user_pofile_icon.png'

export default function Dashboard() {
  const router = useRouter()
  const imageInputRef = useRef(null)
  const previewUrlRef = useRef(null)
  const [isSettingUpProfile, setIsSettingUpProfile] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [imageFailed, setImageFailed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileCreated, setProfileCreated] = useState(false)
  const [formMessage, setFormMessage] = useState(null)
  const [usernameAvailability, setUsernameAvailability] = useState({
    username: '',
    status: 'idle',
    message: '',
  })
  const usernameCheckRef = useRef(0)
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/signin')
    },
  })

  useEffect(() => () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  if (status !== 'authenticated') {
    return (
      <main className="flex flex-1 items-center justify-center bg-cream px-4 py-12">
        <p className="text-mocha">Checking your session...</p>
      </main>
    )
  }

  const userName = session.user?.name || 'there'
  const providerProfileImage = imageFailed
    ? fallbackProfileImage
    : session.user?.image || fallbackProfileImage
  const profileImage = imageFailed
    ? fallbackProfileImage
    : previewUrl || providerProfileImage

  const handleImageChange = (event) => {
    const image = event.target.files?.[0]
    if (image) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type)) {
        setFormMessage({
          type: 'error',
          text: 'Choose a JPG, PNG, or WebP profile picture.',
        })
        event.target.value = ''
        return
      }

      if (image.size > 5 * 1024 * 1024) {
        setFormMessage({
          type: 'error',
          text: 'Profile pictures must be 5 MB or smaller.',
        })
        event.target.value = ''
        return
      }

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }

      const objectUrl = URL.createObjectURL(image)
      previewUrlRef.current = objectUrl
      setPreviewUrl(objectUrl)
      setSelectedImage(image)
      setImageFailed(false)
      setFormMessage(null)
    }
    event.target.value = ''
  }

  const handleUsernameBlur = async (event) => {
    const username = event.currentTarget.value.trim().toLowerCase()
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      return
    }

    const requestId = ++usernameCheckRef.current
    setUsernameAvailability({
      username,
      status: 'checking',
      message: 'Checking username...',
    })

    try {
      const response = await fetch(
        `/api/profiles?username=${encodeURIComponent(username)}`,
        { cache: 'no-store', credentials: 'same-origin' },
      )
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Could not check username availability.')
      }
      if (requestId !== usernameCheckRef.current) {
        return
      }

      setUsernameAvailability({
        username,
        status: result.available ? 'available' : 'taken',
        message: result.available
          ? 'This username is available.'
          : 'This username is already taken.',
      })
    } catch (error) {
      if (requestId === usernameCheckRef.current) {
        setUsernameAvailability({
          username,
          status: 'error',
          message: error.message || 'Could not check username availability.',
        })
      }
    }
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (isSubmitting || profileCreated) {
      return
    }

    const submittedForm = new FormData(event.currentTarget)
    const username = String(submittedForm.get('username') || '')
      .trim()
      .toLowerCase()
    if (
      usernameAvailability.username === username
      && usernameAvailability.status === 'taken'
    ) {
      setFormMessage({ type: 'error', text: 'That username is already taken.' })
      return
    }

    setIsSubmitting(true)
    setFormMessage(null)

    try {
      submittedForm.delete('profileImage')
      submittedForm.set(
        'profileImageUrl',
        providerProfileImage,
      )

      if (selectedImage) {
        submittedForm.set('profileImage', selectedImage)
      }

      const response = await fetch('/api/profiles', {
        method: 'POST',
        body: submittedForm,
        credentials: 'same-origin',
      })
      const result = await response.json().catch(() => null)

      if (
        !response.ok
        || response.status !== 201
        || !result?.profile?.username
      ) {
        if (result?.code === 'USERNAME_TAKEN') {
          setUsernameAvailability({
            username,
            status: 'taken',
            message: 'This username is already taken.',
          })
        }
        throw new Error(
          result?.error || `Profile creation failed (HTTP ${response.status}).`,
        )
      }

      setProfileCreated(true)
      setFormMessage({
        type: 'success',
        text: `Your creator profile @${result.profile.username} was created successfully.`,
      })
      router.replace(`/${encodeURIComponent(result.profile.username)}`)
    } catch (error) {
      setFormMessage({
        type: 'error',
        text: error.message || 'Could not create your profile. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-4 py-6 sm:px-6 sm:py-10">
      {isSettingUpProfile ? (
        <section className="w-full max-w-5xl rounded-3xl border border-coffee-border bg-warm-white p-5 shadow-lg sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-caramel">
                Creator profile
              </p>
              <h1 className="font-heading text-3xl font-bold text-espresso sm:text-4xl">
                Tell your story
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-mocha sm:text-base">
                Give your supporters a warm introduction to you and the work you
                love to create.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSettingUpProfile(false)}
              className="rounded-full border border-coffee-border px-4 py-2 text-sm font-semibold text-coffee transition-colors hover:bg-latte focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee"
            >
              Back
            </button>
          </div>

          <form onSubmit={handleSave}>
            <input
              type="hidden"
              name="profileImageUrl"
              value={providerProfileImage}
            />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.5fr)]">
              <div className="flex flex-col items-center rounded-2xl border border-coffee-border bg-cream p-6 text-center sm:p-8">
                <h2 className="text-base font-semibold text-espresso">
                  Profile picture
                </h2>
                <p className="mt-1 text-sm text-mocha">
                  A friendly face helps people connect with your work.
                </p>
                <div className="relative mt-6">
                  <Image
                    src={profileImage}
                    alt={`${userName}'s profile picture`}
                    width={144}
                    height={144}
                    unoptimized
                    className="h-36 w-36 rounded-full border-4 border-warm-white bg-latte object-cover shadow-md"
                    onError={() => setImageFailed(true)}
                  />
                  <button
                    type="button"
                    aria-label="Change Profile Picture"
                    title="Change Profile Picture"
                    onClick={() => imageInputRef.current?.click()}
                    className="absolute bottom-1 right-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-warm-white bg-coffee text-lg text-warm-white shadow-md transition-colors hover:bg-dark-roast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee"
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    name="profileImage"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="sr-only"
                    aria-label="Choose a profile picture"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="mt-4 text-sm font-semibold text-caramel underline decoration-coffee-border underline-offset-4 transition-colors hover:text-dark-roast focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coffee"
                >
                  Change Profile Picture
                </button>
                {selectedImage && (
                  <p className="mt-2 max-w-full truncate text-xs text-muted-coffee">
                    {selectedImage.name}
                  </p>
                )}
              </div>

              <div className="grid content-start gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="display-name"
                    className="mb-2 block text-sm font-semibold text-espresso"
                  >
                    Display name
                  </label>
                  <input
                    id="display-name"
                    name="displayName"
                    type="text"
                    minLength={3}
                    maxLength={80}
                    title="Use 3–80 characters"
                    required
                    defaultValue={session.user?.name || ''}
                    placeholder="How should supporters know you?"
                    className="w-full rounded-xl border border-coffee-border bg-white px-4 py-3 text-espresso placeholder:text-muted-coffee focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-espresso"
                  >
                    Username
                  </label>
                  <div className="flex items-center rounded-xl border border-coffee-border bg-white px-4 focus-within:border-caramel focus-within:ring-2 focus-within:ring-caramel/20">
                    <span className="pr-2 text-mocha" aria-hidden="true">
                      @
                    </span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      minLength={3}
                      maxLength={20}
                      pattern="[A-Za-z0-9_]+"
                      title="Use 3–20 letters, numbers, or underscores."
                      placeholder="yourname"
                      autoComplete="username"
                      onBlur={handleUsernameBlur}
                      onChange={() => {
                        usernameCheckRef.current += 1
                        setUsernameAvailability({
                          username: '',
                          status: 'idle',
                          message: '',
                        })
                      }}
                      className="min-w-0 flex-1 bg-transparent py-3 text-espresso placeholder:text-muted-coffee focus:outline-none"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-coffee">
                    3–20 letters, numbers, or underscores.
                  </p>
                  {usernameAvailability.message && (
                    <p
                      role="status"
                      className={`mt-1.5 text-xs ${
                        usernameAvailability.status === 'taken'
                          || usernameAvailability.status === 'error'
                          ? 'text-red-700'
                          : 'text-mocha'
                      }`}
                    >
                      {usernameAvailability.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="creator-category"
                    className="mb-2 block text-sm font-semibold text-espresso"
                  >
                    Creator category
                  </label>
                  <input
                    id="creator-category"
                    name="creatorCategory"
                    type="text"
                    required
                    maxLength={80}
                    list="creator-categories"
                    placeholder="e.g. Developer / Content Creator"
                    className="w-full rounded-xl border border-coffee-border bg-white px-4 py-3 text-espresso placeholder:text-muted-coffee focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/20"
                  />
                  <datalist id="creator-categories">
                    <option value="Developer / Content Creator" />
                    <option value="Designer / Graphic Artist" />
                    <option value="Writer" />
                    <option value="Artist" />
                  </datalist>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="about"
                    className="mb-2 block text-sm font-semibold text-espresso"
                  >
                    About your work
                  </label>
                  <textarea
                    id="about"
                    name="description"
                    required
                    rows={5}
                    minLength={10}
                    maxLength={1000}
                    placeholder="I create things that make people curious, solve everyday problems, or simply bring a little joy. Your support helps me spend more time bringing those ideas to life..."
                    className="w-full resize-y rounded-xl border border-coffee-border bg-white px-4 py-3 leading-6 text-espresso placeholder:text-muted-coffee focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/20"
                  />
                </div>
              </div>
            </div>

            {formMessage && (
              <p
                role={formMessage.type === 'error' ? 'alert' : 'status'}
                className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                  formMessage.type === 'success'
                    ? 'border-green-700/20 bg-green-50 text-green-800'
                    : 'border-red-700/20 bg-red-50 text-red-800'
                }`}
              >
                {formMessage.text}
              </p>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-coffee-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted-coffee">
                Your profile details can be edited later.
              </p>
              <button
                type="submit"
                disabled={isSubmitting || profileCreated}
                className="w-full rounded-full bg-coffee px-7 py-3.5 font-semibold text-warm-white shadow-sm transition-colors hover:bg-dark-roast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting
                  ? 'Creating Profile...'
                  : profileCreated
                    ? 'Profile Created'
                    : 'Save and Create Profile'}
              </button>
            </div>
          </form>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/signin' })}
            className="mt-5 text-sm font-semibold text-mocha transition-colors hover:text-espresso"
          >
            Sign Out
          </button>
        </section>
      ) : (
        <section className="w-full max-w-lg rounded-2xl border border-coffee-border bg-warm-white px-6 py-10 text-center shadow-md sm:px-10">
          <Image
            src={profileImage}
            alt={`${userName}'s profile`}
            width={112}
            height={112}
            unoptimized
            className="mx-auto h-28 w-28 rounded-full border-4 border-latte bg-white object-cover shadow-sm"
            onError={() => setImageFailed(true)}
          />
          <h1 className="mt-6 font-heading text-3xl font-bold text-espresso sm:text-4xl">
            Welcome, {userName}!
          </h1>
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSettingUpProfile(true)}
              className="cursor-pointer rounded-full border border-coffee bg-latte px-7 py-3 font-semibold text-coffee transition-colors duration-300 hover:bg-soft-latte"
            >
              Create Profile
            </button>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/signin' })}
              className="cursor-pointer rounded-full bg-coffee px-7 py-3 text-sm font-semibold text-warm-white transition-colors duration-200 hover:bg-dark-roast"
            >
              Sign Out
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
