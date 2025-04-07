import MainButton from "./button/mainButton"

export default function HeroBanner() {
    return (
        <div className="relative flex justify-center items-center banner rounded-xl overflow-hidden container mx-auto px-4 sm:px-6 md:px-8 w-full h-h-screen-80">
        <div className="absolute top-0 left-0 w-full h-full z-100 bg-black opacity-50"></div>
        <div className="relative px-8 py-16 sm:px-16 sm:py-24 ">
          <div className="max-w-3xl rounded-xl">
            <h1 className="text-5xl sm:text-7xl font-bold text-orange-500 mb-6">
              J Soccer
            </h1>
            <p className="text-m text-white/90 mb-8">
              Connect with players, schedule games, and manage your teams all in one place.
              Experience the beautiful game like never before.
            </p>
            
              <div className="flex flex-wrap gap-4">
                <MainButton text="Book Now" link="/booking" />
              </div>
          
          </div>
        </div>
      </div>
    )
}