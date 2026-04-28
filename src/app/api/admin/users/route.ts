import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions) as any
  if (!session?.user) return Response.json({ error: 'No auth' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (dbUser?.role !== 'admin') return Response.json({ error: 'No admin' }, { status: 403 })

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, active: true, expiresAt: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json({ users })
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions) as any
  if (!session?.user) return Response.json({ error: 'No auth' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (dbUser?.role !== 'admin') return Response.json({ error: 'No admin' }, { status: 403 })

  const { userId, active, expiresAt } = await request.json()

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { active, expiresAt: expiresAt ? new Date(expiresAt) : null },
  })

  return Response.json({ user: updated })
}
