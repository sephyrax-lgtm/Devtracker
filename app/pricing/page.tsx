import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', boxShadow: '0 0 8px var(--red)' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>DevTracker</span>
          </Link>
          <Link href="/dashboard" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8125rem', textDecoration: 'none' }}>
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="stat-badge" style={{ marginBottom: 20, display: 'inline-block' }}>Tarifs simples</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 16 }}>
            Commence gratuitement,<br />
            <span style={{ color: 'var(--red)' }}>upgrade quand tu es prêt</span>
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)' }}>
            Aucune carte de crédit requise pour commencer.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

          {/* ── Plan Free ── */}
          <div className="card fade-in" style={{ padding: '36px 32px' }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Free</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>0€</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>/mois</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 8 }}>Pour démarrer et tester.</p>
            </div>

            <div className="divider" style={{ marginBottom: 28 }} />

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
              {[
                '3 projets maximum',
                'Chronomètre basique',
                'Historique 30 jours',
                'Export CSV',
              ].map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.875rem' }}>✓</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/dashboard">
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}>
                Commencer gratuitement
              </button>
            </Link>
          </div>

          {/* ── Plan Pro ── */}
          <div className="fade-in" style={{
            padding: '36px 32px',
            borderRadius: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--red)',
            boxShadow: '0 0 32px var(--red-glow)',
            position: 'relative',
            animationDelay: '0.08s',
          }}>
            {/* Badge recommandé */}
            <div style={{
              position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--red)', color: '#fff',
              fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: 9999,
              letterSpacing: '0.04em', whiteSpace: 'nowrap',
            }}>
              ⭐ RECOMMANDÉ
            </div>

            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Pro</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>9€</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>/mois</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 8 }}>Pour les freelances sérieux.</p>
            </div>

            <div className="divider" style={{ marginBottom: 28 }} />

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
              {[
                'Projets illimités',
                'Facturation automatique',
                'Graphiques avancés',
                'Historique illimité',
                'Export PDF & CSV',
                'Support prioritaire',
              ].map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'var(--red)', fontWeight: 700, fontSize: '0.875rem' }}>✓</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{f}</span>
                </li>
              ))}
            </ul>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}>
              Passer au Pro →
            </button>
          </div>
        </div>

        {/* Garantie */}
        <p style={{ textAlign: 'center', marginTop: 40, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          🔒 Paiement sécurisé via Stripe · Annulable à tout moment
        </p>
      </main>
    </div>
  )
}
