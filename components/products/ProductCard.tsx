'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/stores/cart'
import { formatPrice } from '@/lib/utils'
import type { Product, ProductImage, Category } from '@prisma/client'
import { useState } from 'react'

type ProductCardProps = {
  product: Product & { images: ProductImage[]; category: Category }
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const firstImage = product.images[0]?.url || '/images/placeholder.jpg'

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              Sale
            </span>
          )}
        </div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={() => setIsWishlisted(!isWishlisted)}
      >
        <Heart
          className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
        />
      </Button>
      <div className="mt-3 space-y-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-medium">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="mt-2 w-full"
          onClick={() =>
            addItem({
              id: crypto.randomUUID(),
              productId: product.id,
              name: product.name,
              price: product.price,
              image: firstImage,
              quantity: 1,
              maxQuantity: product.inventory,
            })
          }
          disabled={product.inventory === 0}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  )
}