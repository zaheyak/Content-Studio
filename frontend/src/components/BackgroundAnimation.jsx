import React from 'react'

const BackgroundAnimation = () => {
  return (
    <>
      {/* Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-cyan-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 animate-pulse"></div>
      
      {/* Floating Particles */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-500 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </>
  )
}

export default BackgroundAnimation
