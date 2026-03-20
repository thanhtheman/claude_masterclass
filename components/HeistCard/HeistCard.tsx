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
    <div className={styles.card}>
      <div className={styles.titleRow}>
        <Link href={`/heists/${heist.id}`} className={styles.title}>
          {heist.title}
        </Link>
        <Clock size={16} className={styles.clockIcon} />
      </div>
      <span className={status === 'active' ? styles.badgeActive : styles.badgeAssigned}>
        {status === 'active' ? 'Active' : 'Assigned'}
      </span>
      <div className={styles.metaRow}>
        <User size={12} className={styles.metaIcon} />
        <span className={styles.label}>To:</span>
        <span className={styles.target}>
          @{heist.assignedToCodename || '—'}
        </span>
      </div>
      <div className={styles.metaRow}>
        <User size={12} className={styles.metaIcon} />
        <span className={styles.label}>By:</span>
        <span className={styles.agent}>@{heist.createdByCodename}</span>
      </div>
      <div className={styles.metaRow}>
        <Calendar size={12} className={styles.metaIcon} />
        <span className={styles.deadlineLabel}>{deadlineLabel} •</span>
        <span className={timeRemaining === 'Overdue' ? styles.deadlineOverdue : styles.deadline}>
          {timeRemaining}
        </span>
      </div>
    </div>
  )
}

export function HeistCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonBadge} />
      <div className={styles.skeletonRow} />
      <div className={styles.skeletonRow} />
      <div className={styles.skeletonRow} />
    </div>
  )
}
