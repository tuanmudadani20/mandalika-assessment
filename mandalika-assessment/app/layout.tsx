import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { ORG_NAME } from '@/lib/assessment-data'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: `Mandalika Talent Assessment | ${ORG_NAME}`,
  description:
    'Talent assessment berbasis 26 tetrad, 26 ML-SJT, dan 5 essay untuk memetakan 13 dimensi perilaku kerja.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} bg-ink font-sans text-text antialiased`}>
        {children}
      </body>
    </html>
  )
}
