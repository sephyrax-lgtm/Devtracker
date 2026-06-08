import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default async function SessionsPage() {
  const user = await currentUser()
  if (!user) redirect('/')

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
  const totalHours = sessions.reduce((acc, s) => acc + s.duration / 3600, 0)
  const totalRevenue = sessions.reduce((acc, s) => {
    return acc + (s.duration / 3600) * (s.project.hourlyRate || 0)
  }, 0)

  const firstName = user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Header ── */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', boxShadow: '0 0 8px var(--red)' }} />
              <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>DevTracker</span>
            </Link>
            <nav style={{ display: 'flex', gap: 4 }}>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              <Link href="/sessions" className="nav-link active">Sessions</Link>
              <Link href="/pricing" className="nav-link">Tarifs</Link>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{firstName} 👋</span>
            <UserButton />
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Historique des sessions
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Toutes tes sessions de travail enregistrées
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div className="card fade-in" style={{ padding: '24px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Total heures</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {totalHours.toFixed(1)}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}> h</span>
            </p>
          </div>
          <div className="card fade-in" style={{ padding: '24px', animationDelay: '0.06s' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Revenus potentiels</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {totalRevenue.toFixed(2)}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}> €</span>
            </p>
          </div>
          <div className="card fade-in" style={{ padding: '24px', animationDelay: '0.12s' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Sessions totales</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {sessions.length}
            </p>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {sessions.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <p style={{ fontSize: '1.75rem', marginBottom: 12 }}>📋</p>
              <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>Aucune session enregistrée</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Lance ton chronomètre depuis le Dashboard pour commencer.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="dt-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Projet</th>
                    <th>Début</th>
                    <th>Fin</th>
                    <th>Durée</th>
                    <th>Revenu</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => {
                    const hours = session.duration / 3600
                    const revenue = hours * (session.project.hourlyRate || 0)
                    return (
                      <tr key={session.id}>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {new Date(session.startTime).toLocaleDateString('fr-FR')}
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {session.project.name}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {session.endTime
                            ? new Date(session.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                            : <span className="stat-badge">En cours</span>}
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--red)' }}>
                            {hours.toFixed(2)}h
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: '#22c55e' }}>
                            {revenue.toFixed(2)} €
                          </span>
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
