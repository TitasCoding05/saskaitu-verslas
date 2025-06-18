"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building,
  Palette,
  Plug,
  CreditCard,
  Crown,
  Check,
  Upload,
  Save,
  Mail,
  Zap,
  Globe,
  Smartphone,
} from "lucide-react"

export default function SettingsPage() {
  const planOptions = [
    { value: "free", label: "Nemokamas" },
    { value: "pro", label: "Pro" },
    { value: "enterprise", label: "Įmonės" }
  ]

  const currentPlan = "free"
  const handlePlanChange = (newPlan: string) => {
    // Placeholder for plan change logic
    console.log(`Plan changed to: ${newPlan}`)
  }

  const plans = [
    {
      id: "free",
      name: "Nemokamas",
      price: "0",
      period: "mėn.",
      features: ["Iki 20 sąskaitų per mėnesį", "1 vartotojas", "Pagrindinės funkcijos", "El. pašto palaikymas"],
      limitations: ["Nėra WooCommerce integracijos", "Nėra ISAF eksporto", "Riboti šablonai"],
    },
    {
      id: "monthly",
      name: "Mėnesinis",
      price: "6.99",
      period: "mėn.",
      popular: true,
      features: [
        "Neribotai sąskaitų",
        "WooCommerce integracija",
        "ISAF eksportas",
        "Pažangūs šablonai",
        "El. pašto sekimas",
        "Prioritetinis palaikymas",
      ],
    },
    {
      id: "annual",
      name: "Metinis",
      price: "69.99",
      period: "metams",
      discount: "17% nuolaida",
      features: [
        "Visos mėnesinio plano funkcijos",
        "17% nuolaida",
        "Prioritetinis palaikymas",
        "Ankstyvasis priėjimas prie naujų funkcijų",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Nustatymai</h1>
        <p className="text-gray-600 dark:text-gray-400">Valdykite savo paskyros nustatymus ir konfigūraciją</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
          <TabsTrigger
            value="company"
            className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            <Building className="w-4 h-4" />
            <span className="hidden sm:inline">Įmonės informacija</span>
            <span className="sm:hidden">Įmonė</span>
          </TabsTrigger>
          <TabsTrigger
            value="design"
            className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Sąskaitų dizainas</span>
            <span className="sm:hidden">Dizainas</span>
          </TabsTrigger>
          <TabsTrigger
            value="integration"
            className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            <Plug className="w-4 h-4" />
            <span className="hidden sm:inline">Integracija</span>
            <span className="sm:hidden">API</span>
          </TabsTrigger>
          <TabsTrigger
            value="plans"
            className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Planai</span>
            <span className="sm:hidden">Planai</span>
          </TabsTrigger>
        </TabsList>

        {/* Company Information Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-gray-200 dark:border-gray-800 mono-shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-black dark:text-white">
                <Building className="w-5 h-5 mr-2" />
                Įmonės duomenys
              </CardTitle>
              <CardDescription>Jūsų įmonės duomenys, kurie bus rodomi sąskaitose faktūrose</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name" className="text-black dark:text-white font-medium">
                    Įmonės pavadinimas
                  </Label>
                  <Input
                    id="company-name"
                    defaultValue="UAB Mano Verslas"
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="company-code" className="text-black dark:text-white font-medium">
                    Įmonės kodas
                  </Label>
                  <Input
                    id="company-code"
                    defaultValue="123456789"
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="vat-code" className="text-black dark:text-white font-medium">
                    PVM mokėtojo kodas
                  </Label>
                  <Input
                    id="vat-code"
                    defaultValue="LT123456789"
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-black dark:text-white font-medium">
                    Telefonas
                  </Label>
                  <Input
                    id="phone"
                    defaultValue="+370 600 12345"
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address" className="text-black dark:text-white font-medium">
                  Adresas
                </Label>
                <Textarea
                  id="address"
                  defaultValue="Vilniaus g. 1, LT-01234 Vilnius"
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bank-details" className="text-black dark:text-white font-medium">
                  Banko rekvizitai
                </Label>
                <Textarea
                  id="bank-details"
                  defaultValue="Swedbank AB, IBAN: LT12 7300 0101 2345 6789"
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                />
              </div>
              <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                <Save className="w-4 h-4 mr-2" />
                Išsaugoti duomenis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice Design Tab */}
        <TabsContent value="design" className="space-y-6">
          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-gray-200 dark:border-gray-800 mono-shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-black dark:text-white">
                <Palette className="w-5 h-5 mr-2" />
                Prekės ženklas ir dizainas
              </CardTitle>
              <CardDescription>Pritaikykite sąskaitų išvaizdą pagal savo prekės ženklą</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-black dark:text-white font-medium">Įmonės logotipas</Label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Įkelti logotipą
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG iki 2MB</p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-color" className="text-black dark:text-white font-medium">
                    Pagrindinė spalva
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="primary-color"
                      type="color"
                      defaultValue="#000000"
                      className="w-12 h-10 p-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                    <Input
                      defaultValue="#000000"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary-color" className="text-black dark:text-white font-medium">
                    Papildoma spalva
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="secondary-color"
                      type="color"
                      defaultValue="#6B7280"
                      className="w-12 h-10 p-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                    <Input
                      defaultValue="#6B7280"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-black dark:text-white font-medium">Sąskaitos šablonas</Label>
                <Select defaultValue="modern">
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modernusis</SelectItem>
                    <SelectItem value="classic">Klasikinis</SelectItem>
                    <SelectItem value="minimal">Minimalistinis</SelectItem>
                    <SelectItem value="corporate">Korporatyvinis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black dark:text-white font-medium">Rodyti logotipą</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Įtraukti logotipą į sąskaitas</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black dark:text-white font-medium">Spalvotas dizainas</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Naudoti spalvas sąskaitose</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                <Save className="w-4 h-4 mr-2" />
                Išsaugoti dizainą
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-gray-200 dark:border-gray-800 mono-shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-black dark:text-white">
                <Mail className="w-5 h-5 mr-2" />
                El. pašto nustatymai
              </CardTitle>
              <CardDescription>Konfigūruokite el. pašto siuntimą ir sekimą</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-black dark:text-white font-medium">Naudoti savo domeną</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Siųskite sąskaitas iš savo domeno (pvz., saskaitos@jusuverslas.lt)
                  </p>
                </div>
                <Switch />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sender-email" className="text-black dark:text-white font-medium">
                    Siuntėjo el. paštas
                  </Label>
                  <Input
                    id="sender-email"
                    defaultValue="saskaitos@jusuverslas.lt"
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sender-name" className="text-black dark:text-white font-medium">
                    Siuntėjo vardas
                  </Label>
                  <Input
                    id="sender-name"
                    defaultValue="UAB Mano Verslas"
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-black dark:text-white font-medium">El. pašto atidarymo sekimas</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stebėkite, kada klientai atidaro jūsų sąskaitas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-gray-200 dark:border-gray-800 mono-shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-black dark:text-white">
                <Globe className="w-5 h-5 mr-2" />
                WooCommerce integracija
              </CardTitle>
              <CardDescription>Sinchronizuokite su savo WooCommerce parduotuve</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-black dark:text-white font-medium">WooCommerce sinchronizacija</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatiškai kurkite sąskaitas iš užsakymų</p>
                </div>
                <Switch />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="woo-url" className="text-black dark:text-white font-medium">
                    Parduotuvės URL
                  </Label>
                  <Input
                    id="woo-url"
                    placeholder="https://jusuparduotuve.lt"
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="woo-key" className="text-black dark:text-white font-medium">
                    API raktas
                  </Label>
                  <Input
                    id="woo-key"
                    type="password"
                    placeholder="ck_xxxxxxxxxxxxxxxx"
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                  />
                </div>
              </div>
              <Button variant="outline" className="border-gray-200 dark:border-gray-800">
                <Zap className="w-4 h-4 mr-2" />
                Testuoti ryšį
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-gray-200 dark:border-gray-800 mono-shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-black dark:text-white">
                <Smartphone className="w-5 h-5 mr-2" />
                API prieiga
              </CardTitle>
              <CardDescription>Integruokite su savo sistemomis per API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-black dark:text-white font-medium">Saugos nustatymai</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Jūsų API raktai ir slapti duomenys yra saugiai apsaugoti
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-black dark:text-white font-medium">Planas</Label>
                <Select
                  defaultValue="free"
                  onValueChange={handlePlanChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pasirinkite planą" />
                  </SelectTrigger>
                  <SelectContent>
                    {planOptions.map((plan) => (
                      <SelectItem key={plan.value} value={plan.value}>
                        {plan.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">
                  API dokumentacija:{" "}
                  <a href="#" className="text-black dark:text-white hover:underline">
                    docs.saskaitalt.lt
                  </a>
                </p>
                <p>
                  Webhook URL:{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    https://api.saskaitalt.lt/webhooks
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-gray-200 dark:border-gray-800 mono-shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-black dark:text-white">
                <CreditCard className="w-5 h-5 mr-2" />
                Prenumeratos planai
              </CardTitle>
              <CardDescription>Pasirinkite planą, kuris geriausiai atitinka jūsų poreikius</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-6 rounded-2xl border-2 transition-all ${
                      "free" === plan.id
                        ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800"
                        : "border-gray-200 dark:border-gray-800 bg-white/20 dark:bg-gray-900/20"
                    } ${plan.popular ? "ring-2 ring-black dark:ring-white" : ""}`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black">
                        <Crown className="w-3 h-3 mr-1" />
                        Populiariausias
                      </Badge>
                    )}
                    {plan.discount && (
                      <Badge className="absolute -top-3 right-4 bg-gray-800 dark:bg-gray-200 text-white dark:text-black">
                        {plan.discount}
                      </Badge>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-black dark:text-white">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-black dark:text-white">€{plan.price}</span>
                        <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">*Nurodyta kaina be PVM</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-black dark:text-white mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations?.map((limitation, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="w-4 h-4 mr-3 flex-shrink-0">×</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        currentPlan === plan.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                      }`}
                      disabled={currentPlan === plan.id}
                    >
                      {currentPlan === plan.id ? "Dabartinis planas" : "Pasirinkti planą"}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Pastaba:</strong> Sistema automatiškai išrašys sąskaitą faktūrą kiekvieną mėnesį. Mokėjimą
                  galėsite atlikti per Opay sistemą platformoje.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
