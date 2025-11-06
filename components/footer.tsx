import Link from "next/link"
import { Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#0A1930] text-[#FFFFFF] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display font-bold text-2xl mb-4">BevGenie</h3>
            <p className="text-[#FFFFFF]/80 leading-relaxed">
              Built by data and beverage industry experts to power the next generation of supplier intelligence.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-[#FFFFFF]/80 hover:text-[#00C8FF] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#FFFFFF]/80 hover:text-[#00C8FF] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/demo" className="text-[#FFFFFF]/80 hover:text-[#00C8FF] transition-colors">
                  Book a Demo
                </Link>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFFFFF]/80 hover:text-[#00C8FF] transition-colors flex items-center gap-2"
                >
                  <Linkedin size={18} />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#FFFFFF]/10">
          <p className="text-[#FFFFFF]/60 text-sm text-center">© 2025 BevGenie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
