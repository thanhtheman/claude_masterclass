import Link from 'next/link'
import { Clock, User, Calendar } from 'lucide-react'
import type { Heist } from '@/types/firestore'
import styles from './HeistCard.module.css'

interface HeistCardProps {
  heist: Heist
  status: 'active' | 'assigned'
}

export function HeistCard({ heist, status }: HeistCardProps) {
  const deadline = heist.deadline.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

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
        <span className={styles.deadline}>{deadline}</span>
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
