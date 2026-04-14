'use server'

import { prisma } from '@/lib/db/prisma'
import { hash } from 'bcryptjs'
import { signIn } from '@/lib/auth'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function signUp(formData: FormData) {
  const validated = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  const { name, email, password } = validated.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: { email: ['Email already in use'] } }
  }

  const hashed = await hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  })

  await signIn('credentials', { email, password, redirect: false })
  redirect('/')
}