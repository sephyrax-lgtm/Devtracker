import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-4">Tarifs</h1>
        <p className="text-gray-600 text-center mb-12">
          Commence gratuitement, upgrade quand tu es prêt
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plan Free */}
          <div className="bg-white rounded-lg shadow p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <p className="text-4xl font-bold mb-6">0€<span className="text-gray-500 text-lg">/mois</span></p>
            
            <ul className="space-y-3 mb-8">
              {[
                '3 projets maximum',
                'Chronomètre basique',
                'Historique 30 jours',
                'Export CSV',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/dashboard">
              <button className="w-full py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50">
                Commencer gratuitement
              </button>
            </Link>
          </div>

          {/* Plan Pro */}
          <div className="bg-blue-600 rounded-lg shadow p-8 border-2 border-blue-600 text-white relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
              ⭐ Recommandé
            </div>
            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <p className="text-4xl font-bold mb-6">9€<span className="text-blue-200 text-lg">/mois</span></p>
            
            <ul className="space-y-3 mb-8">
              {[
                'Projets illimités',
                'Facturation automatique',
                'Graphiques avancés',
                'Historique illimité',
                'Export PDF & CSV',
                'Support prioritaire',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50">
              Passer au Pro →
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/dashboard" className="text-gray-500 hover:text-blue-600">
            ← Retour au Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
