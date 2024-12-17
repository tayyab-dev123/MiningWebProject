import ProductUpload from '@/components/inventory/FileUpload'
import LandingLayout from '@/components/Layouts/LandingLayout'
import React from 'react'

function page() {
  return (
    <div>
      <LandingLayout>
        <ProductUpload/>
      </LandingLayout>
    </div>
  )
}

export default page
