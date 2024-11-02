"use client"

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">
          <Link to="/" className="hover:underline">Resume Builder</Link>
        </h1>
        <div>
          {user ? (
            <>
              <Link
                to={`/${user.username || user.email}`}
                className="text-white mr-4 hover:underline"
              >
                Welcome, {user.username || user.email}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white hover:underline">
              Login
            </Link>
          )}
        </div>
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-4">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      Create <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link to="/createResume" className="w-full">
                        Create Resume
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/createAiResume" className="w-full">
                        Create AI Resume
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  to={`/${user.username || user.email}`}
                  className="text-primary-foreground hover:bg-primary-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  <User className="inline-block mr-2 h-4 w-4" />
                  {user.username || user.email}
                </Link>
                <Button variant="secondary" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
            )}
          </div>
        </div>
        <div className="-mr-2 flex md:hidden">
          <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link
                  to="/createResume"
                  className="text-primary-foreground hover:bg-primary-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                >
                  Create Resume
                </Link>
                <Link
                  to="/createAiResume"
                  className="text-primary-foreground hover:bg-primary-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                >
                  Create AI Resume
                </Link>
                <Link
                  to={`/${user.username || user.email}`}
                  className="text-primary-foreground hover:bg-primary-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                >
                  <User className="inline-block mr-2 h-4 w-4" />
                  {user.username || user.email}
                </Link>
                <Button variant="secondary" onClick={handleLogout} className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <Link to="/login" className="block w-full">
                <Button variant="secondary" className="w-full">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
