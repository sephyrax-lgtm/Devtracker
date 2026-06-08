import { SignInButton, SignUpButton, SignedOut, UserButton, SignedIn } from '@clerk/nextjs'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--red)', display: 'inline-block'
            }} />
            <span style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              DevTracker
            </span>
          </div>

          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.8125rem' }}>
                  Se connecter
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.8125rem' }}>
                  S'inscrire
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 py-24 fade-in">
        <div style={{ maxWidth: 640 }}>
          <div className="stat-badge" style={{ marginBottom: 24, display: 'inline-block' }}>
            Pour les développeurs freelance
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: 24,
          }}>
            Prends le contrôle de ton temps{' '}
            <span style={{ color: 'var(--red)' }}>&</span>{' '}
            tes revenus
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>
            Suis tes sessions de travail, calcule tes revenus en temps réel, et visualise l'évolution de ta carrière freelance — tout en un endroit.
          </p>

          <SignedOut>
            <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
              <SignUpButton mode="modal">
                <button className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                  Commencer gratuitement →
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="btn-secondary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                  J'ai déjà un compte
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <a href="/dashboard">
              <button className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                Ouvrir mon Dashboard →
              </button>
            </a>
          </SignedIn>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {[
            { icon: '⏱', title: 'Chronomètre intégré', desc: 'Lance et arrête un timer par projet. Chaque session est enregistrée automatiquement.' },
            { icon: '💰', title: 'Revenus en temps réel', desc: 'Configure ton taux horaire et vois tes gains calculés à la seconde près.' },
            { icon: '📊', title: 'Graphiques d\'activité', desc: 'Visualise ton activité des 7 derniers jours et identifie tes pics de productivité.' },
          ].map((f, i) => (
            <div key={i} className="card fade-in" style={{ padding: '28px 24px', animationDelay: `${i * 0.08}s` }}>
              <div style={{ fontSize: '1.75rem', marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 0' }}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>© 2026 DevTracker</span>
          <a href="/pricing" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
            className="nav-link">Tarifs</a>
        </div>
      </footer>
    </main>
  )
}
