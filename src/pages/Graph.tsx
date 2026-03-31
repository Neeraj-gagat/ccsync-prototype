import { AppBar } from "../components/Appbar"

export const Graph = () => {
    return <div>
        <AppBar/>
        <div className="w-full pt-20 px-20 bg-[#060E20] h-screen">
            <div className=" relative inline-block">
            {/* Glow background */}
            <div className="absolute inset-0 blur-xl bg-[#34D4FD]/20 rounded-full"></div>

            {/* Text */}
            <h2 className="relative text-4xl font-semibold tracking-tight bg-gradient-to-r from-[#34D4FD] via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Graph View
            </h2>
          </div>
            <p className="text-gray-400 mb-6">
                will work on this in gsoc time preriod, for now just a placeholder
            </p>
        </div>
    </div>
}