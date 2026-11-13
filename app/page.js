import Footer from "@/Components/Footer";
import SessionWrapper from "@/Components/SessionWrapper";
import FeaturedCreators from "./FeaturedCreators";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <SessionWrapper>
      <div className="hero relative overflow-hidden border-b border-coffee-border bg-[#f8ecd9]">
        <div className="absolute inset-0">
          <img className="h-full w-full object-cover object-right md:object-center" src="/CafeBg.png" alt="Cafe background" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-espresso/55 md:bg-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-12 lg:py-20">
          <div className="max-w-3xl text-left sm:max-w-2xl">
            <div className="tag w-fit cursor-default rounded-3xl bg-soft-latte px-4 py-2 text-sm font-semibold text-caramel sm:text-base">
              <div className="flex items-center gap-3">
                <div className="img flex items-center rounded-xl"><img className="h-6 w-6" src="/support.png" alt="Coffee-Cup" /></div>
                <span>Support Creators</span>
              </div>
            </div>
            <h1 className="mt-4 cursor-default font-heading text-4xl font-bold text-warm-white drop-shadow-sm md:text-espresso sm:text-5xl lg:text-7xl">
              Fuel creativity,
              <br />
              one <span className="text-caramel">coffee</span> at a time.
            </h1>
            <p className="mt-4 max-w-xl cursor-default text-base font-bold text-warm-white sm:text-xl lg:text-2xl md:text-mocha">
              Support your favorite creators and help them bring their ideas to life with just a cup of virtual coffee. Every cup counts!
            </p>
            <div className="btns mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="#featured-creators" className="flex cursor-pointer items-center justify-center gap-3 rounded-4xl bg-coffee px-5 py-3 text-base font-medium text-warm-white transition-colors duration-300 hover:bg-dark-roast sm:px-7 sm:text-xl">
                <div className="img flex items-center rounded-xl"><img className="h-8 w-8" src="/Logo.png" alt="Coffee-Cup" /></div>
                <span className="flex items-center gap-3">Buy a Coffee <span className="text-2xl font-bold">→</span></span>
              </Link>
              <Link href="/creators" className="flex cursor-pointer items-center justify-center gap-3 rounded-4xl border border-coffee bg-latte px-5 py-3 text-base font-medium text-coffee transition-colors duration-300 hover:bg-soft-latte sm:px-7 sm:text-xl">
                <div className="img flex items-center rounded-xl"><img className="h-8 w-8" src="/group.png" alt="Group" /></div>
                <span className="flex items-center">Explore Creators</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div id="featured-creators" className="featured-creator-section scroll-mt-24 mx-auto my-2 mt-6 w-full max-w-7xl px-4 sm:px-6">
        <div className="heading mx-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="part1 flex items-center gap-3">
            <div className="icon"><img className="h-8 w-8" src="/star.png" alt="star" /></div>
            <div className="text text-2xl font-bold text-dark-roast font-heading sm:text-3xl">Featured Creators</div>
          </div>
          <div className="part2">
            <Link
              className="flex items-center gap-3 font-semibold text-base text-espresso transition-colors duration-300 hover:text-caramel sm:text-xl"
              href="/creators"
            >
              View all creators<span className="text-2xl font-bold">→</span>
            </Link>
          </div>
        </div>
        <FeaturedCreators />
      </div>

      <div className="highlight-section w-full px-2 pb-5 sm:px-4">
        <div className="content mb-5 mx-auto w-[92vw] rounded-2xl bg-latte p-3 sm:p-5 lg:p-6">
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            <li className="flex items-center gap-3 rounded-xl bg-warm-white/60 p-3">
              <div className="icon"><img className="h-8 w-8" src="/verified.png" alt="verified" /></div>
              <div className="text">
                <div className="heading text-lg font-bold text-dark-roast sm:text-xl">Real People</div>
                <div className="subheading text-sm font-medium text-mocha">Support independent creators</div>
              </div>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-warm-white/60 p-3">
              <div className="icon"><img className="h-8 w-8" src="/like.png" alt="like" /></div>
              <div className="text">
                <div className="heading text-lg font-bold text-dark-roast sm:text-xl">Big Impact</div>
                <div className="subheading text-sm font-medium text-mocha">See the difference you make</div>
              </div>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-warm-white/60 p-3">
              <div className="icon"><img className="h-8 w-8" src="/flash.png" alt="flash" /></div>
              <div className="text">
                <div className="heading text-lg font-bold text-dark-roast sm:text-xl">Simple & Secure</div>
                <div className="subheading text-sm font-medium text-mocha">Easy to use, safe transactions</div>
              </div>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-warm-white/60 p-3">
              <div className="icon"><img className="h-9 w-9" src="/community.png" alt="community" /></div>
              <div className="text">
                <div className="heading text-lg font-bold text-dark-roast sm:text-xl">Growing Community</div>
                <div className="subheading text-sm font-medium text-mocha">Join a supportive network</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Footer/>
      </SessionWrapper>
    </>
  );
}
