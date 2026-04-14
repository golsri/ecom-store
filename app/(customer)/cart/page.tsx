import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { CartItems } from '@/components/cart/CartItems'
import { CartSummary } from '@/components/cart/CartSummary'
import { EmptyCart } from '@/components/cart/EmptyCart'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Shopping Cart | SriAbhi Boutique',
  description: 'Review your selected items and proceed to checkout',
}

async function getCartItems(userId?: string) {
  if (!userId) return []
  
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { position: 'asc' } },
            },
          },
        },
      },
    },
  })
  
  return cart?.items || []
}

export default async function CartPage() {
  const session = await auth()
  const cartItems = await getCartItems(session?.user?.id)

  if (!cartItems.length) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
        <EmptyCart />
      </>
    )
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <div className="container py-8 md:py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      
      <h1 className="font-serif text-3xl md:text-4xl mt-6 mb-8">
        Shopping Cart ({cartItems.length})
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<CartSkeleton />}>
            <CartItems items={cartItems} />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 border rounded-lg">
          <Skeleton className="h-24 w-24 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}