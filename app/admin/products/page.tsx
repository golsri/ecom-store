import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { Button } from '@/components/ui/button'
import { ProductTable } from '@/components/admin/ProductTable'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      images: { take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductTable products={products} />
    </div>
  )
}