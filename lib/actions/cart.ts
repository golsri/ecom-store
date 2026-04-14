'use server'

import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'

export async function applyCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  })

  if (!coupon) {
    return { success: false, message: 'Invalid coupon code' }
  }

  if (!coupon.isActive) {
    return { success: false, message: 'This coupon is no longer active' }
  }

  if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
    return { success: false, message: 'This coupon has expired' }
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return { success: false, message: 'This coupon has reached its usage limit' }
  }

  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return {
      success: false,
      message: `Minimum order value of ₹${coupon.minOrderValue} required`,
    }
  }

  let discount = 0
  if (coupon.discountType === 'PERCENTAGE') {
    discount = (subtotal * coupon.discountValue) / 100
  } else {
    discount = coupon.discountValue
  }

  return { success: true, discount }
}

export async function syncCartWithDatabase() {
  const session = await auth()
  if (!session?.user) return

  // This would be called after login to merge guest cart
  // Implementation depends on how you track guest cart
}

export async function addToWishlist(productId: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, message: 'Please login to add to wishlist' }
  }

  let wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
  })

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId: session.user.id },
    })
  }

  await prisma.wishlistItem.upsert({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId,
      },
    },
    update: {},
    create: {
      wishlistId: wishlist.id,
      productId,
    },
  })

  revalidatePath('/account/wishlist')
  return { success: true }
}