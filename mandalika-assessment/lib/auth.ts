const DEFAULT_LEADER_PASSWORD = 'mandalikaassessment2026'
const LEGACY_PASSWORDS = new Set(['mandalika2024'])

export function getLeaderPassword(): string {
  const configured = process.env.LEADER_PASSWORD?.trim() || ''
  if (!configured || LEGACY_PASSWORDS.has(configured)) {
    return DEFAULT_LEADER_PASSWORD
  }

  return configured
}

export function checkLeaderPassword(password: string): boolean {
  const configured = getLeaderPassword()
  return password === configured || password === DEFAULT_LEADER_PASSWORD
}
