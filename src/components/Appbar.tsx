import { NavLink } from "react-router-dom"
import { HiSearch } from "react-icons/hi";

export const AppBar = () => {
  const navItems = [
    { name: "Board", path: "/board" },
    { name: "Calendar", path: "/calendar" },
    { name: "Graph", path: "/graph" },
    { name: "Settings", path: "/settings" }
  ]

  return (
    <div className="w-full bg-[#091328] border-b border-white/10 fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center px-20 py-2">
        
        {/* <h1 className="text-white text-xl font-semibold tracking-tight">
          CCSync
        </h1> */}
        <img src="/logo.png" className="h-10" alt="logo" />

        <div className=" flex justify-between items-center gap-18">
          <div className="flex items-center gap-8 text-[11px] font-medium uppercase">
            {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"} // important for root
              className={({ isActive }) =>
                `relative px-2 py-1 transition-all duration-300 ${
                  isActive
                    ? "text-[#34D4FD]"
                    : "text-white/70 hover:text-white"
                }`
              }
            >
             {({ isActive }) => (
                <div className="relative">
                  {item.name}

                  {isActive && (
                    <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#34D4FD] shadow-[0_0_8px_#34D4FD]" />
                  )}
                </div>
              )}
            </NavLink>
          ))}
          </div>
          <HiSearch size={20} className="text-[#34D4FD] hover:text-[#34D4FD]/80" />
        </div>
      </div>
    </div>
  )
}