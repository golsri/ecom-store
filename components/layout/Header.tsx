'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ShoppingBag, Search, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/stores/cart'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { MobileMenu } from './MobileMenu'
import { useState } from 'react'

export function Header() {
  const { data: session } = useSession()
  const cartItems = useCartStore((s) => s.items)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-serif text-xl font-bold">Aura</span>
          <span className="text-xs font-light text-muted-foreground">Boutique</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/categories/jewellery">Jewellery</Link>
          <Link href="/categories/sarees">Sarees</Link>
          <Link href="/categories/ladies-wear">Ladies</Link>
          <Link href="/categories/girls-wear">Girls</Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </Button>

          {session ? (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}

          <ThemeToggle />
        </div>
      </div>

      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </header>
  )
}