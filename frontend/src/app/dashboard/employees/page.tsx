import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout/DashboardLayout'
import { EmployeesPageModule } from '@/modules/DashboardModule'

export default function EmployeesPage() {
  return (
    <DashboardLayout>
      <EmployeesPageModule />
    </DashboardLayout>
  )
}
