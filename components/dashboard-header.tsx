"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Plus, Sun, Moon, User, Settings, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface DashboardHeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
  toggleSidebar: () => void
}

export function DashboardHeader({ darkMode, toggleDarkMode, toggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-8">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden mr-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Button>
        </div>

        <div className="flex items-center space-x-6 flex-1 max-w-md ml-auto">
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* New Invoice Button */}
          <Link href="/dashboard/saskaitos/nauja">
            <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-6 h-10 rounded-xl font-medium mono-shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Nauja sąskaita
            </Button>
          </Link>


          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black dark:bg-white mono-shadow-lg">
                  <User className="w-4 h-4 text-white dark:text-black" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-gray-200 dark:border-gray-800 rounded-xl mono-shadow-xl"
            >
              <DropdownMenuItem className="rounded-lg">
                <User className="w-4 h-4 mr-2" />
                Profilis
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg">
                <Settings className="w-4 h-4 mr-2" />
                Nustatymai
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
              <DropdownMenuItem className="text-red-600 rounded-lg">Atsijungti</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
