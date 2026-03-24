import React from 'react'
import SettingsClient from '@/components/settings/SettingsClient'
import { getSettings } from '@/lib/actions/settings'

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div className='p-6'>
      <SettingsClient initialSettings={settings} />
    </div>
  )
}
