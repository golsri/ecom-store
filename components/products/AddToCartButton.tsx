'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/stores/cart'
import { toast } from 'sonner'
import type { Product, ProductImage } from '@prisma/client'

interface AddToCartButtonProps {
  product: Product & { images: ProductImage[] }
  quantity: number
  disabled?: boolean
}

export function AddToCartButton({ product, quantity, disabled }: AddToCartButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    setIsLoading(true)
    
    const image = product.images[0]?.url || '/images/placeholder.jpg'
    
    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image,
      maxQuantity: product.inventory,
    })

    toast.success('Added to cart', {
      description: `${product.name} (${quantity}) added to your cart`,
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart'),
      },
    })

    setTimeout(() => setIsLoading(false), 300)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  if (disabled) {
    return (
      <Button className="w-full" disabled>
        Out of Stock
      </Button>
    )
  }

  return (
    <div className="flex w-full gap-2">
      <Button
        className="flex-1"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ShoppingBag className="mr-2 h-4 w-4" />
        )}
        Add to Cart
      </Button>
      <Button
        variant="secondary"
        className="flex-1"
        onClick={handleBuyNow}
        disabled={isLoading}
      >
        Buy Now
      </Button>
    </div>
  )
}