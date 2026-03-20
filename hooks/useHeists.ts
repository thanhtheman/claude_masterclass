'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUser } from '@/hooks/useUser'
import { COLLECTIONS, Heist, heistConverter } from '@/types/firestore'

type HeistMode = 'active' | 'assigned' | 'expired'

interface UseHeistsResult {
  heists: Heist[]
  loading: boolean
}

export function useHeists(mode: HeistMode): UseHeistsResult {
  const { user, loading: userLoading } = useUser()
  const uid = user?.uid
  const [heists, setHeists] = useState<Heist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userLoading) return

    if (!uid) {
      setLoading(false)
      return
    }

    const ref = collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter)
    const now = new Date()

    const q =
      mode === 'active'
        ? query(ref, where('assignedTo', '==', uid), where('deadline', '>', now))
        : mode === 'assigned'
          ? query(ref, where('createdBy', '==', uid), where('deadline', '>', now))
          : query(ref, where('deadline', '<=', now), where('finalStatus', '!=', null))

    return onSnapshot(
      q,
      (snapshot) => {
        setHeists(snapshot.docs.map((doc) => doc.data() as Heist))
        setLoading(false)
      },
      (err) => {
        console.error('[useHeists] Firestore error:', err)
        setHeists([])
        setLoading(false)
      }
    )
  }, [uid, userLoading, mode])

  return { heists, loading }
}
