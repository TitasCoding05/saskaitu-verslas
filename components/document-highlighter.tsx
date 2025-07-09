"use client"

import { useState, useRef, useEffect } from 'react'

interface HighlightCoordinates {
  x: number
  y: number
  width: number
  height: number
}

interface DocumentHighlighterProps {
  documentUrl: string
  coordinates: Record<string, HighlightCoordinates>
  hoveredField: string | null
  className?: string
}

export default function DocumentHighlighter({
  documentUrl,
  coordinates,
  hoveredField,
  className = ""
}: DocumentHighlighterProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const updateDimensions = () => {
      if (imageRef.current && containerRef.current) {
        const rect = imageRef.current.getBoundingClientRect()
        setImageDimensions({
          width: rect.width,
          height: rect.height
        })
      }
    }

    if (imageLoaded) {
      updateDimensions()
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }
  }, [imageLoaded])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const getHighlightStyle = (coords: HighlightCoordinates) => {
    if (!imageLoaded || !imageDimensions.width || !imageDimensions.height) {
      return { display: 'none' }
    }

    return {
      position: 'absolute' as const,
      left: `${coords.x}%`,
      top: `${coords.y}%`,
      width: `${coords.width}%`,
      height: `${coords.height}%`,
      backgroundColor: 'rgba(255, 255, 0, 0.3)',
      border: '2px solid #fbbf24',
      borderRadius: '4px',
      pointerEvents: 'none' as const,
      transition: 'all 0.2s ease-in-out',
      zIndex: 10
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Document Image or PDF */}
      {documentUrl.startsWith('data:application/pdf') ? (
        <>
          <iframe
            src={documentUrl}
            className="w-full h-full border border-gray-300 dark:border-gray-600 rounded-lg"
            title="PDF Document"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Highlight Overlays for PDF */}
          {imageLoaded && hoveredField && coordinates[hoveredField] && (
            <div
              style={{
                position: 'absolute' as const,
                left: `${coordinates[hoveredField].x}%`,
                top: `${coordinates[hoveredField].y}%`,
                width: `${coordinates[hoveredField].width}%`,
                height: `${coordinates[hoveredField].height}%`,
                backgroundColor: 'rgba(255, 255, 0, 0.3)',
                border: '2px solid #fbbf24',
                borderRadius: '4px',
                pointerEvents: 'none' as const,
                transition: 'all 0.2s ease-in-out',
                zIndex: 10
              }}
              className="animate-pulse"
            />
          )}
          
          {/* Show all highlights when no specific field is hovered for PDF */}
          {imageLoaded && !hoveredField && Object.entries(coordinates).map(([fieldName, coords]) => (
            <div
              key={fieldName}
              style={{
                position: 'absolute' as const,
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                width: `${coords.width}%`,
                height: `${coords.height}%`,
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                pointerEvents: 'none' as const,
                transition: 'all 0.2s ease-in-out',
                zIndex: 10,
                opacity: 0
              }}
              title={fieldName}
            />
          ))}
        </>
      ) : (
        <>
          <img
            ref={imageRef}
            src={documentUrl}
            alt="Processed Document"
            className="w-full h-full object-contain border border-gray-300 dark:border-gray-600 rounded-lg bg-white"
            onLoad={handleImageLoad}
            style={{
              maxHeight: '100%',
              maxWidth: '100%'
            }}
          />
          
          {/* Highlight Overlays for Images */}
          {imageLoaded && hoveredField && coordinates[hoveredField] && (
            <div
              style={getHighlightStyle(coordinates[hoveredField])}
              className="animate-pulse"
            />
          )}
          
          {/* Show all highlights when no specific field is hovered for Images */}
          {imageLoaded && !hoveredField && Object.entries(coordinates).map(([fieldName, coords]) => (
            <div
              key={fieldName}
              style={{
                ...getHighlightStyle(coords),
                backgroundColor: 'transparent',
                border: 'none',
                opacity: 0
              }}
              title={fieldName}
            />
          ))}
        </>
      )}
      
      {/* Loading indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  )
}