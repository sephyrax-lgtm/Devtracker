import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import NewProjectForm from './components/NewProjectForm'
import Timer from './components/Timer'
import RevenueChart from './components/RevenueChart'
import DeleteProjectButton from './components/DeleteProjectButton'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      projects: { where: { status: 'active' }, orderBy: { createdAt: 'desc' } },
      sessions: { orderBy: { createdAt: 'desc' }, include: { project: true } }
    }
  })

  const projects = dbUser?.projects || []
  const allSessions = dbUser?.sessions || []
  const recentSessions = allSessions.slice(0, 5)

  const totalHours = allSessions.reduce((acc, s) => acc + s.duration / 3600, 0)
  const totalRevenue = allSessions.reduce((acc, s) => {
    return acc + (s.duration / 3600) * (s.project.hourlyRate || 0)
  }, 0)

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const chartData = last7Days.map(date => {
    const day = allSessions.filter(s => s.startTime.toISOString().split('T')[0] === date)
    const hours = day.reduce((acc, s) => acc + s.duration / 3600, 0)
    const revenue = day.reduce((acc, s) => acc + (s.duration / 3600) * (s.project.hourlyRate || 0), 0)
    return {
      date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      hours: parseFloat(hours.toFixed(2)),
      revenue: parseFloat(revenue.toFixed(2)),
    }
  })

  const firstName = user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Header ── */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', boxShadow: '0 0 8px var(--red)' }} />
              <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>DevTracker</span>
            </Link>
            {/* Nav */}
            <nav style={{ display: 'flex', gap: 4 }}>
              <Link href="/dashboard" className="nav-link active">Dashboard</Link>
              <Link href="/sessions" className="nav-link">Sessions</Link>
              <Link href="/pricing" className="nav-link">Tarifs</Link>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Salut, {firstName} 👋</span>
            <UserButton />
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Dashboard
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Vue d'ensemble de ton activité freelance
          </p>
        </div>

        {/* ── Stats cards ── */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {/* Revenus */}
          <div className="card fade-in" style={{ padding: '24px', animationDelay: '0s' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Revenus totaux
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {totalRevenue.toFixed(2)}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}> €</span>
            </p>
          </div>

          {/* Heures */}
          <div className="card fade-in" style={{ padding: '24px', animationDelay: '0.06s' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Heures travaillées
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {totalHours.toFixed(1)}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}> h</span>
            </p>
          </div>

          {/* Projets */}
          <div className="card fade-in" style={{ padding: '24px', animationDelay: '0.12s' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Projets actifs
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {projects.length}
            </p>
          </div>
        </div>

        {/* ── Graphique ── */}
        <div style={{ marginBottom: 32 }}>
          <RevenueChart data={chartData} />
        </div>

        {/* ── Timer + Sessions récentes ── */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 32, alignItems: 'start' }}>
          <div>
            <Timer projects={projects.map(p => ({ id: p.id, name: p.name }))} />
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
              Sessions récentes
            </h3>
            {recentSessions.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>
                Aucune session pour le moment
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentSessions.map((session) => (
                  <div key={session.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 14px', borderRadius: 8,
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)'
                  }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {session.project.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {new Date(session.startTime).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--red)', fontFamily: 'monospace' }}>
                        {(session.duration / 3600).toFixed(2)}h
                      </p>
                      {session.project.hourlyRate && (
                        <p style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600, marginTop: 2 }}>
                          {((session.duration / 3600) * session.project.hourlyRate).toFixed(2)} €
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Projets ── */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Mes projets</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {projects.length} projet{projects.length !== 1 ? 's' : ''} actif{projects.length !== 1 ? 's' : ''}
              </p>
            </div>
            <NewProjectForm />
          </div>

          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '2rem', marginBottom: 12 }}>🚀</p>
              <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
                Commence ton premier projet
              </p>
              <p style={{ fontSize: '0.875rem' }}>Crée un projet pour commencer à tracker ton temps</p>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: project.color || 'var(--red)', flexShrink: 0 }} />
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {project.name}
                      </h4>
                    </div>
                    <DeleteProjectButton projectId={project.id} projectName={project.name} />
                  </div>
                  {project.clientName && (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                      {project.clientName}
                    </p>
                  )}
                  {project.hourlyRate && (
                    <span className="stat-badge">{project.hourlyRate}€/h</span>
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
