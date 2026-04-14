'use client'

import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle className="text-left font-serif">Aura Boutique</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col space-y-4">
          <Link
            href="/categories/jewellery"
            className="text-lg font-medium"
            onClick={() => onOpenChange(false)}
          >
            Jewellery
          </Link>
          <Link
            href="/categories/sarees"
            className="text-lg font-medium"
            onClick={() => onOpenChange(false)}
          >
            Sarees
          </Link>
          <Link
            href="/categories/ladies-wear"
            className="text-lg font-medium"
            onClick={() => onOpenChange(false)}
          >
            Ladies Wear
          </Link>
          <Link
            href="/categories/girls-wear"
            className="text-lg font-medium"
            onClick={() => onOpenChange(false)}
          >
            Girls Wear
          </Link>
          <hr className="my-4" />
          <Link
            href="/account"
            className="text-lg font-medium"
            onClick={() => onOpenChange(false)}
          >
            My Account
          </Link>
          <Link
            href="/contact"
            className="text-lg font-medium"
            onClick={() => onOpenChange(false)}
          >
            Contact
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}