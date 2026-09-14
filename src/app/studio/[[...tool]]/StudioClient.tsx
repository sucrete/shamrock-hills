'use client'

import dynamic from 'next/dynamic'
import config from '@/sanity/sanity.config'

const NextStudio = dynamic(() => import('next-sanity/studio').then(m => ({ default: m.NextStudio })), { ssr: false })

export default function StudioClient() {
  return <NextStudio config={config} />
}
