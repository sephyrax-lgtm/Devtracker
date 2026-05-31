'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TimerProps {
  projects: { id: string; name: string }[]
}

export default function Timer({ projects }: TimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [selectedProject, setSelectedProject] = useState('')
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = async () => {
    if (!selectedProject) {
      alert('Sélectionne un projet !')
      return
    }

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selectedProject }),
      })

      const session = await response.json()
      setCurrentSessionId(session.id)
      setIsRunning(true)
      setSeconds(0)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleStop = async () => {
    if (!currentSessionId) return

    try {
      await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSessionId }),
      })

      setIsRunning(false)
      setSeconds(0)
      setCurrentSessionId(null)
      setSelectedProject('')
      router.refresh()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">⏱️ Chronomètre</h3>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-mono font-bold text-blue-600 mb-4">
          {formatTime(seconds)}
        </div>
      </div>

      {!isRunning ? (
        <div className="space-y-4">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionne un projet</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleStart}
            disabled={!selectedProject}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400"
          >
            ▶ Démarrer
          </button>
        </div>
      ) : (
        <button
          onClick={handleStop}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
        >
          ⏹ Arrêter
        </button>
      )}
    </div>
  )
}
