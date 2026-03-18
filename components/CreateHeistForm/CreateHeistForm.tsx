"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useUser } from "@/hooks/useUser"
import { COLLECTIONS, CreateHeistInput, User, heistConverter, userConverter } from "@/types/firestore"
import styles from "./CreateHeistForm.module.css"

export default function CreateHeistForm() {
  const { user } = useUser()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignableUsers, setAssignableUsers] = useState<User[]>([])
  const [assignedToId, setAssignedToId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchUsers() {
      const snapshot = await getDocs(
        collection(db, COLLECTIONS.USERS).withConverter(userConverter)
      )
      const others = snapshot.docs
        .map((doc) => doc.data())
        .filter((u) => u.id !== user?.uid)
      setAssignableUsers(others)
      if (others.length > 0) setAssignedToId(others[0].id)
    }
    if (user) fetchUsers()
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    const assignee = assignableUsers.find((u) => u.id === assignedToId)
    if (!assignee) return

    setSubmitting(true)
    setError("")

    const input: CreateHeistInput = {
      title,
      description,
      createdBy: user.uid,
      createdByCodename: user.displayName ?? "",
      assignedTo: assignee.id,
      assignedToCodename: assignee.codename,
      deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
      finalStatus: null,
      createdAt: serverTimestamp(),
    }

    try {
      await addDoc(
        collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter),
        input
      )
      router.push("/heists")
    } catch {
      setError("Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">Title</label>
        <input
          className={styles.input}
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name your heist"
          required
          disabled={submitting}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea
          className={styles.textarea}
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the mission..."
          rows={4}
          required
          disabled={submitting}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="assignedTo">Assign to</label>
        <select
          className={styles.select}
          id="assignedTo"
          value={assignedToId}
          onChange={(e) => setAssignedToId(e.target.value)}
          required
          disabled={submitting || assignableUsers.length === 0}
        >
          {assignableUsers.length === 0 && (
            <option value="">No agents available</option>
          )}
          {assignableUsers.map((u) => (
            <option key={u.id} value={u.id}>{u.codename}</option>
          ))}
        </select>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.submitBtn} type="submit" disabled={submitting}>
        {submitting ? "Dispatching…" : "Launch Heist"}
      </button>
    </form>
  )
}
