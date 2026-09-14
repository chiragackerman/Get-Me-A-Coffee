export default function Home() {
  return (
    <>
      <div className="hero border-b border-coffee-border relative h-full bg-[#f8ecd9]">
        <img className="h-full w-full object-contain object-right" src="/CafeBg.png" alt="Cafe background" />
        <div className="text-content absolute top-[25%] left-[10%]">
          <div className="tag flex items-center gap-3 text-md font-semibold text-caramel bg-soft-latte px-4 py-2 rounded-3xl w-fit">
            <div className="img flex items-center rounded-xl"><img className="h-6 w-6 " src="/support.png" alt="Coffee-Cup" /></div>
            <span>Support Creators</span>
          </div>
          <h1 className="font-heading mt-2 text-7xl font-bold text-espresso">
            Fuel creativity,
            <br />
            one <span className="text-caramel">coffee</span> at a time.
          </h1>
          <p className="mt-4 max-w-xl text-2xl font-bold text-mocha font-inter">
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
    </>
  );
}
