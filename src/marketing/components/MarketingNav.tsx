"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MarketingNav(): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gray-900">ATLVS</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-700 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-gray-700 hover:text-gray-900 transition-colors">
              Docs
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
              About
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="https://app.atlvs.xyz/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="https://app.atlvs.xyz/auth/signup">
              <Button variant="default">Start Free</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/features"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link
              href="/blog"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 space-y-2">
              <Link href="https://app.atlvs.xyz/auth/signin" className="block">
                <Button variant="ghost" className="w-full">Sign In</Button>
              </Link>
              <Link href="https://app.atlvs.xyz/auth/signup" className="block">
                <Button variant="default" className="w-full">Start Free</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
