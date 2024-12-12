import AdminProductTable from '@/components/AllProduct/ProductTable'
import ProductUpload from '@/components/inventory/FileUpload'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

function page() {
  return (
    <div>
      <DefaultLayout>
        <AdminProductTable/>
      </DefaultLayout>
    </div>
  )
}

export default page;
