import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle, FileText, Users, Zap, Star } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation */}
      <nav className="backdrop-blur-xl bg-white/80 border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center mono-shadow-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-black">SąskaitaLT</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/prisijungti">
                <Button variant="ghost" className="text-gray-600 hover:text-black rounded-xl">
                  Prisijungti
                </Button>
              </Link>
              <Link href="/registracija">
                <Button className="bg-black hover:bg-gray-800 text-white mono-shadow-lg rounded-xl">
                  Pradėti nemokamai
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-gray-100 text-black border-gray-200 rounded-full px-4 py-2">
            <Star className="w-3 h-3 mr-1" />
            Patikima 1000+ lietuvių įmonių
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Sąskaitų faktūrų
            <span className="block text-gray-700">ateitis Lietuvoje</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Moderniausia sąskaitų faktūrų platforma lietuvių verslui. Kurkite, siųskite ir valdykite sąskaitas faktūras
            vos keliais paspaudimais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white mono-shadow-xl rounded-xl h-12 px-8">
              Pradėti nemokamai
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-xl h-12 px-8">
              Žiūrėti demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Kodėl pasirinkti SąskaitaLT?</h2>
            <p className="text-lg text-gray-600">Visa, ko reikia jūsų verslui sąskaitų faktūrų valdymui</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/60 backdrop-blur-xl border-gray-200 mono-shadow-xl hover:mono-shadow-2xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 mono-shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Greitas sukūrimas</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sukurkite profesionalias sąskaitas faktūras per kelias minutes su mūsų intuityviu redaktoriumi.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-xl border-gray-200 mono-shadow-xl hover:mono-shadow-2xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 mono-shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Klientų valdymas</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tvarkykite klientų duomenis, stebėkite mokėjimus ir valdykite santykius vienoje vietoje.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-xl border-gray-200 mono-shadow-xl hover:mono-shadow-2xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 mono-shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Automatizacija</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automatiškai siųskite priminimus, generuokite ataskaitas ir sinchronizuokite su buhalterija.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Pasirinkite savo planą</h2>
            <p className="text-lg text-gray-600">Pradėkite nemokamai ir plėskitės kartu su savo verslu</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-200 mono-shadow-lg hover:mono-shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold text-black mb-2">Nemokamas</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-black">€0</span>
                  <span className="text-gray-600">/mėn.</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">*Nurodyta kaina be PVM</p>

                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                    Iki 20 sąskaitų per mėnesį
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />1 vartotojas
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                    Pagrindinės funkcijos
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                    El. pašto palaikymas
                  </li>
                </ul>

                <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-xl mono-shadow-lg">
                  Pradėti nemokamai
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Plan */}
            <Card className="bg-white/80 backdrop-blur-xl border-black mono-shadow-lg hover:mono-shadow-xl transition-all duration-300 rounded-2xl ring-2 ring-black/20 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white rounded-full px-4 py-1">
                Populiariausias
              </Badge>
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold text-black mb-2">Mėnesinis</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-black">€6.99</span>
                  <span className="text-gray-600">/mėn.</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">*Nurodyta kaina be PVM</p>

                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                    Neribotai sąskaitų
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                    WooCommerce integracija
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                    ISAF eksportas
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                    El. pašto sekimas
                  </li>
                </ul>

                <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-xl mono-shadow-lg">
                  Pasirinkti planą
                </Button>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-200 mono-shadow-lg hover:mono-shadow-xl transition-all duration-300 rounded-2xl relative">
              <Badge className="absolute -top-3 right-4 bg-gray-800 text-white rounded-full px-3 py-1">
                17% nuolaida
              </Badge>
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold text-black mb-2">Metinis</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-black">€69.99</span>
                  <span className="text-gray-600">/metams</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">*Nurodyta kaina be PVM</p>

                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                    Visos mėnesinio plano funkcijos
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                    17% nuolaida
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                    Prioritetinis palaikymas
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                    Ankstyvasis priėjimas
                  </li>
                </ul>

                <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-xl mono-shadow-lg">
                  Pasirinkti planą
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-100 to-gray-200/50 backdrop-blur-xl border-gray-300 mono-shadow-2xl rounded-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-black mb-4">Pradėkite šiandien</h2>
              <p className="text-lg text-gray-600 mb-8">
                Prisijunkite per 30 sekundžių ir sukurkite pirmą sąskaitą faktūrą nemokamai
              </p>
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white mono-shadow-xl rounded-xl h-12 px-8">
                Registruotis su Google
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mono-shadow-lg">
                <FileText className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold">SąskaitaLT</span>
            </div>
            <div className="text-gray-400">© 2024 SąskaitaLT. Visos teisės saugomos.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
