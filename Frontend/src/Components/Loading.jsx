import React from 'react'

function Loading() {
  return (
    <div className="flex items-center space-x-2 w-max max-w-[70px] bg-gray-100 rounded-2xl px-4 py-2 shadow">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Loading
  