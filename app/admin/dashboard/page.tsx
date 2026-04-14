import { Suspense } from 'react'
import { prisma } from '@/lib/db/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCards } from '@/components/admin/StatsCards'
import { RecentOrders } from '@/components/admin/RecentOrders'
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } },
    }),
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
    },
  })

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    recentOrders,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading orders...</div>}>
              <RecentOrders orders={stats.recentOrders} />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <QuickActionCard
                href="/admin/products/new"
                icon={Package}
                label="Add Product"
              />
              <QuickActionCard
                href="/admin/categories"
                icon={ShoppingBag}
                label="Categories"
              />
              <QuickActionCard
                href="/admin/orders"
                icon={DollarSign}
                label="View Orders"
              />
              <QuickActionCard
                href="/admin/customers"
                icon={Users}
                label="Customers"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function QuickActionCard({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ElementType
  label: string
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-muted/50"
    >
      <Icon className="h-6 w-6 text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </a>
  )
}