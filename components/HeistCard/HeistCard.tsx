'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, User, Calendar } from 'lucide-react'
import type { Heist } from '@/types/firestore'
import { getTimeRemaining } from '@/lib/countdown'
import styles from './HeistCard.module.css'

interface HeistCardProps {
  heist: Heist
  status: 'active' | 'assigned'
}

export function HeistCard({ heist, status }: HeistCardProps) {
  const deadlineLabel = heist.deadline.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(heist.deadline))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(heist.deadline))
    }, 60000)
    return () => clearInterval(interval)
  }, [heist.deadline])

  return (
    <article className={styles.card} aria-label={heist.title || 'Untitled heist'}>
      <div className={styles.titleRow}>
        <Link href={`/heists/${heist.id}`} className={styles.title}>
          {heist.title || 'Untitled heist'}
        </Link>
        <Clock size={16} className={styles.clockIcon} aria-hidden="true" />
      </div>
      <span className={status === 'active' ? styles.badgeActive : styles.badgeAssigned}>
        {status === 'active' ? 'Active' : 'Assigned'}
      </span>
      <div className={styles.metaRow}>
        <User size={12} className={styles.metaIcon} aria-hidden="true" />
        <span className={styles.label}>To:</span>
        <span className={styles.target}>
          @{heist.assignedToCodename || '—'}
        </span>
      </div>
      <div className={styles.metaRow}>
        <User size={12} className={styles.metaIcon} aria-hidden="true" />
        <span className={styles.label}>By:</span>
        <span className={styles.agent}>@{heist.createdByCodename}</span>
      </div>
      <div className={styles.metaRow}>
        <Calendar size={12} className={styles.metaIcon} aria-hidden="true" />
        <span className={styles.deadlineLabel}>{deadlineLabel} •</span>
        <span
          className={timeRemaining === 'Overdue' ? styles.deadlineOverdue : styles.deadline}
          aria-live="polite"
          aria-atomic="true"
        >
          {timeRemaining}
        </span>
      </div>
    </article>
  )
}

export function HeistCardSkeleton() {
  return (
    <div className={styles.card} role="status" aria-label="Loading heist">
      <div className={styles.skeletonTitle} aria-hidden="true" />
      <div className={styles.skeletonBadge} aria-hidden="true" />
      <div className={styles.skeletonRow} aria-hidden="true" />
      <div className={styles.skeletonRow} aria-hidden="true" />
      <div className={styles.skeletonRow} aria-hidden="true" />
    </div>
  )
}
