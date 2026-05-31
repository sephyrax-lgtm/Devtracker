import { SignInButton, SignUpButton, SignedOut, UserButton, SignedIn } from '@clerk/nextjs'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">DevTracker</h1>
            <p className="text-gray-600 mt-2">Ton SaaS pour gérer ta carrière freelance</p>
          </div>
          
          <div className="flex gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Se connecter
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  S'inscrire
                </button>
              </SignUpButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        <SignedOut>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold">👋 Bienvenue !</h2>
            <p className="text-gray-700 mt-2">Inscris-toi pour commencer à tracker ton temps et tes revenus.</p>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-800">✅ Tu es connecté !</h2>
            <p className="text-green-700 mt-2">
              <a href="/dashboard" className="text-blue-600 underline">Va sur ton dashboard →</a>
            </p>
          </div>
        </SignedIn>
      </div>
    </main>
  )
}
