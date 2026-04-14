import { Truck, Shield, RefreshCw, Award } from 'lucide-react'

const badges = [
  { icon: Truck, label: 'Free Shipping', description: 'On orders over ₹999' },
  { icon: Shield, label: 'Secure Payment', description: '100% secure transactions' },
  { icon: RefreshCw, label: 'Easy Returns', description: '7-day return policy' },
  { icon: Award, label: 'Authentic Products', description: 'Certified quality' },
]

export function TrustBadges() {
  return (
    <section className="border-y bg-muted/30 py-8">
      <div className="container">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {badges.map(({ icon: Icon, label, description }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <Icon className="mb-2 h-6 w-6 text-primary" />
              <h4 className="text-sm font-medium">{label}</h4>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}