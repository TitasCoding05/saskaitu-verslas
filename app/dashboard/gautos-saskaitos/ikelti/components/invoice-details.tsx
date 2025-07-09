"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle, Edit3, Save, X, Loader2 } from "lucide-react"
import { InvoiceData } from "../types"

interface InvoiceDetailsProps {
  invoiceData: InvoiceData
  isEditing: boolean
  editedData: InvoiceData | null
  isSaving: boolean
  onStartEditing: () => void
  onCancelEditing: () => void
  onSaveChanges: () => void
  onUpdateField: (path: string, value: string) => void
}

export default function InvoiceDetails({
  invoiceData,
  isEditing,
  editedData,
  isSaving,
  onStartEditing,
  onCancelEditing,
  onSaveChanges,
  onUpdateField
}: InvoiceDetailsProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              AI ištraukta informacija
            </CardTitle>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={onSaveChanges} size="sm" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
                <Button onClick={onCancelEditing} size="sm" variant="outline">
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button onClick={onStartEditing} size="sm" variant="outline">
                <Edit3 className="w-4 h-4 mr-2" />
                Redaguoti
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Status */}
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ar dokumentas yra sąskaita?
          </Label>
          {isEditing ? (
            <Input
              value={editedData?.ar_dokumentas_yra_saskaita || ''}
              onChange={(e) => onUpdateField('ar_dokumentas_yra_saskaita', e.target.value)}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {invoiceData.ar_dokumentas_yra_saskaita}
            </p>
          )}
        </div>

        {/* Basic Invoice Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Serija ir numeris
            </Label>
            {isEditing ? (
              <Input
                value={editedData?.serija_ir_numeris || ''}
                onChange={(e) => onUpdateField('serija_ir_numeris', e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {invoiceData.serija_ir_numeris}
              </p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Išdavimo data
            </Label>
            {isEditing ? (
              <Input
                type="date"
                value={editedData?.isdavimo_data || ''}
                onChange={(e) => onUpdateField('isdavimo_data', e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {invoiceData.isdavimo_data}
              </p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mokėjimo terminas
            </Label>
            {isEditing ? (
              <Input
                type="date"
                value={editedData?.mokejimo_terminas || ''}
                onChange={(e) => onUpdateField('mokejimo_terminas', e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {invoiceData.mokejimo_terminas}
              </p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bendra kaina
            </Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editedData?.bendra_kaina || ''}
                onChange={(e) => onUpdateField('bendra_kaina', e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                €{invoiceData.bendra_kaina}
              </p>
            )}
          </div>
        </div>

        {/* Seller Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Pardavėjas
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Įmonės pavadinimas
              </Label>
              {isEditing ? (
                <Input
                  value={editedData?.pardavejas.pardavejo_imones_pavadinimas || ''}
                  onChange={(e) => onUpdateField('pardavejas.pardavejo_imones_pavadinimas', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {invoiceData.pardavejas.pardavejo_imones_pavadinimas}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Įmonės kodas
                </Label>
                {isEditing ? (
                  <Input
                    value={editedData?.pardavejas.pardavejo_imones_kodas || ''}
                    onChange={(e) => onUpdateField('pardavejas.pardavejo_imones_kodas', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {invoiceData.pardavejas.pardavejo_imones_kodas}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  PVM kodas
                </Label>
                {isEditing ? (
                  <Input
                    value={editedData?.pardavejas.pardavejo_pvm_identifikacijos_numeris || ''}
                    onChange={(e) => onUpdateField('pardavejas.pardavejo_pvm_identifikacijos_numeris', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {invoiceData.pardavejas.pardavejo_pvm_identifikacijos_numeris}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Pirkėjas
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Įmonės pavadinimas
              </Label>
              {isEditing ? (
                <Input
                  value={editedData?.pirkejas.pirkejo_imones_pavadinimas || ''}
                  onChange={(e) => onUpdateField('pirkejas.pirkejo_imones_pavadinimas', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {invoiceData.pirkejas.pirkejo_imones_pavadinimas}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Įmonės kodas
                </Label>
                {isEditing ? (
                  <Input
                    value={editedData?.pirkejas.pirkejo_imones_kodas || ''}
                    onChange={(e) => onUpdateField('pirkejas.pirkejo_imones_kodas', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {invoiceData.pirkejas.pirkejo_imones_kodas}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  PVM kodas
                </Label>
                {isEditing ? (
                  <Input
                    value={editedData?.pirkejas.pirkejo_pvm_identifikacijos_numeris || ''}
                    onChange={(e) => onUpdateField('pirkejas.pirkejo_pvm_identifikacijos_numeris', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {invoiceData.pirkejas.pirkejo_pvm_identifikacijos_numeris}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Prekės/Paslaugos
          </h3>
          <div className="space-y-3">
            {invoiceData.prekes.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Pavadinimas
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {item.pavadinimas}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Kiekis
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {item.kiekis}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Kaina
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      €{item.kaina}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Bendra kaina
                    </Label>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      €{item.bendra_kaina}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}