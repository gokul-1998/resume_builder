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
    <nav className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold">Resume Builder</h1>
            </Link>
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