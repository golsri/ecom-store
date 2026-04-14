import { ProductCard } from '@/components/products/ProductCard'
import type { Product, ProductImage, Category } from '@prisma/client'

type ProductWithRelations = Product & {
  images: ProductImage[]
  category: Category
}

interface FeaturedProductsProps {
  products: ProductWithRelations[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="container py-12 md:py-16">
      <h2 className="mb-8 text-center font-serif text-3xl">Featured Products</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}