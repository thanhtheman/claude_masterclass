'use client'

import { useHeists } from '@/hooks/useHeists'
import { HeistCard, HeistCardSkeleton } from '@/components/HeistCard'

export default function HeistsPage() {
  const { heists: activeHeists, loading: activeLoading } = useHeists('active')
  const { heists: assignedHeists, loading: assignedLoading } = useHeists('assigned')
  const { heists: expiredHeists, loading: expiredLoading } = useHeists('expired')

  return (
    <div className="page-content">
      <div className="active-heists">
        <h2>Your Active Heists</h2>
        <div className="preview-grid">
          {activeLoading
            ? Array.from({ length: 3 }).map((_, i) => <HeistCardSkeleton key={`skeleton-active-${i}`} />)
            : activeHeists.length > 0
              ? activeHeists.map((h) => <HeistCard key={h.id} heist={h} status="active" />)
              : <p>No active heists.</p>
          }
        </div>
      </div>

      <div className="assigned-heists">
        <h2>Heists You&apos;ve Assigned</h2>
        <div className="preview-grid">
          {assignedLoading
            ? Array.from({ length: 3 }).map((_, i) => <HeistCardSkeleton key={`skeleton-assigned-${i}`} />)
            : assignedHeists.length > 0
              ? assignedHeists.map((h) => <HeistCard key={h.id} heist={h} status="assigned" />)
              : <p>No assigned heists.</p>
          }
        </div>
      </div>

      <div className="expired-heists">
        <h2>All Expired Heists</h2>
        {expiredLoading
          ? null
          : expiredHeists.length > 0
            ? (
              <ul>
                {expiredHeists.map((h) => <li key={h.id}>{h.title}</li>)}
              </ul>
            )
            : <p>No expired heists.</p>
        }
      </div>
    </div>
  )
}
