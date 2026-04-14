'use client'

import { useState } from 'react'
import { Heart, Share2, Star, Truck, Shield, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AddToCartButton } from './AddToCartButton'
import { formatPrice } from '@/lib/utils'
import type { Product, ProductImage, Category } from '@prisma/client'

interface ProductInfoProps {
  product: Product & { images: ProductImage[]; category: Category }
  averageRating: number
  reviewCount: number
}

export function ProductInfo({ product, averageRating, reviewCount }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const isLowStock = product.inventory <= product.lowStockThreshold
  const isOutOfStock = product.inventory === 0

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {product.category.name}
          </Badge>
          {discount > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600">{discount}% OFF</Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="outline" className="border-amber-500 text-amber-600">
              Low Stock
            </Badge>
          )}
        </div>

        <h1 className="mt-3 font-serif text-3xl font-bold">{product.name}</h1>

        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= averageRating
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-muted text-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            SKU: {product.sku}
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-serif text-3xl font-bold text-primary">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </div>

      <p className="text-muted-foreground">{product.description}</p>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Truck className="h-4 w-4 text-primary" />
          <span>
            {product.inventory > 0 ? (
              <>Free delivery on orders over ₹999</>
            ) : (
              <>Currently out of stock</>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-primary" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <RefreshCw className="h-4 w-4 text-primary" />
          <span>7-day easy returns</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap items-end gap-4">
        <div className="w-32">
          <label className="mb-2 block text-sm font-medium">Quantity</label>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-r-none"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(product.inventory, parseInt(e.target.value) || 1))}
              className="h-10 w-14 border-y text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              min={1}
              max={product.inventory}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-l-none"
              onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
              disabled={quantity >= product.inventory}
            >
              +
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <AddToCartButton
            product={product}
            quantity={quantity}
            disabled={isOutOfStock}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart
            className={`mr-2 h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
          />
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
