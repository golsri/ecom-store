import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@prisma/client'

interface FeaturedCategoriesProps {
  categories: Category[]
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <section className="container py-12 md:py-16">
      <h2 className="mb-8 text-center font-serif text-3xl">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <div className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={category.imageUrl || '/images/placeholder.jpg'}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="font-serif text-lg text-white">{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}