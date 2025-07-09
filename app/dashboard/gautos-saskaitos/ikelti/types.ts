export interface InvoiceData {
  ar_dokumentas_yra_saskaita: string
  serija_ir_numeris: string
  isdavimo_data: string
  mokejimo_terminas: string
  kaina: string
  pvm: string
  bendra_kaina: string
  pardavejas: {
    pardavejo_imones_pavadinimas: string
    pardavejo_imones_kodas: string
    pardavejo_pvm_identifikacijos_numeris: string
    pardavejo_telefono_numeris: string
    pardavejo_el_pastas: string
    pardavejo_gatve: string
    pardavejo_miestas: string
    pardavejo_salies_dvieju_raidziu_kodas: string
    pardavejo_pasto_kodas: string
    pardavejas_fizinis_asmuo: string
  }
  pirkejas: {
    pirkejo_imones_pavadinimas: string
    pirkejo_imones_kodas: string
    pirkejo_pvm_identifikacijos_numeris: string
    pirkejo_gatve: string
    pirkejo_miestas: string
    pirkejo_salies_dvieju_raidziu_kodas: string
    pirkejo_pasto_kodas: string
    pirkejas_fizinis_asmuo: string
  }
  prekes: Array<{
    kiekis: string
    pavadinimas: string
    kaina: string
    pvm: string
    bendra_kaina: string
  }>
}

export interface ProcessedInvoice {
  success: boolean
  data: InvoiceData
  coordinates?: Record<string, { x: number; y: number; width: number; height: number }>
  originalFile: {
    name: string
    type: string
    dataUrl: string
  }
  compressedUrl?: string
}

export interface UploadedFile {
  id: string
  file: File
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  estimatedTime: number
  startTime: number | null
  result?: ProcessedInvoice
  error?: string
}