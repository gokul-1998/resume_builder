import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import { Menu, X, ChevronDown, User, LogOut, FileText, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

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
  const { user: authUser, isAuthenticated: authIsAuthenticated, handleLogout: authLogout } = useAuth()
  const { isAuthenticated: reduxIsAuthenticated, user: reduxUser } = useSelector((state) => state.auth)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Use either auth source, preferring AuthContext
  const isAuthenticated = authIsAuthenticated || reduxIsAuthenticated
  const user = authUser || reduxUser

  const handleLogout = () => {
    dispatch(logout())
    authLogout()
    navigate('/login')
  }

  const menuItems = isAuthenticated ? [
    { 
      label: 'Dashboard',
      icon: <FileText className="h-4 w-4" />,
      href: '/dashboard'
    },
    { 
      label: 'Create Resume',
      icon: <FileText className="h-4 w-4" />,
      href: '/createResume'
    },
    { 
      label: 'AI Resume',
      icon: <Sparkles className="h-4 w-4" />,
      href: '/createAiResume'
    },
    { 
      label: 'Profile',
      icon: <User className="h-4 w-4" />,
      href: `/${user?.username || user?.email}`
    }
  ] : []

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold text-blue-600 flex items-center"
          >
            <FileText className="h-6 w-6 mr-2" />
            Resume Builder
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center">
                      Create
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/dashboard" 
                        className="flex items-center"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/createResume" 
                        className="flex items-center"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Create Resume
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/createAiResume" 
                        className="flex items-center"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create AI Resume
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  to={`/${user?.username || user?.email}`}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <User className="h-4 w-4 mr-2" />
                  {user?.username || user?.email}
                </Link>

                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center text-red-600 border-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
