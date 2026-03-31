import { useState } from "react"

export const AppBar = () => {
  const [selected, setSelected] = useState("board")

  const navItems = [
    { name: "Board", key: "board" },
    { name: "Calendar", key: "calendar" },
    { name: "Graph", key: "graph" },
    { name: "Settings", key: "settings" }
  ]

  return (
    <div className="w-full bg-[#091328] border-b border-white/10 fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center px-20 py-3">
        
        {/* Logo */}
        <div>
          <h1 className="text-white text-xl font-semibold tracking-tight">
            CCSync
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-8 text-[11px] font-medium">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.key}
              onClick={() => setSelected(item.key.toLocaleLowerCase())}
              className={`
                relative px-2 py-1 transition-all duration-300
                ${selected === item.key 
                  ? "text-[#34D4FD]" 
                  : "text-white/70 hover:text-white"}
              `}
            >
              {item.name}

              {/* Active underline */}
              {selected === item.key && (
                <span className="absolute left-0 bottom-[-6px] w-full h-[2px] bg-[#34D4FD] shadow-[0_0_8px_#34D4FD]" />
              )}
            </a>
          ))}
        </div>

      </div>
    </div>
  )
}