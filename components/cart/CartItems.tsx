'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/stores/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { CartItem as PrismaCartItem, Product, ProductImage } from '@prisma/client'

type CartItemWithProduct = PrismaCartItem & {
  product: Product & { images: ProductImage[] }
}

interface CartItemsProps {
  items: CartItemWithProduct[]
}

export function CartItems({ items }: CartItemsProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const product = item.product
        const image = product.images[0]?.url || '/images/placeholder.jpg'
        const isLowStock = product.inventory <= product.lowStockThreshold

        return (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row"
          >
            <Link
              href={`/products/${product.slug}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </Link>

            <div className="flex flex-1 flex-col justify-between sm:flex-row">
              <div className="space-y-1">
                <Link
                  href={`/products/${product.slug}`}
                  className="font-medium hover:underline"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </p>
                <p className="font-medium text-primary">
                  {formatPrice(product.price)}
                </p>
                {isLowStock && (
                  <p className="text-xs text-amber-600">
                    Only {product.inventory} left in stock
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center gap-4 sm:mt-0">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => updateQuantity(product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(product.id, parseInt(e.target.value) || 1)
                    }
                    className="h-8 w-14 rounded-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    min={1}
                    max={product.inventory}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => updateQuantity(product.id, item.quantity + 1)}
                    disabled={item.quantity >= product.inventory}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeItem(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}