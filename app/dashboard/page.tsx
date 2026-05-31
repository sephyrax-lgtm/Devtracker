import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import NewProjectForm from './components/NewProjectForm'
import Timer from './components/Timer'
import RevenueChart from './components/RevenueChart'

export default async function DashboardPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/')
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { 
      projects: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' }
      },
      sessions: {
        orderBy: { createdAt: 'desc' },
        include: { project: true }
      }
    }
  })

  const projects = dbUser?.projects || []
  const allSessions = dbUser?.sessions || []
  const recentSessions = allSessions.slice(0, 5)

  // Calcul des stats
  const totalHours = allSessions.reduce((acc, session) => {
    return acc + (session.duration / 3600)
  }, 0)

  const totalRevenue = allSessions.reduce((acc, session) => {
    const hours = session.duration / 3600
    const rate = session.project.hourlyRate || 0
    return acc + (hours * rate)
  }, 0)

  // Données pour le graphique (7 derniers jours)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const chartData = last7Days.map(date => {
    const sessionsForDay = allSessions.filter(s => 
      s.startTime.toISOString().split('T')[0] === date
    )
    const hours = sessionsForDay.reduce((acc, s) => acc + (s.duration / 3600), 0)
    const revenue = sessionsForDay.reduce((acc, s) => {
      const h = s.duration / 3600
      return acc + (h * (s.project.hourlyRate || 0))
    }, 0)

    return {
      date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      hours: parseFloat(hours.toFixed(2)),
      revenue: parseFloat(revenue.toFixed(2))
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">DevTracker</h1>
            <nav className="flex gap-4">
              <Link href="/dashboard" className="text-blue-600 font-semibold">
                Dashboard
              </Link>
              <Link href="/sessions" className="text-gray-600 hover:text-blue-600">
                Sessions
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Salut, {user.firstName || user.emailAddresses[0].emailAddress} 👋
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Revenus totaux</p>
            <p className="text-3xl font-bold mt-2">{totalRevenue.toFixed(2)} €</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Heures travaillées</p>
            <p className="text-3xl font-bold mt-2">{totalHours.toFixed(1)}h</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Projets actifs</p>
            <p className="text-3xl font-bold mt-2">{projects.length}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <RevenueChart data={chartData} />
        </div>

        {/* Timer et Sessions récentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <Timer projects={projects.map(p => ({ id: p.id, name: p.name }))} />
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Sessions récentes</h3>
            {recentSessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune session pour le moment
              </p>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{session.project.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(session.startTime).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-blue-600">
                          {(session.duration / 3600).toFixed(2)}h
                        </p>
                        {session.project.hourlyRate && (
                          <p className="text-sm text-green-600 font-semibold">
                            {((session.duration / 3600) * session.project.hourlyRate).toFixed(2)} €
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Projects section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Mes projets</h3>
            <NewProjectForm />
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                🚀 Commence ton premier projet !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <h4 className="font-semibold text-lg mb-2">{project.name}</h4>
                  {project.clientName && (
                    <p className="text-gray-600 text-sm mb-2">
                      Client: {project.clientName}
                    </p>
                  )}
                  {project.hourlyRate && (
                    <p className="text-blue-600 font-medium">
                      {project.hourlyRate}€/h
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
