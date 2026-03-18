// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8, Target, Timer, UserX } from "lucide-react"
import Link from "next/link"
import styles from "./Home.module.css"

export default function Home() {
  return (
    <div className={styles.splash}>
      <div className={styles.bg} />

      <div className={styles.hero}>
        <span className={styles.badge}>Classified Mission Briefing</span>
        <h1 className={styles.title}>
          P<Clock8 className={styles.clockIcon} strokeWidth={2.75} />cket Heist
        </h1>
        <p className={styles.tagline}>Pull off the perfect heist — before anyone notices.</p>
        <p className={styles.desc}>
          The ultimate game of stealthy office pranks and sneaky workplace missions.
          Assign tasks, collect rewards, and become the most notorious agent in the building.
        </p>
        <div className={styles.cta}>
          <Link href="/signup" className="btn">Start Your Heist</Link>
          <Link href="/login" className={styles.loginLink}>Already an agent? Sign in</Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.card}>
          <Target className={styles.cardIcon} />
          <h3>Assign Missions</h3>
          <p>Create sneaky tasks and assign them to unsuspecting colleagues.</p>
        </div>
        <div className={styles.card}>
          <Timer className={styles.cardIcon} />
          <h3>Beat the Clock</h3>
          <p>Every heist runs a 48-hour window. Execute before time runs out.</p>
        </div>
        <div className={styles.card}>
          <UserX className={styles.cardIcon} />
          <h3>Stay Undercover</h3>
          <p>Operate under a codename. The less they know, the better.</p>
        </div>
      </div>
    </div>
  )
}
