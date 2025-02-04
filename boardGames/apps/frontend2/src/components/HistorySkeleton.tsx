import type React from "react"

const HistorySkeleton: React.FC = () => {
  return (
    <ul className="h-full w-full flex flex-col gap-4 sm:gap-6" aria-label="Loading history items">
      {[...Array(3)].map((_, index) => (
        <li key={index} className="flex items-center space-x-4" aria-hidden="true">
          <div
            className={`h-[5rem] flex-grow rounded-md bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 
                       animate-pulse`}
            style={{
              width: `${85 + Math.random() * 15}%`,
              opacity: 1 - index * 0.1,
            }}
          />
          <div
            
          />
        </li>
      ))}
    </ul>
  )
}

export default HistorySkeleton

