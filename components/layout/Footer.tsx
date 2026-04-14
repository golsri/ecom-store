import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Aura</h3>
            <p className="text-sm text-muted-foreground">
              Elegant jewellery, sarees, and women's clothing for the modern Indian woman.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-medium">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories/jewellery">Jewellery</Link></li>
              <li><Link href="/categories/sarees">Sarees</Link></li>
              <li><Link href="/categories/ladies-wear">Ladies Wear</Link></li>
              <li><Link href="/categories/girls-wear">Girls Wear</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-medium">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shipping">Shipping Info</Link></li>
              <li><Link href="/returns">Returns & Exchanges</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-medium">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Aura Boutique. All rights reserved.
        </div>
      </div>
    </footer>
  )
}