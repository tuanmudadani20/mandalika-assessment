'use client'

import { useEffect } from 'react'

export function PrintTrigger() {
  useEffect(() => {
    const triggerPrint = () => {
      window.setTimeout(() => {
        window.focus()
        window.print()
      }, 350)
    }

    if (document.readyState === 'complete') {
      triggerPrint()
      return
    }

    window.addEventListener('load', triggerPrint, { once: true })
    return () => window.removeEventListener('load', triggerPrint)
  }, [])

  return (
    <div className="print:hidden">
      <div className="rounded-card border border-border bg-panel px-4 py-3 text-sm text-muted">
        Report siap dicetak. Dialog print akan terbuka otomatis.
      </div>
    </div>
  )
}
