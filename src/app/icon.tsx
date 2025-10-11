import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#7c3aed',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '96px',
        }}
      >
        <svg
          width="384"
          height="384"
          viewBox="0 0 256 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dragonfly body */}
          <circle cx="128" cy="128" r="40" fill="#fff" />
          <ellipse cx="128" cy="180" rx="30" ry="50" fill="#fff" />
          
          {/* Wings */}
          <ellipse cx="50" cy="120" rx="50" ry="25" fill="#fff" opacity="0.8" />
          <ellipse cx="206" cy="120" rx="50" ry="25" fill="#fff" opacity="0.8" />
          <ellipse cx="60" cy="180" rx="45" ry="20" fill="#fff" opacity="0.6" />
          <ellipse cx="196" cy="180" rx="45" ry="20" fill="#fff" opacity="0.6" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
