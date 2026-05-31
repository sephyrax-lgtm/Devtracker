import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Démarrer une session
export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, description } = body

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const session = await prisma.timeSession.create({
      data: {
        projectId,
        description,
        startTime: new Date(),
        userId: dbUser.id,
      }
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Erreur création session:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// Arrêter une session
export async function PATCH(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId } = body

    const now = new Date()
    const session = await prisma.timeSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 })
    }

    const duration = Math.floor((now.getTime() - session.startTime.getTime()) / 1000)

    const updatedSession = await prisma.timeSession.update({
      where: { id: sessionId },
      data: {
        endTime: now,
        duration,
      }
    })

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error('Erreur arrêt session:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
