"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              BinzoFun
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user?.email !== "admin@gamehub.com" && (
              <>
                <Link href="/games" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Games
                </Link>
                <Link href="/profile" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
              </>
            )}
            {user?.email === "admin@gamehub.com" && (
              <Link href="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Admin
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm">Welcome, {user.username}</span>
                <Button variant="outline" size="sm" onClick={logout} className="text-white border-gray-600 hover:text-white">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" size="sm" className="text-white border-gray-600 hover:text-white">
                <Link href="/auth/login">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800">
            {user?.email !== "admin@gamehub.com" && (
              <>
                <Link
                  href="/games"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Games
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Profile
                </Link>
              </>
            )}
            {user?.email === "admin@gamehub.com" && (
              <Link
                href="/admin"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Admin
              </Link>
            )}
            {user ? (
              <div className="ml-3 mt-2">
                <div className="text-gray-300 text-sm mb-2">Welcome, {user.username}</div>
                <Button variant="outline" size="sm" onClick={logout} className="text-white border-gray-600 hover:text-white">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" size="sm" className="text-white border-gray-600 hover:text-white ml-3 mt-2">
                <Link href="/auth/login">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}