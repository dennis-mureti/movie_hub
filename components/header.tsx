"use client"

import { Film, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { UserMenu } from "./user-menu"

interface HeaderProps {
  onSearchClick?: () => void
}

export function Header({ onSearchClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Film className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">MovieFinder</h1>
        </div>

        <nav className="flex items-center space-x-4">
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Popular
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Trending
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Top Rated
          </Button>
          <Button
            variant="outline"
            onClick={onSearchClick}
            className="border-border hover:bg-accent hover:text-accent-foreground bg-transparent"
          >
            Search
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 p-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <UserMenu />
        </nav>
      </div>
    </header>
  )
}
