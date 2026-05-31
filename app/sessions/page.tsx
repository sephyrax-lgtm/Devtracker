import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default async function SessionsPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/')
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { 
      sessions: {
        orderBy: { startTime: 'desc' },
        include: { project: true }
      }
    }
  })

  const sessions = dbUser?.sessions || []

  // Calcul du total
  const totalHours = sessions.reduce((acc, s) => acc + (s.duration / 3600), 0)
  const totalRevenue = sessions.reduce((acc, s) => {
    const hours = s.duration / 3600
    const rate = s.project.hourlyRate || 0
    return acc + (hours * rate)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-2xl font-bold hover:text-blue-600">
              DevTracker
            </Link>
            <nav className="flex gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/sessions" className="text-blue-600 font-semibold">
                Sessions
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {user.firstName || user.emailAddresses[0].emailAddress} 👋
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Historique des sessions</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total heures</p>
            <p className="text-3xl font-bold mt-2">{totalHours.toFixed(1)}h</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Revenus potentiels</p>
            <p className="text-3xl font-bold mt-2">{totalRevenue.toFixed(2)} €</p>
          </div>
        </div>

        {/* Sessions list */}
        <div className="bg-white rounded-lg shadow">
          {sessions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Aucune session enregistrée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Projet</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Début</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Fin</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Durée</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Revenu</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sessions.map((session) => {
                    const hours = session.duration / 3600
                    const revenue = hours * (session.project.hourlyRate || 0)
                    
                    return (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">
                          {new Date(session.startTime).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {session.project.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(session.startTime).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {session.endTime 
                            ? new Date(session.endTime).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })
                            : 'En cours'}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono font-semibold text-blue-600">
                          {hours.toFixed(2)}h
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                          {revenue.toFixed(2)} €
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
