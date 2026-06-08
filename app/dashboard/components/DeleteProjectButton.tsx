'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteProjectButtonProps {
  projectId: string
  projectName: string
}

export default function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent any card-level click events
    
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: projectId }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Erreur lors de la suppression du projet')
        setIsDeleting(false)
        setShowConfirm(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur réseau lors de la suppression du projet')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowConfirm(false)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={e => e.stopPropagation()}>
      {showConfirm ? (
        <>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Confirmer la suppression"
          >
            {isDeleting ? '...' : 'Oui'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isDeleting}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Non
          </button>
        </>
      ) : (
        <button
          onClick={handleDelete}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s, background-color 0.2s',
          }}
          className="delete-icon-btn"
          title="Supprimer le projet"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      )}
    </div>
  )
}
