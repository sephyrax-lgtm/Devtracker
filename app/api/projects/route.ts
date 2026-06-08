import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { name, clientName, hourlyRate } = body

    // Vérifie si l'utilisateur existe dans la DB, sinon le crée
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: user.firstName || user.emailAddresses[0].emailAddress,
        }
      })
    }

    // Crée le projet
    const project = await prisma.project.create({
      data: {
        name,
        clientName,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        userId: dbUser.id,
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Erreur création projet:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { projects: true }
    })

    return NextResponse.json(dbUser?.projects || [])
  } catch (error) {
    console.error('Erreur récupération projets:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser || project.userId !== dbUser.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Soft delete to preserve time sessions
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { status: 'archived' }
    })

    return NextResponse.json({ success: true, project: updatedProject })
  } catch (error) {
    console.error('Erreur suppression projet:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
