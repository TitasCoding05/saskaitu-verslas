import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function ISAFExportPage() {
  const exportHistory = [
    {
      id: 1,
      period: "2024-01",
      dateRange: "2024-01-01 - 2024-01-31",
      status: "Sėkmingai",
      exportDate: "2024-02-01",
      fileSize: "2.3 KB",
      recordCount: 15,
    },
    {
      id: 2,
      period: "2023-12",
      dateRange: "2023-12-01 - 2023-12-31",
      status: "Sėkmingai",
      exportDate: "2024-01-05",
      fileSize: "1.8 KB",
      recordCount: 12,
    },
    {
      id: 3,
      period: "2023-11",
      dateRange: "2023-11-01 - 2023-11-30",
      status: "Klaida",
      exportDate: "2023-12-02",
      error: "Trūksta PVM duomenų",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Sėkmingai":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Klaida":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "Vykdoma":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sėkmingai":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400"
      case "Klaida":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400"
      case "Vykdoma":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ISAF eksportas</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Eksportuokite sąskaitas faktūras į ISAF formatą VMI deklaravimui
        </p>
      </div>

      {/* Export Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Download className="w-5 h-5 mr-2" />
            Naujas eksportas
          </CardTitle>
          <CardDescription>Pasirinkite laikotarpį ir eksportuokite sąskaitas faktūras į CSV formatą</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="period-from">Laikotarpis nuo</Label>
              <Input
                id="period-from"
                type="date"
                defaultValue="2024-01-01"
              />
            </div>
            <div>
              <Label htmlFor="period-to">Laikotarpis iki</Label>
              <Input
                id="period-to"
                type="date"
                defaultValue="2024-01-31"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="export-type">Eksporto tipas</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pasirinkite eksporto tipą" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Visos sąskaitos faktūros</SelectItem>
                <SelectItem value="paid">Tik apmokėtos sąskaitos</SelectItem>
                <SelectItem value="vat">Tik su PVM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">ISAF formato reikalavimai:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Eksportuojamos tik sąskaitos faktūros su PVM</li>
                  <li>Failas generuojamas CSV formatu pagal VMI specifikaciją</li>
                  <li>Įtraukiami tik patvirtinti ir išsiųsti dokumentai</li>
                </ul>
              </div>
            </div>
          </div>

          <Button className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Eksportuoti į ISAF
          </Button>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Eksportų istorija</CardTitle>
          <CardDescription>Anksčiau atlikti ISAF eksportai</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exportHistory.map((export_item) => (
              <div
                key={export_item.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white border"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-white">ISAF_{export_item.period}.csv</p>
                      <Badge className={getStatusColor(export_item.status)}>
                        {getStatusIcon(export_item.status)}
                        <span className="ml-1">{export_item.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{export_item.dateRange}</p>
                    {export_item.error ? (
                      <p className="text-xs text-red-600 dark:text-red-400">Klaida: {export_item.error}</p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {export_item.recordCount} įrašų • {export_item.fileSize}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                    <p>Eksportuota:</p>
                    <p>{export_item.exportDate}</p>
                  </div>
                  {export_item.status === "Sėkmingai" && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Pagalba</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Kas yra ISAF?</strong> ISAF (Informacinė sąskaitų faktūrų apskaitos forma) - tai VMI reikalaujamas
              duomenų formatas PVM deklaravimui.
            </p>
            <p>
              <strong>Kada reikia pateikti?</strong> ISAF duomenys pateikiami kartu su PVM deklaracija iki kito mėnesio
              25 dienos.
            </p>
            <p>
              <strong>Kaip naudoti?</strong> Atsisiųskite CSV failą ir įkelkite jį į VMI EDS sistemą PVM deklaracijos
              pildymo metu.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
