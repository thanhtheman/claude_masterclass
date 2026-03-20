"use client"

import { useHeists } from '@/hooks/useHeists'

export default function HeistsPage() {
  const activeHeists = useHeists('active')
  const assignedHeists = useHeists('assigned')
  const expiredHeists = useHeists('expired')

  return (
    <div className="page-content">
      <div className="active-heists">
        <h2>Your Active Heists</h2>
        {activeHeists.length > 0 && (
          <ul>
            {activeHeists.map((h) => <li key={h.id}>{h.title}</li>)}
          </ul>
        )}
      </div>
      <div className="assigned-heists">
        <h2>Heists You&apos;ve Assigned</h2>
        {assignedHeists.length > 0 && (
          <ul>
            {assignedHeists.map((h) => <li key={h.id}>{h.title}</li>)}
          </ul>
        )}
      </div>
      <div className="expired-heists">
        <h2>All Expired Heists</h2>
        {expiredHeists.length > 0 && (
          <ul>
            {expiredHeists.map((h) => <li key={h.id}>{h.title}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}