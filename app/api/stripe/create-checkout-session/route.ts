import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia', // Updated
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json()
    const { items, customerEmail, shippingAddress, couponCode } = body

    // Validate items and calculate total
    const productIds = items.map((i: any) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    const lineItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) throw new Error('Product not found')
      return {
        price_data: {
          currency: 'inr',
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      }
    })

    // Create order record first (status pending)
    const subtotal = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    )

    // Apply coupon if any
    let discount = 0
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } })
      if (coupon && coupon.isActive) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = (subtotal * coupon.discountValue) / 100
        } else {
          discount = coupon.discountValue
        }
      }
    }

    const total = subtotal - discount

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        subtotal,
        total,
        discount,
        couponCode,
        status: 'PENDING',
        userId: session?.user?.id,
        guestEmail: session ? undefined : customerEmail,
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            price: item.price,
            productId: item.productId,
          })),
        },
      },
    })

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: customerEmail,
      metadata: {
        orderId: order.id,
      },
      ...(shippingAddress && {
        shipping_address_collection: {
          allowed_countries: ['IN'],
        },
      }),
    })

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        payment: {
          create: {
            stripeCheckoutSessionId: stripeSession.id,
            amount: total,
            currency: 'inr',
            status: 'PENDING',
          },
        },
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}