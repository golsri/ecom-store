'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'
import { applyCoupon } from '@/lib/actions/cart'
import { Loader2, Tag } from 'lucide-react'

interface CartSummaryProps {
  subtotal: number
}

export function CartSummary({ subtotal }: CartSummaryProps) {
  const router = useRouter()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [isApplying, setIsApplying] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal - discount + shipping

  async function handleApplyCoupon() {
    if (!couponCode) return

    setIsApplying(true)
    setCouponError(null)

    try {
      const result = await applyCoupon(couponCode, subtotal)
      if (result.success) {
        setDiscount(result.discount)
      } else {
        setCouponError(result.message || 'Invalid coupon')
      }
    } catch {
      setCouponError('Failed to apply coupon')
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="font-serif text-xl font-semibold">Order Summary</h2>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="uppercase"
          />
          <Button
            variant="outline"
            onClick={handleApplyCoupon}
            disabled={isApplying || !couponCode}
          >
            {isApplying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Tag className="mr-2 h-4 w-4" />
                Apply
              </>
            )}
          </Button>
        </div>
        {couponError && (
          <p className="text-sm text-destructive">{couponError}</p>
        )}
      </div>

      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={() => router.push('/checkout')}
      >
        Proceed to Checkout
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Free shipping on orders over ₹999
      </p>
    </div>
  )
}