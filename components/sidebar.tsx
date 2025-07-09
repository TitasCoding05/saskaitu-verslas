"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Users, Download, Settings, Home, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  darkMode: boolean
  toggleDarkMode: () => void
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
}

export function Sidebar({
  darkMode,
  toggleDarkMode,
  isOpen: controlledIsOpen,
  setIsOpen: setControlledIsOpen
}: SidebarProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
  
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen
  const setIsOpen = setControlledIsOpen ?? setUncontrolledIsOpen
  const pathname = usePathname()

  const navigation = [
    { name: "Pagrindinis", href: "/dashboard", icon: Home },
    { name: "Sąskaitos", href: "/dashboard/saskaitos", icon: FileText },
    { name: "Gautos sąskaitos", href: "/dashboard/gautos-saskaitos", icon: FileText },
    { name: "Klientai", href: "/dashboard/klientai", icon: Users },
    { name: "ISAF eksportas", href: "/dashboard/isaf", icon: Download },
    { name: "Nustatymai", href: "/dashboard/nustatymai", icon: Settings },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 rounded-xl h-10 w-10"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-60 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        bg-white/80 dark:bg-black/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-gray-200 dark:border-gray-800">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center mono-shadow-lg">
              <FileText className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="ml-3 text-xl font-semibold text-black dark:text-white">SąskaitaLT</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`
                    flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-2
                    ${
                      isActive(item.href)
                        ? "bg-black dark:bg-white text-white dark:text-black mono-shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                    }
                  `}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Spacer section */}
          <div className="h-[100px] flex-shrink-0"></div>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nemokamas planas</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">15 / 20 sąskaitų</p>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mt-2">
                <div className="bg-black dark:bg-white h-1.5 rounded-full" style={{ width: "75%" }}></div>
              </div>
              
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                {darkMode ? "Šviesi tema" : "Tamsi tema"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
