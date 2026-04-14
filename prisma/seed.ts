import { PrismaClient, Role, DiscountType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.wishlistItem.deleteMany(),
    prisma.wishlist.deleteMany(),
    prisma.review.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.address.deleteMany(),
    prisma.user.deleteMany(),
    prisma.coupon.deleteMany(),
  ])

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@boutique.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 10)
  const customer = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: customerPassword,
      role: Role.CUSTOMER,
    },
  })

  // Create categories
  const jewellery = await prisma.category.create({
    data: {
      name: 'Jewellery',
      slug: 'jewellery',
      description: 'Elegant handcrafted jewellery for every occasion',
      imageUrl: '/images/categories/jewellery.jpg',
      featured: true,
    },
  })

  const sarees = await prisma.category.create({
    data: {
      name: 'Sarees',
      slug: 'sarees',
      description: 'Exquisite sarees in silk, cotton, and designer weaves',
      imageUrl: '/images/categories/sarees.jpg',
      featured: true,
    },
  })

  const ladiesWear = await prisma.category.create({
    data: {
      name: 'Ladies Wear',
      slug: 'ladies-wear',
      description: 'Stylish and comfortable clothing for women',
      imageUrl: '/images/categories/ladies-wear.jpg',
      featured: true,
    },
  })

  const girlsWear = await prisma.category.create({
    data: {
      name: 'Girls Wear',
      slug: 'girls-wear',
      description: 'Charming outfits for girls',
      imageUrl: '/images/categories/girls-wear.jpg',
      featured: false,
    },
  })

  // Subcategories for Ladies Wear
  const kurtis = await prisma.category.create({
    data: {
      name: 'Kurtis',
      slug: 'kurtis',
      parentId: ladiesWear.id,
    },
  })

  const dresses = await prisma.category.create({
    data: {
      name: 'Dresses',
      slug: 'dresses',
      parentId: ladiesWear.id,
    },
  })

  // Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Gold Plated Pearl Drop Earrings',
      slug: 'gold-plated-pearl-drop-earrings',
      description: 'Elegant gold plated earrings with freshwater pearls. Perfect for weddings and parties.',
      price: 1299,
      compareAtPrice: 1999,
      sku: 'JWL-EAR-001',
      inventory: 25,
      lowStockThreshold: 5,
      isActive: true,
      isFeatured: true,
      categoryId: jewellery.id,
      images: {
        create: [
          { url: '/images/products/earrings-1.jpg', alt: 'Pearl Drop Earrings', position: 0 },
          { url: '/images/products/earrings-2.jpg', alt: 'Pearl Drop Earrings detail', position: 1 },
        ],
      },
    },
  })

  const product2 = await prisma.product.create({
    data: {
      name: 'Kundan Choker Necklace Set',
      slug: 'kundan-choker-necklace-set',
      description: 'Royal Kundan choker with matching earrings. Traditional craftsmanship with modern appeal.',
      price: 2499,
      compareAtPrice: 3499,
      sku: 'JWL-NEC-002',
      inventory: 12,
      isActive: true,
      isFeatured: true,
      categoryId: jewellery.id,
      images: {
        create: [
          { url: '/images/products/kundan-set-1.jpg', alt: 'Kundan Choker Set', position: 0 },
        ],
      },
    },
  })

  const product3 = await prisma.product.create({
    data: {
      name: 'Kanjivaram Silk Saree - Royal Blue',
      slug: 'kanjivaram-silk-saree-royal-blue',
      description: 'Authentic Kanjivaram silk saree with zari border. Rich royal blue with gold motifs.',
      price: 8999,
      compareAtPrice: 12999,
      sku: 'SAR-KAN-001',
      inventory: 8,
      isActive: true,
      isFeatured: true,
      categoryId: sarees.id,
      images: {
        create: [
          { url: '/images/products/saree-blue-1.jpg', alt: 'Kanjivaram Silk Saree', position: 0 },
        ],
      },
    },
  })

  const product4 = await prisma.product.create({
    data: {
      name: 'Banarasi Silk Saree - Wine Red',
      slug: 'banarasi-silk-saree-wine-red',
      description: 'Luxurious Banarasi silk saree with intricate brocade work. Perfect for festive occasions.',
      price: 7499,
      compareAtPrice: 9999,
      sku: 'SAR-BAN-002',
      inventory: 15,
      isActive: true,
      isFeatured: false,
      categoryId: sarees.id,
      images: {
        create: [
          { url: '/images/products/saree-red-1.jpg', alt: 'Banarasi Silk Saree', position: 0 },
        ],
      },
    },
  })

  const product5 = await prisma.product.create({
    data: {
      name: 'Embroidered Cotton Kurti - Mint Green',
      slug: 'embroidered-cotton-kurti-mint-green',
      description: 'Comfortable cotton kurti with delicate thread embroidery. Straight fit with 3/4 sleeves.',
      price: 1299,
      compareAtPrice: 1799,
      sku: 'LW-KUR-001',
      inventory: 30,
      isActive: true,
      isFeatured: true,
      categoryId: kurtis.id,
      images: {
        create: [
          { url: '/images/products/kurti-mint-1.jpg', alt: 'Cotton Kurti', position: 0 },
        ],
      },
    },
  })

  const product6 = await prisma.product.create({
    data: {
      name: 'Floral Print Maxi Dress - Peach',
      slug: 'floral-print-maxi-dress-peach',
      description: 'Flowy maxi dress with beautiful floral print. Soft georgette fabric, perfect for summer.',
      price: 1899,
      compareAtPrice: 2499,
      sku: 'LW-DRS-001',
      inventory: 20,
      isActive: true,
      isFeatured: true,
      categoryId: dresses.id,
      images: {
        create: [
          { url: '/images/products/dress-peach-1.jpg', alt: 'Floral Maxi Dress', position: 0 },
        ],
      },
    },
  })

  const product7 = await prisma.product.create({
    data: {
      name: 'Girls Party Wear Lehenga - Pink',
      slug: 'girls-party-wear-lehenga-pink',
      description: 'Adorable lehenga set for girls with embellished top and net dupatta.',
      price: 2299,
      compareAtPrice: 2999,
      sku: 'GW-LEN-001',
      inventory: 10,
      isActive: true,
      isFeatured: true,
      categoryId: girlsWear.id,
      images: {
        create: [
          { url: '/images/products/girls-lehenga-1.jpg', alt: 'Girls Lehenga', position: 0 },
        ],
      },
    },
  })

  // Add reviews
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        title: 'Absolutely stunning!',
        content: 'The earrings are even more beautiful in person. Great quality.',
        isVerified: true,
        userId: customer.id,
        productId: product1.id,
      },
      {
        rating: 4,
        title: 'Beautiful saree',
        content: 'The silk quality is excellent. Shipping was fast.',
        isVerified: true,
        userId: customer.id,
        productId: product3.id,
      },
    ],
  })

  // Create a coupon
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      description: '10% off on your first order',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderValue: 999,
      maxUses: 100,
      isActive: true,
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })