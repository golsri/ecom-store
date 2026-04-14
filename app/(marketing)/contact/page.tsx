import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | SriAbhi Boutique',
  description: 'Get in touch with our customer service team',
}

export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 text-muted-foreground">
          Have questions? We'd love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <ContactCard
            icon={Phone}
            title="Phone"
            lines={['+91 98765 43210', 'Mon-Sat, 10am-7pm']}
          />
          <ContactCard
            icon={Mail}
            title="Email"
            lines={['care@sriabhi.com', 'orders@sriabhi.com']}
          />
          <ContactCard
            icon={MapPin}
            title="Store Location"
            lines={['123 Fashion Street', 'Mumbai, Maharashtra 400001']}
          />
          <ContactCard
            icon={Clock}
            title="Business Hours"
            lines={['Monday - Saturday: 10am - 7pm', 'Sunday: Closed']}
          />
        </div>

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="font-serif text-xl font-semibold mb-6">
              Send us a message
            </h2>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ContactCard({
  icon: Icon,
  title,
  lines,
}: {
  icon: React.ElementType
  title: string
  lines: string[]
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            {lines.map((line, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                {line}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}