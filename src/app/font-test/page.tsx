// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'

import TypographyDemo from '@/components/TypographyDemo'

export default function FontTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <TypographyDemo />
    </div>
  )
}

export const metadata = {
  title: 'Font Test - AYN Beauty Typography',
  description: 'Typography demonstration for AYN Beauty website'
}