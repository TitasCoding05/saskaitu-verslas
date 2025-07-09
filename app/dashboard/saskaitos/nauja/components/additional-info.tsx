"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface AdditionalInfoProps {
  notes: string
  onNotesChange: (notes: string) => void
}

export function AdditionalInfo({ 
  notes, 
  onNotesChange 
}: AdditionalInfoProps) {
  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mono-shadow-lg">
      <CardHeader>
        <CardTitle className="text-black dark:text-white text-lg">Papildoma informacija</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Pastabos, mokėjimo instrukcijos ar kita svarbi informacija..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 min-h-[100px]"
        />
      </CardContent>
    </Card>
  )
}