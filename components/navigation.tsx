'use client';

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Menu, User, LogOut, Home as HomeIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface NavigationProps {
  onProfileClick?: () => void;
  onHomeClick?: () => void;
}

/**
 * Production-ready Navigation Component
 * Built with Tailwind CSS + shadcn/ui components
 * Professional B2B SaaS navigation with responsive mobile Sheet
 */
export function Navigation({ onProfileClick, onHomeClick }: NavigationProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const handleNavClick = (callback?: () => void) => {
    callback?.()
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/95 backdrop-blur-lg shadow-lg border-b border-slate-800"
          : "bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
            onClick={() => handleNavClick(onHomeClick)}
          >
            <Image
              src="/images/bevgenie-logo.png"
              alt="BevGenie"
              width={140}
              height={40}
              className="h-8 w-auto transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Button
              variant="ghost"
              onClick={onHomeClick}
              className="text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium transition-colors"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Home
            </Button>

            <Link href="/about">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium transition-colors"
              >
                About Us
              </Button>
            </Link>

            <Separator orientation="vertical" className="h-8 bg-slate-800" />

            {!loading && (
              <>
                {user ? (
                  // Authenticated State
                  <>
                    <Button
                      variant="ghost"
                      onClick={onProfileClick}
                      className="text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
                      title="View Your Profile"
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="text-slate-300 hover:text-red-400 hover:bg-slate-800/50 transition-colors"
                      title="Sign out"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span className="hidden lg:inline">Logout</span>
                    </Button>
                  </>
                ) : (
                  // Unauthenticated State
                  <>
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className="text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium transition-colors"
                      >
                        Login
                      </Button>
                    </Link>

                    <Link href="/signup">
                      <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-lg shadow-cyan-600/25 transition-all">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}

            <Button
              className="bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 text-white font-semibold border border-cyan-500/30 hover:border-cyan-500/50 transition-all"
            >
              Talk to an expert
            </Button>
          </div>

          {/* Mobile Menu - shadcn/ui Sheet */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50"
                  aria-label="Toggle menu"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-slate-950 border-slate-800"
              >
                <SheetHeader>
                  <SheetTitle className="text-white font-display text-xl">
                    Menu
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => handleNavClick(onHomeClick)}
                    className="justify-start text-slate-300 hover:text-white hover:bg-slate-800/50 h-12"
                  >
                    <HomeIcon className="w-5 h-5 mr-3" />
                    Home
                  </Button>

                  <Link href="/about" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50 h-12"
                    >
                      About Us
                    </Button>
                  </Link>

                  <Separator className="bg-slate-800" />

                  {!loading && (
                    <>
                      {user ? (
                        // Mobile Authenticated State
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => handleNavClick(onProfileClick)}
                            className="justify-start text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 h-12"
                          >
                            <User className="w-5 h-5 mr-3" />
                            {user.email}
                          </Button>

                          <Button
                            variant="ghost"
                            onClick={handleSignOut}
                            className="justify-start text-slate-300 hover:text-red-400 hover:bg-slate-800/50 h-12"
                          >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        // Mobile Unauthenticated State
                        <>
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50 h-12"
                            >
                              Login
                            </Button>
                          </Link>

                          <Link href="/signup" onClick={() => setIsOpen(false)}>
                            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold h-12">
                              Sign Up
                            </Button>
                          </Link>
                        </>
                      )}
                    </>
                  )}

                  <Separator className="bg-slate-800" />

                  <Button
                    className="w-full bg-slate-800/50 hover:bg-slate-700/50 text-white font-semibold border border-cyan-500/30 h-12"
                  >
                    Talk to an expert
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
