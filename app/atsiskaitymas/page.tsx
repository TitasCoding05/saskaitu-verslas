"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FileText, CreditCard, Shield, Lock, Check, ArrowLeft, Building, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

// Move the plan details logic outside of component to prevent re-creation
const getPlanDetails = (planId: string | null) => {
  switch (planId) {
    case "monthly":
      return { name: "Mėnesinis", price: "6.99", period: "mėn." }
    case "annual":
      return { name: "Metinis", price: "69.99", period: "metams" }
    case "free":
      return { name: "Nemokamas", price: "0", period: "mėn." }
    default:
      return { name: "Mėnesinis", price: "6.99", period: "mėn." }
  }
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [planId, setPlanId] = useState<string | null>(null)
  const [companyData, setCompanyData] = useState<any>(null)

  useEffect(() => {
    const plan = searchParams.get("plan")
    const company = searchParams.get("company")

    // Only update state if values have actually changed
    if (plan !== planId) {
      setPlanId(plan)
    }

    if (company && !companyData) {
      try {
        const parsedCompany = JSON.parse(decodeURIComponent(company))
        setCompanyData(parsedCompany)
      } catch (e) {
        console.error("Error parsing company data:", e)
      }
    }
  }, [searchParams, planId, companyData]) // Add proper dependencies

  const plan = useMemo(() => getPlanDetails(planId), [planId])
  const vatAmount = useMemo(() => (Number.parseFloat(plan.price) * 0.21).toFixed(2), [plan.price])
  const totalAmount = useMemo(
    () => (Number.parseFloat(plan.price) + Number.parseFloat(vatAmount)).toFixed(2),
    [plan.price, vatAmount],
  )

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      // Redirect to success page or dashboard
      window.location.href = "/dashboard"
    }, 3000)
  }

  const isFormValid = () => {
    return (
      paymentData.cardNumber.length >= 16 &&
      paymentData.expiryDate.length >= 5 &&
      paymentData.cvv.length >= 3 &&
      paymentData.cardholderName.length >= 2
    )
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  // If it's a free plan, redirect directly to dashboard
  if (planId === "free") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Sveikiname!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Jūsų nemokama paskyra sėkmingai sukurta. Galite pradėti naudotis SąskaitaLT.
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
            >
              Pradėti naudotis
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center mono-shadow-lg">
              <FileText className="w-6 h-6 text-white dark:text-black" />
            </div>
            <span className="text-2xl font-bold text-black dark:text-white">SąskaitaLT</span>
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Atsiskaitymas</h1>
          <p className="text-gray-600 dark:text-gray-400">Užbaikite registraciją apmokėdami pasirinktą planą</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-black dark:text-white">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Mokėjimo duomenys
                  </CardTitle>
                  <CardDescription>Įveskite savo kortelės duomenis saugiam mokėjimui</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardholder-name" className="text-black dark:text-white font-medium">
                      Kortelės savininkas
                    </Label>
                    <Input
                      id="cardholder-name"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                      placeholder="Jonas Jonaitis"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="card-number" className="text-black dark:text-white font-medium">
                      Kortelės numeris
                    </Label>
                    <Input
                      id="card-number"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry-date" className="text-black dark:text-white font-medium">
                        Galiojimo data
                      </Label>
                      <Input
                        id="expiry-date"
                        value={paymentData.expiryDate}
                        onChange={(e) =>
                          setPaymentData({ ...paymentData, expiryDate: formatExpiryDate(e.target.value) })
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-black dark:text-white font-medium">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, "") })}
                        placeholder="123"
                        maxLength={4}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start space-x-2">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800 dark:text-green-300">
                        <p className="font-medium mb-1">256-bit SSL šifravimas</p>
                        <p>
                          Jūsų mokėjimo duomenys yra apsaugoti aukščiausio lygio šifravimu ir nėra saugomi mūsų
                          serveriuose.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={!isFormValid() || isProcessing}
                className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black h-12 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-black mr-2"></div>
                    Apdorojama...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Apmokėti €{totalAmount}
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/registracija"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  Grįžti į registraciją
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Plan Summary */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white">Užsakymo suvestinė</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-black dark:text-white">{plan.name} planas</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">SąskaitaLT prenumerata</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-black dark:text-white">€{plan.price}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">/{plan.period}</p>
                    </div>
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-800" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Suma be PVM:</span>
                      <span className="text-black dark:text-white">€{plan.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">PVM (21%):</span>
                      <span className="text-black dark:text-white">€{vatAmount}</span>
                    </div>
                    <Separator className="bg-gray-200 dark:bg-gray-800" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-black dark:text-white">Iš viso:</span>
                      <span className="text-black dark:text-white">€{totalAmount}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p>• Prenumerata atsinaujins automatiškai</p>
                    <p>• Galite atšaukti bet kada nustatymuose</p>
                    <p>• Sąskaita faktūra bus išsiųsta el. paštu</p>
                  </div>
                </CardContent>
              </Card>

              {/* Company Info */}
              {companyData && (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-black dark:text-white">
                      <Building className="w-5 h-5 mr-2" />
                      Įmonės duomenys
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Pavadinimas:</p>
                      <p className="font-medium text-black dark:text-white">{companyData.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Kodas:</p>
                      <p className="font-medium text-black dark:text-white">{companyData.code}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="text-black dark:text-white">{companyData.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-black dark:text-white">{companyData.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                      <span className="text-black dark:text-white">{companyData.address}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security Info */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-black dark:text-white">Saugus mokėjimas</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p>• SSL šifravimas</p>
                    <p>• PCI DSS sertifikatas</p>
                    <p>• Opay mokėjimo sistema</p>
                    <p>• Duomenys nesaugomi</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
