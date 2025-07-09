"use client"

import { useState, useCallback, useEffect } from 'react'
import { UploadedFile, InvoiceData } from '../types'

const STORAGE_KEY = 'uploaded-invoices'

export function useUploadLogic() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<InvoiceData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  // Removed showPreview state

  // Load uploaded files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem(STORAGE_KEY)
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles)
        // Filter out files that don't have results (since we can't restore File objects)
        const filesWithResults = parsedFiles.filter((f: UploadedFile) => f.result)
        setUploadedFiles(filesWithResults)
      } catch (error) {
        console.error('Error loading saved files:', error)
      }
    }
  }, [])

  // Automatically select first completed file on initial render
  useEffect(() => {
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed')
    if (completedFiles.length > 0 && !selectedFileId) {
      setSelectedFileId(completedFiles[0].id)
    }
  }, [uploadedFiles, selectedFileId])

  // Save uploaded files to localStorage whenever they change
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      // Only save files that have been processed (have results)
      const processedFiles = uploadedFiles
        .filter(f => f.result)
        .map(f => ({
          ...f,
          file: {
            name: f.file.name,
            size: f.file.size,
            type: f.file.type
          },
          // Exclude large data from localStorage to prevent quota exceeded
          result: f.result ? {
            ...f.result,
            originalFile: {
              name: f.result.originalFile.name,
              type: f.result.originalFile.type,
              dataUrl: '' // Remove large base64 data
            }
          } : undefined
        }))
      
      if (processedFiles.length > 0) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(processedFiles))
        } catch (error) {
          console.warn('Failed to save to localStorage (quota exceeded):', error)
          // Clear localStorage and try to save without any files
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [uploadedFiles])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: 'pending',
      progress: 0,
      estimatedTime: 0,
      startTime: null
    }))

    setUploadedFiles(prev => {
      const updated = [...prev, ...newFiles]
      return updated
    })
  }, [])

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    if (selectedFileId === fileId) {
      setSelectedFileId(null)
    }
  }

  const processFile = async (fileData: UploadedFile) => {
    const fileId = fileData.id

    // Update file status to processing
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'processing', startTime: Date.now(), estimatedTime: 15 }
        : f
    ))

    // Progress simulation
    const progressInterval = setInterval(() => {
      setUploadedFiles(prev => prev.map(f => {
        if (f.id === fileId && f.status === 'processing') {
          const newProgress = f.progress >= 90 ? f.progress : f.progress + Math.random() * 10
          const newEstimatedTime = Math.max(0, f.estimatedTime - 1)
          return { ...f, progress: newProgress, estimatedTime: newEstimatedTime }
        }
        return f
      }))
    }, 1000)

    try {
      const formData = new FormData()
      formData.append('file', fileData.file)

      const response = await fetch('/api/process-invoice', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Nepavyko apdoroti failo')
      }

      // Complete the progress and update result
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              status: 'completed', 
              progress: 100, 
              estimatedTime: 0,
              result 
            }
          : f
      ))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nepavyko apdoroti failo'
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              status: 'error', 
              progress: 0, 
              estimatedTime: 0,
              error: errorMessage 
            }
          : f
      ))
    } finally {
      clearInterval(progressInterval)
    }
  }

  const analyzeAllFiles = async () => {
    setIsAnalyzing(true)
    
    const pendingFiles = uploadedFiles.filter(f => f.status === 'pending')
    
    // Process files sequentially to avoid overwhelming the API
    for (const file of pendingFiles) {
      await processFile(file)
    }
    
    setIsAnalyzing(false)
  }

  const resetUpload = () => {
    setUploadedFiles([])
    setSelectedFileId(null)
    setIsEditing(false)
    setEditedData(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const selectFile = (fileId: string) => {
    setSelectedFileId(fileId)
    setIsEditing(false)
    setEditedData(null)
  }

  const startEditing = () => {
    const selectedFile = uploadedFiles.find(f => f.id === selectedFileId)
    if (selectedFile?.result) {
      setEditedData({ ...selectedFile.result.data })
      setIsEditing(true)
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditedData(null)
  }

  const saveChanges = async () => {
    if (!editedData || !selectedFileId) return
    
    setIsSaving(true)
    try {
      // Update the local state
      setUploadedFiles(prev => prev.map(f => 
        f.id === selectedFileId && f.result
          ? { ...f, result: { ...f.result, data: editedData } }
          : f
      ))
      setIsEditing(false)
      setEditedData(null)
      
      console.log('Sąskaitos duomenys išsaugoti')
    } catch (error) {
      console.error('Klaida išsaugant duomenis:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateEditedField = (path: string, value: string) => {
    if (!editedData) return
    
    const pathParts = path.split('.')
    const newData = { ...editedData }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = newData
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]]
    }
    current[pathParts[pathParts.length - 1]] = value
    
    setEditedData(newData)
  }

  const downloadPDF = () => {
    const selectedFile = uploadedFiles.find(f => f.id === selectedFileId)
    if (!selectedFile?.result?.originalFile.dataUrl) return
    
    const link = document.createElement('a')
    link.href = selectedFile.result.originalFile.dataUrl
    link.download = selectedFile.result.originalFile.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Removed togglePreview function

  // Helper function to check if a file is a valid invoice
  const isValidInvoice = (file: UploadedFile) => {
    if (!file.result?.data?.ar_dokumentas_yra_saskaita) return true // If not processed yet, assume valid
    const invoiceStatus = file.result.data.ar_dokumentas_yra_saskaita.toLowerCase().trim()
    return !(invoiceStatus === 'nerasta' ||
             invoiceStatus === 'ne' ||
             invoiceStatus === 'false' ||
             invoiceStatus === 'no' ||
             invoiceStatus === 'not found' ||
             invoiceStatus === 'nėra' ||
             invoiceStatus === 'nera' ||
             invoiceStatus.includes('nerasta') ||
             invoiceStatus.includes('not found'))
  }

  const navigateToFile = (direction: 'prev' | 'next') => {
    // Only navigate among valid invoice files
    const validFiles = uploadedFiles.filter(isValidInvoice)
    const currentIndex = validFiles.findIndex(f => f.id === selectedFileId)
    if (currentIndex === -1 || validFiles.length === 0) return

    let newIndex
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : validFiles.length - 1
    } else {
      newIndex = currentIndex < validFiles.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedFileId(validFiles[newIndex].id)
    setIsEditing(false)
    setEditedData(null)
  }

  const markAsInvoice = (fileId: string) => {
    setUploadedFiles(prev => prev.map(file => {
      if (file.id === fileId && file.result?.data) {
        return {
          ...file,
          result: {
            ...file.result,
            data: {
              ...file.result.data,
              ar_dokumentas_yra_saskaita: 'Taip'
            }
          }
        }
      }
      return file
    }))
  }

  const uploadCurrentInvoice = async () => {
    if (!selectedFileId || !selectedFile?.result) return

    try {
      // Save to database via API
      const response = await fetch('/api/confirm-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalName: selectedFile.file.name,
          fileType: selectedFile.file.type,
          compressedUrl: selectedFile.result.compressedUrl || selectedFile.result.originalFile.dataUrl,
          extractedData: selectedFile.result.data,
          coordinates: selectedFile.result.coordinates || {}
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Nepavyko išsaugoti dokumento')
      }

      console.log('Sąskaita sėkmingai išsaugota į duomenų bazę')
      
      // Remove from upload list (moves to main invoices page)
      removeFile(selectedFileId)
      
      // Show success message
      alert('Sąskaita sėkmingai įkelta į pagrindinį sąrašą!')
    } catch (error) {
      console.error('Klaida įkeliant sąskaitą:', error)
      alert(`Klaida įkeliant sąskaitą: ${error instanceof Error ? error.message : 'Nežinoma klaida'}`)
    }
  }

  const uploadAllInvoices = async () => {
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed' && f.result)
    
    if (completedFiles.length === 0) {
      alert('Nėra analizuotų sąskaitų įkėlimui')
      return
    }

    try {
      let successCount = 0
      let errorCount = 0

      // Save all completed files to database
      for (const file of completedFiles) {
        try {
          const response = await fetch('/api/confirm-document', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              originalName: file.file.name,
              fileType: file.file.type,
              compressedUrl: file.result!.compressedUrl || file.result!.originalFile.dataUrl,
              extractedData: file.result!.data,
              coordinates: file.result!.coordinates || {}
            })
          })

          if (response.ok) {
            successCount++
          } else {
            errorCount++
            console.error(`Nepavyko išsaugoti failo ${file.file.name}`)
          }
        } catch (error) {
          errorCount++
          console.error(`Klaida išsaugant failą ${file.file.name}:`, error)
        }
      }
      
      // Remove successfully uploaded files from upload list
      if (successCount > 0) {
        setUploadedFiles(prev => {
          const remaining = prev.filter(f => f.status !== 'completed')
          return remaining
        })
        setSelectedFileId(null)
      }
      
      // Show result message
      if (errorCount === 0) {
        alert(`${successCount} sąskaitos sėkmingai įkeltos į pagrindinį sąrašą!`)
      } else {
        alert(`${successCount} sąskaitos įkeltos sėkmingai, ${errorCount} nepavyko įkelti.`)
      }
    } catch (error) {
      console.error('Klaida įkeliant sąskaitas:', error)
      alert('Klaida įkeliant sąskaitas')
    }
  }

  const selectedFile = uploadedFiles.find(f => f.id === selectedFileId)
  const validFiles = uploadedFiles.filter(isValidInvoice)
  const currentFileIndex = validFiles.findIndex(f => f.id === selectedFileId)

  return {
    // State
    uploadedFiles,
    isAnalyzing,
    selectedFileId,
    isEditing,
    editedData,
    isSaving,
    // Removed showPreview from returned state
    
    // Actions
    onDrop,
    removeFile,
    analyzeAllFiles,
    resetUpload,
    selectFile,
    startEditing,
    cancelEditing,
    saveChanges,
    updateEditedField,
    downloadPDF,
    // Removed togglePreview from returned actions
    navigateToFile,
    uploadCurrentInvoice,
    uploadAllInvoices,
    markAsInvoice,
    
    // Computed values
    selectedFile,
    currentFileIndex,
    totalFiles: validFiles.length
  }
}