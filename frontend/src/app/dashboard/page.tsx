import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout/DashboardLayout'
import { OverviewPageModule } from '@/modules/DashboardModule'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <OverviewPageModule />
    </DashboardLayout>
  )
}
