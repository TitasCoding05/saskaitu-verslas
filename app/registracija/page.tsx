"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Check, Crown, Building, User, ArrowLeft, ArrowRight, CreditCard, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { registerCompany } from "@/lib/actions/registration"
import { useRouter } from "next/navigation"

interface Plan {
  id: string
  name: string
  price: string
  period: string
  popular?: boolean
  discount?: string
  features: string[]
  limitations?: string[]
}

// Reusable input component with error handling
const FormInput = ({
  id,
  label,
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  errors,
  required = false
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  errors?: string[]
  required?: boolean
}) => (
  <div>
    <Label htmlFor={id} className="text-black dark:text-white font-medium">
      {label} {required && '*'}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1 ${
        errors && errors.length > 0
          ? 'border-red-500 focus:border-red-500'
          : ''
      }`}
    />
    {errors && errors.map((error, index) => (
      <p key={index} className="text-red-500 text-xs mt-1">{error}</p>
    ))}
  </div>
)

export default function RegistrationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyCode: "",
    vatCode: "",
    companyAddress: "",
    companyPhone: "",
    contactPerson: "",
    contactEmail: "",
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  // Helper function to get error messages for a field
  const getErrorMessages = (fieldName: string): string[] => {
    return errors[fieldName] || []
  }

  const plans: Plan[] = [
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

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    
    // Clear specific field errors when user starts typing
    if (errors[id]) {
      const newErrors = { ...errors }
      delete newErrors[id]
      setErrors(newErrors)
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1 && selectedPlan) {
      setCurrentStep(2)
    } else if (currentStep === 2 && isCompanyDataValid()) {
      setCurrentStep(3)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isCompanyDataValid = () => {
    return (
      formData.companyName &&
      formData.companyCode &&
      formData.companyAddress &&
      formData.email &&
      formData.companyPhone &&
      formData.contactPerson &&
      formData.contactEmail
    )
  }

  const canProceedToPayment = () => {
    return acceptedTerms && acceptedPrivacy && isCompanyDataValid()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!canProceedToPayment()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    const formDataToSubmit = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value)
    })
    formDataToSubmit.append('planId', selectedPlan?.id || '')

    try {
      const result = await registerCompany(formDataToSubmit)

      if (result.success) {
        // Redirect based on the server's recommendation
        router.push(result.redirectPath || '/dashboard')
      } else {
        // Handle errors from server
        if (result.errors) {
          // Flatten and set errors
          const flattenedErrors: Record<string, string[]> = {}
          Object.entries(result.errors).forEach(([key, value]) => {
            flattenedErrors[key] = Array.isArray(value) ? value : [value as string]
          })
          setErrors(flattenedErrors)
        } else if (result.message) {
          // If there's a general error message
          setErrors({ 
            general: [result.message] 
          })
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ 
        general: ['Nepavyko užregistruoti vartotojo. Prašome pabandyti vėliau.'] 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              {step < currentStep ? <Check className="w-4 h-4" /> : step}
            </div>
            {step < 3 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  step < currentStep ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-gray-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderPlanSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Pasirinkite planą</h2>
        <p className="text-gray-600 dark:text-gray-400">Pradėkite nemokamai ir plėskitės kartu su savo verslu</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedPlan?.id === plan.id
                ? "ring-2 ring-black dark:ring-white bg-gray-50 dark:bg-gray-800"
                : "hover:shadow-lg bg-white dark:bg-gray-900"
            } ${plan.popular ? "ring-2 ring-black dark:ring-white" : ""}`}
            onClick={() => handlePlanSelect(plan)}
          >
            <CardContent className="p-6 text-center relative">
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

              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-black dark:text-white">€{plan.price}</span>
                <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">*Nurodyta kaina be PVM</p>

              <ul className="space-y-3 mb-6 text-left">
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

              <div className="flex items-center justify-center">
                {selectedPlan?.id === plan.id && <Check className="w-6 h-6 text-black dark:text-white" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderCompanyForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Vartotojo ir įmonės duomenys</h2>
        <p className="text-gray-600 dark:text-gray-400">Įveskite savo ir įmonės informaciją</p>
      </div>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-black dark:text-white">
            <User className="w-5 h-5 mr-2" />
            Vartotojo informacija
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormInput 
              id="name"
              label="Vardas, pavardė"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Jonas Jonaitis"
              errors={getErrorMessages('name')}
              required
            />
            <FormInput 
              id="email"
              label="El. paštas"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="jonas@manoverslas.lt"
              errors={getErrorMessages('email')}
              required
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormInput 
              id="password"
              label="Slaptažodis"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Bent 6 simboliai"
              errors={getErrorMessages('password')}
              required
            />
            <FormInput 
              id="confirmPassword"
              label="Pakartokite slaptažodį"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Pakartokite slaptažodį"
              errors={getErrorMessages('confirmPassword')}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-black dark:text-white">
            <Building className="w-5 h-5 mr-2" />
            Įmonės informacija
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormInput 
              id="companyName"
              label="Įmonės pavadinimas"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="UAB Mano Verslas"
              errors={getErrorMessages('companyName')}
              required
            />
            <FormInput 
              id="companyCode"
              label="Įmonės kodas"
              value={formData.companyCode}
              onChange={handleInputChange}
              placeholder="123456789"
              errors={getErrorMessages('companyCode')}
              required
            />
            <FormInput 
              id="vatCode"
              label="PVM mokėtojo kodas"
              value={formData.vatCode}
              onChange={handleInputChange}
              placeholder="LT123456789"
              errors={getErrorMessages('vatCode')}
            />
            <FormInput 
              id="companyPhone"
              label="Telefonas"
              value={formData.companyPhone}
              onChange={handleInputChange}
              placeholder="+370 600 12345"
              errors={getErrorMessages('companyPhone')}
              required
            />
          </div>
          <div>
            <Label htmlFor="companyAddress" className="text-black dark:text-white font-medium">
              Adresas *
            </Label>
            <Textarea
              id="companyAddress"
              value={formData.companyAddress}
              onChange={handleInputChange}
              placeholder="Vilniaus g. 1, LT-01234 Vilnius"
              className={`bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1 ${
                getErrorMessages('companyAddress').length > 0
                  ? 'border-red-500 focus:border-red-500'
                  : ''
              }`}
            />
            {getErrorMessages('companyAddress').map((error, index) => (
              <p key={index} className="text-red-500 text-xs mt-1">{error}</p>
            ))}
          </div>
          <div>
            <FormInput 
              id="contactPerson"
              label="Kontaktinis asmuo"
              value={formData.contactPerson}
              onChange={handleInputChange}
              placeholder="Jonas Jonaitis"
              errors={getErrorMessages('contactPerson')}
              required
            />
          </div>
          <div>
            <FormInput 
              id="contactEmail"
              label="Kontaktinio asmens el. paštas"
              type="email"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="jonas@manoverslas.lt"
              errors={getErrorMessages('contactEmail')}
              required
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Patvirtinimas</h2>
        <p className="text-gray-600 dark:text-gray-400">Peržiūrėkite savo duomenis ir patvirtinkite registraciją</p>
      </div>

      {/* Selected Plan Summary */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-black dark:text-white">
            <CreditCard className="w-5 h-5 mr-2" />
            Pasirinktas planas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <h3 className="font-semibold text-black dark:text-white">{selectedPlan?.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPlan?.id === "free" ? "Nemokamas planas" : "Mokamas planas"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-black dark:text-white">€{selectedPlan?.price}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">/{selectedPlan?.period}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User and Company Data Summary */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-black dark:text-white">
            <Building className="w-5 h-5 mr-2" />
            Vartotojo ir įmonės duomenys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Vardas:</p>
              <p className="font-medium text-black dark:text-white">{formData.name}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">El. paštas:</p>
              <p className="font-medium text-black dark:text-white">{formData.email}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Įmonės pavadinimas:</p>
              <p className="font-medium text-black dark:text-white">{formData.companyName}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Įmonės kodas:</p>
              <p className="font-medium text-black dark:text-white">{formData.companyCode}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Telefonas:</p>
              <p className="font-medium text-black dark:text-white">{formData.companyPhone}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-gray-600 dark:text-gray-400">Adresas:</p>
              <p className="font-medium text-black dark:text-white">{formData.companyAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              className="mt-1"
            />
            <div className="text-sm">
              <Label htmlFor="terms" className="text-black dark:text-white font-medium cursor-pointer">
                Sutinku su{" "}
                <Link href="/naudojimo-salygos" className="text-blue-600 hover:underline">
                  naudojimo sąlygomis
                </Link>
              </Label>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={acceptedPrivacy}
              onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
              className="mt-1"
            />
            <div className="text-sm">
              <Label htmlFor="privacy" className="text-black dark:text-white font-medium cursor-pointer">
                Sutinku su{" "}
                <Link href="/privatumo-politika" className="text-blue-600 hover:underline">
                  privatumo politika
                </Link>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedPlan?.id !== "free" && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">Saugus mokėjimas</p>
              <p>
                Mokėjimas bus apdorotas per saugų Opay mokėjimo tinklą. Jūsų kortelės duomenys nėra saugomi mūsų
                serveriuose.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center mono-shadow-lg">
              <FileText className="w-6 h-6 text-white dark:text-black" />
            </div>
            <span className="text-2xl font-bold text-black dark:text-white">SąskaitaLT</span>
          </Link>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* General error display */}
          {errors.general && (
            <div className="bg-red-50 border border-red-500 text-red-800 px-4 py-3 rounded relative mb-4" role="alert">
              {errors.general.map((error, index) => (
                <p key={index} className="text-sm">{error}</p>
              ))}
            </div>
          )}

          {currentStep === 1 && renderPlanSelection()}
          {currentStep === 2 && renderCompanyForm()}
          {currentStep === 3 && renderConfirmation()}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <div>
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={handlePrevStep} className="border-gray-200 dark:border-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Atgal
                </Button>
              ) : (
                <Link href="/prisijungti">
                  <Button type="button" variant="outline" className="border-gray-200 dark:border-gray-800">
                    Jau turite paskyrą?
                  </Button>
                </Link>
              )}
            </div>

            <div>
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={currentStep === 1 ? !selectedPlan : !isCompanyDataValid()}
                  className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                >
                  Toliau
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!canProceedToPayment() || isLoading}
                  className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                >
                  {isLoading ? (
                    "Registruojama..."
                  ) : selectedPlan?.id === "free" ? (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Pradėti nemokamai
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pereiti prie mokėjimo
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
            ← Grįžti į pagrindinį puslapį
          </Link>
        </div>
      </div>
    </form>
  )
}
