"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const backgroundImages = [
  "/images/hero-bg-1.svg",
  "/images/hero-bg-2.svg",
  "/images/hero-bg-3.svg",
  "/images/hero-bg-4.svg",
]

export function HeroBackgroundSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {backgroundImages.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-45" : "opacity-0"
          }`}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt=""
            fill
            className="object-cover"
            style={{ mixBlendMode: "screen" }}
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}
