import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { prisma } from '@/lib/db/prisma'
import { ProductGallery } from '@/components/products/ProductGallery'
import { ProductInfo } from '@/components/products/ProductInfo'
import { ProductReviews } from '@/components/products/ProductReviews'
import { RelatedProducts } from '@/components/products/RelatedProducts'
import { RecentlyViewed } from '@/components/products/RecentlyViewed'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'

export const revalidate = 3600

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: 'asc' } },
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    return { title: 'Product Not Found' }
  }
  
  return {
    title: `${product.name} | SriAbhi Boutique`,
    description: product.description,
    openGraph: {
      images: product.images[0]?.url,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    notFound()
  }

  const averageRating = product.reviews.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="container py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: product.category.name, href: `/categories/${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} />
        
        <ProductInfo
          product={product}
          averageRating={averageRating}
          reviewCount={product.reviews.length}
        />
      </div>

      <Suspense fallback={<div className="h-40" />}>
        <ProductReviews
          productId={product.id}
          reviews={product.reviews}
          averageRating={averageRating}
        />
      </Suspense>

      <Suspense fallback={<div className="h-80" />}>
        <RelatedProducts
          categoryId={product.categoryId}
          currentProductId={product.id}
        />
      </Suspense>

      <RecentlyViewed currentProductId={product.id} />
    </div>
  )
}