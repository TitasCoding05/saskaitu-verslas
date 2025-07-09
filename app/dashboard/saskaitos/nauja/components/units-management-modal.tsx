"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, Trash2, GripVertical, Edit } from "lucide-react"
import { UnitOfMeasure } from "../types"
import { useDragDrop } from "./use-drag-drop"

interface UnitsManagementModalProps {
  unitOfMeasures: UnitOfMeasure[]
  isOpen: boolean
  onClose: () => void
  onAddCustomUnitOfMeasure: (customUnit: string) => void
  onRemoveUnitOfMeasure?: (unitId: string) => void
  onReorderUnits?: (units: UnitOfMeasure[]) => void
}

export function UnitsManagementModal({
  unitOfMeasures,
  isOpen,
  onClose,
  onAddCustomUnitOfMeasure,
  onRemoveUnitOfMeasure,
  onReorderUnits
}: UnitsManagementModalProps) {
  const [newUnitName, setNewUnitName] = useState("")

  const {
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
    handleTouchEnd
  } = useDragDrop(unitOfMeasures, onReorderUnits)

  const handleAddNewUnit = () => {
    if (newUnitName.trim()) {
      onAddCustomUnitOfMeasure(newUnitName.trim())
      setNewUnitName("")
    }
  }

  const handleDeleteUnit = (unitId: string) => {
    if (onRemoveUnitOfMeasure) {
      const confirmDelete = window.confirm("Ar tikrai norite ištrinti šį matą?")
      if (confirmDelete) {
        onRemoveUnitOfMeasure(unitId)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Redaguoti matus
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Existing Units List */}
        <div className="space-y-2 mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Esami matai:
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto drag-list drag-container">
            {unitOfMeasures.map((unit, index) => (
              <div key={unit.id}>
                {/* Placeholder before current item */}
                {dragPlaceholderIndex === index && draggedIndex !== null && (
                  <div className="h-2 bg-blue-400 dark:bg-blue-600 rounded-full mx-2 mb-2 drag-placeholder" />
                )}
                
                <div
                  draggable
                  data-drag-item
                  data-drag-index={index}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onTouchStart={(e) => handleTouchStart(e, index)}
                  onTouchMove={(e) => handleTouchMove(e, 'data-drag-item', 'data-drag-index')}
                  onTouchEnd={() => handleTouchEnd(unitOfMeasures, onReorderUnits)}
                  className={`flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 drag-item ${
                    draggedIndex === index ? 'drag-item-dragging opacity-60 scale-98 shadow-lg z-10' : ''
                  } ${
                    dragOverIndex === index && draggedIndex !== index ? 'drag-item-over border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-102' : ''
                  }`}
                  style={{
                    touchAction: 'none'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400 drag-grip" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {unit.name}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleDeleteUnit(unit.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Placeholder after last item */}
                {dragPlaceholderIndex === unitOfMeasures.length && index === unitOfMeasures.length - 1 && draggedIndex !== null && (
                  <div className="h-2 bg-blue-400 dark:bg-blue-600 rounded-full mx-2 mt-2 drag-placeholder" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add New Unit */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pridėti naują matą:
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Įveskite mato pavadinimą (pvz., vnt., kg, g)"
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddNewUnit()
                }
              }}
            />
            <Button
              onClick={handleAddNewUnit}
              disabled={!newUnitName.trim()}
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}