import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="hero border-b border-coffee-border relative h-[70vh] overflow-hidden bg-[#f8ecd9]">
        <img className="h-full w-full object-contain object-right" src="/CafeBg.png" alt="Cafe background" />
        <div className="text-content absolute top-[22%] left-[10%]">
          <div className="tag cursor-default flex items-center gap-3 text-md font-semibold text-caramel bg-soft-latte px-4 py-2 rounded-3xl w-fit">
            <div className="img flex items-center rounded-xl"><img className="h-6 w-6 " src="/support.png" alt="Coffee-Cup" /></div>
            <span>Support Creators</span>
          </div>
          <h1 className="cursor-default font-heading mt-2 text-7xl font-bold text-espresso">
            Fuel creativity,
            <br />
            one <span className="text-caramel">coffee</span> at a time.
          </h1>
          <p className="cursor-default mt-4 max-w-xl text-2xl font-bold text-mocha font-inter">
            Support your favorite creators and help them bring their ideas to life with just a cup of virtual coffee. Every cup counts!
          </p>
          <div className="btns flex mt-5 gap-4">
            <button className="text-xl cursor-pointer flex gap-3 justify-center items-center rounded-4xl bg-coffee px-7 py-3 font-medium text-warm-white transition-colors hover:bg-dark-roast duration-300">
              <div className="img flex items-center rounded-xl"><img className="h-8 w-8 " src="/Logo.png" alt="Coffee-Cup" /></div>
              <span className="flex items-center gap-3">Buy a Coffee <span className="text-2xl font-bold">→</span></span>
            </button>
            <button className="text-xl cursor-pointer flex gap-3 justify-center items-center rounded-4xl px-7 py-3 font-medium transition-colors border border-coffee bg-latte text-coffee hover:bg-soft-latte duration-300">
              <div className="img flex items-center rounded-xl"><img className="h-8 w-8 " src="/group.png" alt="Group" /></div>
              <span className="flex items-center">Explore Creators</span>
            </button>
          </div>
        </div>
      </div>

      <div className="featured-creator-section py-0 w-[95vw] my-2 mt-6 mx-auto ">
        <div className="heading cursor-default flex items-center justify-between mx-1">
          <div className="part1 flex items-center gap-3">
            <div className="icon"><img className="h-8 w-8" src="/star.png" alt="star" /></div>
            <div className="text text-3xl font-bold text-dark-roast font-heading">Featured Creators</div>
          </div>
          <div className="part2">
            <span className="hover:text-caramel transition-colors duration-300 cursor-pointer flex items-center font-semibold text-xl gap-3 mx-2">View all creators<span className="text-2xl font-bold">→</span></span>
          </div>
        </div>
        <div className="content flex items-center justify-between gap-4 overflow-x-auto py-5">
          <div className="card1">
            <div className="cursor-default relative h-[280px] w-[350px] rounded-2xl border border-[#E5D8C8] bg-[#FFF8EF] p-5 shadow-[0_8px_24px_rgba(111,78,55,0.08)]">
              {/* Profile section */}
              <div className="flex items-center gap-3">
                <Image
                  src="/profile.jpg"
                  alt="Chirag Ackerman"
                  width={58}
                  height={58}
                  className="h-[58px] w-[58px] rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-bold text-[#2B2118]">
                      Chirag Ackerman
                    </h3>

                    <span className="icon"><img className="h-6 w-6" src="/verified_purple.png" alt="purple_tick" /></span>
                  </div>

                  <p className="mt-0.5 text-sm text-mocha">
                    Developer / Content Creator
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="mt-5 text-[14px] leading-6 text-mocha">
                Sharing my journey as a developer and content creator.
              </p>

              <p className="mt-4 text-[14px] italic leading-6 text-mocha">
                “Help me keep creating and experimenting
                with new ideas.”
              </p>

              {/* Bottom section */}
              <div className="absolute bottom-3 w-[89%]">
                <div className=" flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[13px] text-mocha">
                    <span className="text-[20px]">☕</span>
                    <span>28 coffees received</span>
                  </div>

                  <button
                    type="button"
                    className="cursor-pointer justify-end rounded-full bg-[#6F4E37] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#553A28] hover:shadow-md active:scale-95"
                  >
                    Support
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card2">
            <div className="cursor-default relative h-[280px] w-[350px] rounded-2xl border border-[#E5D8C8] bg-[#FFF8EF] p-5 shadow-[0_8px_24px_rgba(111,78,55,0.08)]">
              {/* Profile section */}
              <div className="flex items-center gap-3">
                <Image
                  src="/Yuvraj_pfp.png"
                  alt="Yuvraj Prajapat"
                  width={58}
                  height={58}
                  className="h-[58px] w-[58px] rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-bold text-[#2B2118]">
                      Yuvraj Prajapat
                    </h3>

                    <span className="icon"><img className="h-6 w-6" src="/verified_blue.png" alt="blue_tick" /></span>
                  </div>

                  <p className="mt-0.5 text-sm text-mocha">
                    Designer / Graphic artist
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="mt-5 text-[14px] leading-6 text-mocha">
                Creating stunning visuals & sharing design insights.
              </p>

              <p className="mt-4 text-[14px] italic leading-6 text-mocha">
                “Support my journey in the world of design and creativity.”
              </p>

              {/* Bottom section */}
              <div className="absolute bottom-3 w-[89%]">
                <div className=" flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[13px] text-mocha">
                    <span className="text-[20px]">☕</span>
                    <span>26 coffees received</span>
                  </div>

                  <button
                    type="button"
                    className="cursor-pointer justify-end rounded-full bg-[#6F4E37] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#553A28] hover:shadow-md active:scale-95"
                  >
                    Support
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card3">
            <div className="cursor-default relative h-[280px] w-[350px] rounded-2xl border border-[#E5D8C8] bg-[#FFF8EF] p-5 shadow-[0_8px_24px_rgba(111,78,55,0.08)]">
              {/* Profile section */}
              <div className="flex items-center gap-3">
                <Image
                  src="/khush_pfp.png"
                  alt="Khush Vador"
                  width={58}
                  height={58}
                  className="h-[58px] w-[58px] rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-bold text-[#2B2118]">
                      Khush Vador
                    </h3>

                    <span className="icon">
                      <img className="h-6 w-6" src="/verified_blue.png" alt="blue_tick" />
                    </span>
                  </div>

                  <p className="mt-0.5 text-sm text-mocha">
                    Recruiter / Tech Enthusiast
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="mt-5 text-[14px] leading-6 text-mocha">
                Sharing insights on tech and recruitment.
              </p>

              <p className="mt-4 text-[14px] italic leading-6 text-mocha">
                “Support my mission to connect talent with opportunities.”
              </p>

              {/* Bottom section */}
              <div className="absolute bottom-3 w-[89%]">
                <div className=" flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[13px] text-mocha">
                    <span className="text-[20px]">☕</span>
                    <span>23 coffees received</span>
                  </div>

                  <button
                    type="button"
                    className="justify-end cursor-pointer rounded-full bg-[#6F4E37] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#553A28] hover:shadow-md active:scale-95"
                  >
                    Support
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card4">
            <div className="relative cursor-default h-[280px] w-[350px] rounded-2xl border border-[#E5D8C8] bg-[#FFF8EF] p-5 shadow-[0_8px_24px_rgba(111,78,55,0.08)]">
              {/* Profile section */}
              <div className="flex items-center gap-3">
                <Image
                  src="/Abhay_pfp.jpg"
                  alt="Abhay Singh"
                  width={58}
                  height={58}
                  className="h-[58px] w-[58px] rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-bold text-[#2B2118]">
                      Abhay Singh
                    </h3>

                    <span className="icon">
                      <img className="h-6 w-6" src="/verified_blue.png" alt="blue_tick" />
                    </span>
                  </div>

                  <p className="mt-0.5 text-sm text-mocha">
                    Sketch Artist / Illustrator
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="mt-5 text-[14px] leading-6 text-mocha">
                Creating beautiful sketches and illustrations, sharing tips and techniques.
              </p>

              <p className="mt-4 text-[14px] italic leading-6 text-mocha">
                “Support my artistic journey and help me bring my sketches to life.”
              </p>

              {/* Bottom section */}
              <div className="absolute bottom-3 w-[89%]">
                <div className=" flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[13px] text-mocha">
                    <span className="text-[20px]">☕</span>
                    <span>20 coffees received</span>
                  </div>

                  <button
                    type="button"
                    className="justify-end cursor-pointer rounded-full bg-[#6F4E37] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#553A28] hover:shadow-md active:scale-95"
                  >
                    Support
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card5">
            <div className="relative cursor-default h-[280px] w-[350px] rounded-2xl border border-[#E5D8C8] bg-[#FFF8EF] p-5 shadow-[0_8px_24px_rgba(111,78,55,0.08)]">
              {/* Profile section */}
              <div className="flex items-center gap-3">
                <Image
                  src="/Shubham_pfp.jpg"
                  alt="Shubham Gupta"
                  width={58}
                  height={58}
                  className="h-[58px] w-[58px] rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-bold text-[#2B2118]">
                      Shubham Gupta
                    </h3>

                    <span className="icon">
                      <img className="h-6 w-6" src="/verified_blue.png" alt="blue_tick" />
                    </span>
                  </div>

                  <p className="mt-0.5 text-sm text-mocha">
                    Ethical Hacking / Linux Entusiast
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="mt-5 text-[14px] leading-6 text-mocha">
                Exploring the world of Linux and ethical hacking, sharing knowledge and tutorials.
              </p>

              <p className="mt-4 text-[14px] italic leading-6 text-mocha">
                “Support my journey in cybersecurity and ethical hacking.”
              </p>

              {/* Bottom section */}
              <div className="absolute bottom-3 w-[89%]">
                <div className=" flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[13px] text-mocha">
                    <span className="text-[20px]">☕</span>
                    <span>19 coffees received</span>
                  </div>

                  <button
                    type="button"
                    className="justify-end cursor-pointer rounded-full bg-[#6F4E37] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#553A28] hover:shadow-md active:scale-95"
                  >
                    Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="highlight-section">
        <div className="cursor-default content h-[5vw] w-[95vw] flex items-center justify-center bg-latte mb-5 mx-auto rounded-2xl">
          <ul className="flex justify-between items-center w-[90%] ">
            <li className="flex items-center gap-3">
              <div className="icon"><img className="h-8 w-8" src="/verified.png" alt="verified" /></div>
              <div className="text">
                <div className="heading text-xl font-bold text-dark-roast">Real People</div>
                <div className="subheading text-sm font-medium text-mocha">Support independent creators</div>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <div className="icon"><img className="h-8 w-8" src="/like.png" alt="like" /></div>
              <div className="text">
                <div className="heading text-xl font-bold text-dark-roast">Big Impact</div>
                <div className="subheading text-sm font-medium text-mocha">See the difference you make</div>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <div className="icon"><img className="h-8 w-8" src="/flash.png" alt="flash" /></div>
              <div className="text">
                <div className="heading text-xl font-bold text-dark-roast">Simple & Secure</div>
                <div className="subheading text-sm font-medium text-mocha">Easy to use, safe transactions</div>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <div className="icon"><img className="h-9 w-9" src="/community.png" alt="community" /></div>
              <div className="text">
                <div className="heading text-xl font-bold text-dark-roast">Growing Community</div>
                <div className="subheading text-sm font-medium text-mocha">Join a supportive network</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
