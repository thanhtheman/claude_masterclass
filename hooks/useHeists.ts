'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUser } from '@/hooks/useUser'
import { COLLECTIONS, Heist, heistConverter } from '@/types/firestore'

type HeistMode = 'active' | 'assigned' | 'expired'

export function useHeists(mode: HeistMode): Heist[] {
  const { user, loading } = useUser()
  const uid = user?.uid
  const [heists, setHeists] = useState<Heist[]>([])

  useEffect(() => {
    if (loading || !uid) return

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
      (snapshot) => { setHeists(snapshot.docs.map((doc) => doc.data() as Heist)) },
      (err) => { console.error('[useHeists] Firestore error:', err); setHeists([]) }
    )
  }, [uid, loading, mode])

  return heists
}
