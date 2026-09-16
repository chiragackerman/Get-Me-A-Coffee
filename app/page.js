export default function Home() {
  return (
    <>
      <div className="hero border-b border-coffee-border relative h-full bg-[#f8ecd9]">
        <img className="h-full w-full object-contain object-right" src="/CafeBg.png" alt="Cafe background" />
        <div className="text-content absolute top-[25%] left-[10%]">
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
      <div className="highlight-section">
        <div className="content h-[5vw] w-[95vw] flex items-center justify-center bg-latte my-5 mx-auto rounded-2xl">
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
