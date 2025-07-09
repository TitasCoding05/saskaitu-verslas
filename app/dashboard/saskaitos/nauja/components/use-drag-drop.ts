import { useState, useRef, useCallback } from "react"

export function useDragDrop<T>(
  items: T[], 
  onReorder?: (reorderedItems: T[]) => void
) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [dragPlaceholderIndex, setDragPlaceholderIndex] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [isTouchDragging, setIsTouchDragging] = useState(false)
  
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastPlaceholderIndex = useRef<number | null>(null)
  const lastDragOverIndex = useRef<number | null>(null)

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const y = e.clientY - rect.top
      const height = rect.height
      const isAfter = y > height / 2
      const newPlaceholderIndex = isAfter ? index + 1 : index
      
      if (lastDragOverIndex.current !== index) {
        lastDragOverIndex.current = index
        setDragOverIndex(index)
      }
      
      if (lastPlaceholderIndex.current !== newPlaceholderIndex) {
        lastPlaceholderIndex.current = newPlaceholderIndex
        setDragPlaceholderIndex(newPlaceholderIndex)
      }
    }
  }, [draggedIndex])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null)
      setDragPlaceholderIndex(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null) return

    let actualDropIndex = dragPlaceholderIndex !== null ? dragPlaceholderIndex : dropIndex
    
    if (draggedIndex < actualDropIndex) {
      actualDropIndex -= 1
    }

    if (draggedIndex === actualDropIndex) {
      resetDragState()
      return
    }

    const newItems = [...items]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(actualDropIndex, 0, draggedItem)

    if (onReorder) {
      onReorder(newItems)
    }

    resetDragState()
  }, [draggedIndex, dragPlaceholderIndex, items, onReorder])

  const handleTouchStart = useCallback((e: React.TouchEvent, index: number) => {
    const touch = e.touches[0]
    setTouchStartY(touch.clientY)
    setDraggedIndex(index)
    setIsTouchDragging(true)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent, dataAttribute: string, indexAttribute: string) => {
    if (!isTouchDragging || draggedIndex === null || touchStartY === null) return
    
    e.preventDefault()
    
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current)
    }
    
    dragTimeoutRef.current = setTimeout(() => {
      const touch = e.touches[0]
      const currentY = touch.clientY
      
      const elementBelow = document.elementFromPoint(touch.clientX, currentY)
      const listItem = elementBelow?.closest(`[${dataAttribute}]`)
      
      if (listItem) {
        const index = parseInt(listItem.getAttribute(indexAttribute) || '0')
        const rect = listItem.getBoundingClientRect()
        const y = currentY - rect.top
        const height = rect.height
        const isAfter = y > height / 2
        const newPlaceholderIndex = isAfter ? index + 1 : index
        
        if (lastDragOverIndex.current !== index) {
          lastDragOverIndex.current = index
          setDragOverIndex(index)
        }
        
        if (lastPlaceholderIndex.current !== newPlaceholderIndex) {
          lastPlaceholderIndex.current = newPlaceholderIndex
          setDragPlaceholderIndex(newPlaceholderIndex)
        }
      }
    }, 16)
  }, [isTouchDragging, draggedIndex, touchStartY])

  const handleTouchEnd = useCallback((items: T[], onReorder?: (reorderedItems: T[]) => void) => {
    if (!isTouchDragging || draggedIndex === null) return
    
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current)
      dragTimeoutRef.current = null
    }
    
    if (dragPlaceholderIndex !== null) {
      let actualDropIndex = dragPlaceholderIndex
      if (draggedIndex < actualDropIndex) {
        actualDropIndex -= 1
      }

      if (draggedIndex !== actualDropIndex) {
        const newItems = [...items]
        const draggedItem = newItems[draggedIndex]
        newItems.splice(draggedIndex, 1)
        newItems.splice(actualDropIndex, 0, draggedItem)

        if (onReorder) {
          onReorder(newItems)
        }
      }
    }

    resetDragState()
  }, [isTouchDragging, draggedIndex, dragPlaceholderIndex, items, onReorder])

  const resetDragState = useCallback(() => {
    setDraggedIndex(null)
    setDragOverIndex(null)
    setDragPlaceholderIndex(null)
    setTouchStartY(null)
    setIsTouchDragging(false)
    lastPlaceholderIndex.current = null
    lastDragOverIndex.current = null
  }, [])

  return {
    draggedIndex,
    dragOverIndex,
    dragPlaceholderIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetDragState
  }
}