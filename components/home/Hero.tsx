import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <Image
        src="/images/hero-banner.jpg"
        alt="Elegant jewellery and sarees"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="container relative flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight">
          Timeless Elegance
        </h1>
        <p className="mt-4 max-w-xl text-lg md:text-xl text-white/90">
          Discover our curated collection of jewellery, sarees, and women's apparel.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/categories/jewellery">Shop Now</Link>
        </Button>
      </div>
    </section>
  )
}