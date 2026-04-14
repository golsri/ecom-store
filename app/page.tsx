import { Suspense } from 'react'
import { Hero } from '@/components/home/Hero'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { TrustBadges } from '@/components/home/TrustBadges'
import { prisma } from '@/lib/db/prisma'

export const revalidate = 3600 // ISR every hour

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { images: { orderBy: { position: 'asc' } }, category: true },
    take: 8,
  })
}

async function getFeaturedCategories() {
  return prisma.category.findMany({
    where: { featured: true },
    take: 4,
  })
}

export default async function HomePage() {
  const [featuredProducts, featuredCategories] = await Promise.all([
    getFeaturedProducts(),
    getFeaturedCategories(),
  ])

  return (
    <>
      <Hero />
      <Suspense fallback={<div className="h-40" />}>
        <FeaturedCategories categories={featuredCategories} />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <FeaturedProducts products={featuredProducts} />
      </Suspense>
      <TrustBadges />
    </>
  )
}