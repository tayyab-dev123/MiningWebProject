import AdminUsersPage from '@/components/AllProduct/AllUser'
import AdminProductTable from '@/components/AllProduct/ProductTable'
import ProductUpload from '@/components/inventory/FileUpload'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import LandingLayout from '@/components/Layouts/LandingLayout'
import React from 'react'

function page() {
  return (
    <div>
      <LandingLayout>
        <AdminUsersPage/>
      </LandingLayout>
    </div>
  )
}

export default page;
