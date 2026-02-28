// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from "lucide-react"

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />cket Heist
        </h1>
        <div>Tiny missions. Big office mischief.</div>
        <p>
          Welcome to Pocket Heist — the ultimate game of stealthy office pranks
          and sneaky workplace missions. Assign tasks, collect rewards, and
          become the most notorious agent in the building.
        </p>
        <p>
          Whether you&apos;re hiding your boss&apos;s stapler or orchestrating a
          full-scale supply closet takeover, every heist counts. Are you bold
          enough to pull it off?
        </p>
      </div>
    </div>
  )
}
