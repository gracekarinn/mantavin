import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout/DashboardLayout'
import { ProofOfWorkPageModule } from '@/modules/DashboardModule'

const page = () => {
  return (
    <DashboardLayout>
      <ProofOfWorkPageModule />
    </DashboardLayout>
  )
}

export default page
