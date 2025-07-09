"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { useDropzone } from 'react-dropzone'

interface UploadAreaProps {
  onDrop: (acceptedFiles: File[]) => void
  isDragActive: boolean
  isAnalyzing: boolean
}

export default function UploadArea({ onDrop, isDragActive, isAnalyzing }: UploadAreaProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    disabled: isAnalyzing
  })

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-black dark:text-white">
          Failų įkėlimas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          } ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <Upload className="w-12 h-12 text-gray-400" />
            <div className="w-full max-w-md">
              <p className="text-lg font-medium text-black dark:text-white text-center">
                {isDragActive
                  ? 'Paleiskite failus čia'
                  : 'Vilkite failus čia arba spustelėkite pasirinkti'}
              </p>
              <p className="text-sm text-black dark:text-gray-400 mt-2 text-center">
                Palaikomi formatai: PDF, PNG, JPG, JPEG. Galite įkelti kelis failus vienu metu.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}