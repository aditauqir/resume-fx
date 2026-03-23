"use client"

import { useEffect, useState } from "react"

export function useIsMobile(breakpoint: number = 640) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 
        "ontouchstart" in window || 
        navigator.maxTouchPoints > 0

      const isSmallScreen = window.innerWidth < breakpoint

      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )

      setIsMobile(isSmallScreen || (isTouchDevice && isMobileUserAgent))
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [breakpoint])

  return isMobile
}
