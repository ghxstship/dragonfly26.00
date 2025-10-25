'use client'

import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic<{ url: string }>(
  () => import('swagger-ui-react'),
  { ssr: false }
)

export function APIDocsClient() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
          <p className="mt-2 text-gray-600">
            Complete REST API reference for the ATLVS platform
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SwaggerUI url="/api/docs" />
      </div>
    </div>
  )
}
