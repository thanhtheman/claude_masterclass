export function getTimeRemaining(deadline: Date): string {
  const diff = deadline.getTime() - Date.now()

  if (diff <= 0) return 'Overdue'

  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '< 1m'

  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days >= 1) {
    return `${days}d ${hours - days * 24}h`
  }

  return `${hours}h ${minutes - hours * 60}m`
}
