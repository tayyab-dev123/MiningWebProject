import AdminProductTable from '@/components/AllProduct/ProductTable'
import ProductUpload from '@/components/inventory/FileUpload'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import LandingLayout from '@/components/Layouts/LandingLayout'
import AccountDashboard from '@/components/myAccount/layout'
import React from 'react'

function page() {
  return (
    <div>
      <LandingLayout>
        <AccountDashboard/>
      </LandingLayout>
    </div>
  )
}

export default page;
