"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface NavigationProps {
  onProfileClick?: () => void;
}

export function Navigation({ onProfileClick }: NavigationProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        isScrolled ? "bg-[#0A1930]/95 backdrop-blur-sm shadow-lg" : "bg-gradient-to-b from-[#0A1930] to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/bevgenie-logo.png"
              alt="BevGenie"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
            <Link href="/about" className="text-[#FFFFFF] hover:text-[#00C8FF] transition-colors font-medium whitespace-nowrap">
              About Us
            </Link>

            {!loading && (
              <>
                {user ? (
                  // Show user info and logout when logged in
                  <>
                    <button
                      onClick={onProfileClick}
                      className="flex items-center gap-2 px-3 py-2 text-[#FFFFFF] hover:text-[#00C8FF] hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap"
                      title="View Your Profile"
                    >
                      <User size={20} />
                      <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-2 text-[#FFFFFF] hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap"
                      title="Sign out"
                    >
                      <LogOut size={20} />
                      <span className="hidden lg:inline">Logout</span>
                    </button>
                  </>
                ) : (
                  // Show login/signup when not logged in
                  <>
                    <Link
                      href="/login"
                      className="text-[#FFFFFF] hover:text-[#00C8FF] transition-colors font-medium whitespace-nowrap"
                    >
                      Login
                    </Link>
                    <Link href="/signup">
                      <Button className="bg-[#00C8FF] text-[#0A1930] hover:bg-[#00C8FF]/90 font-semibold whitespace-nowrap px-4">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}

            <Button className="bg-white/10 text-[#FFFFFF] hover:bg-white/20 font-semibold whitespace-nowrap px-4 border border-[#00C8FF]/30">
              Talk to an expert
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#FFFFFF] p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#00C8FF]/20">
            <div className="flex flex-col gap-4">
              <Link
                href="/about"
                className="text-[#FFFFFF] hover:text-[#00C8FF] transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>

              {!loading && (
                <>
                  {user ? (
                    // Show user info and logout in mobile menu
                    <>
                      <button
                        onClick={() => {
                          onProfileClick?.();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-[#FFFFFF] hover:text-[#00C8FF] transition-colors font-medium py-2"
                      >
                        <User size={20} />
                        <span>{user.email}</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-[#FFFFFF] hover:text-red-400 transition-colors font-medium py-2"
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    // Show login/signup in mobile menu
                    <>
                      <Link
                        href="/login"
                        className="text-[#FFFFFF] hover:text-[#00C8FF] transition-colors font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="bg-[#00C8FF] text-[#0A1930] hover:bg-[#00C8FF]/90 font-semibold w-full">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}

              <Button className="bg-white/10 text-[#FFFFFF] hover:bg-white/20 font-semibold w-full border border-[#00C8FF]/30">
                Talk to an expert
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
