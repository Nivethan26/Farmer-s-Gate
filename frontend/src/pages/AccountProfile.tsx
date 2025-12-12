"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import type { RootState } from "@/store"
import { updateProfile } from "@/store/authSlice"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award as IdCard,
  Edit2,
  Save,
  X,
  Lock,
  ArrowLeft,
  Award,
  Shield,
} from "lucide-react"
import { toast } from "sonner"

// Profile schema - only editable fields for buyers
const profileSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  address: z.string().optional(),
  district: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const sriLankaDistricts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Mullaitivu",
  "Vavuniya",
  "Puttalam",
  "Kurunegala",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
]

const AccountProfile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state: RootState) => state.auth.user)
  const [isEditing, setIsEditing] = useState(false)

  // Split name into first and last name if available, otherwise use name
  const getFirstName = () => {
    if (user?.firstName) return user.firstName
    if (user?.name) {
      const parts = user.name.split(" ")
      return parts[0] || user.name
    }
    return ""
  }

  const getLastName = () => {
    if (user?.lastName) return user.lastName
    if (user?.name) {
      const parts = user.name.split(" ")
      return parts.slice(1).join(" ") || ""
    }
    return ""
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      district: user?.district || "",
    },
  })

  if (!user) {
    navigate("/login")
    return null
  }

  const onSubmit = (data: ProfileFormData) => {
    const updates: any = {
      email: data.email,
      phone: data.phone,
      address: data.address,
      district: data.district,
    }

    // For sellers, include additional fields
    if (user.role === "seller") {
      // Seller-specific updates can be added here
    }

    dispatch(updateProfile(updates))
    toast.success("Profile updated successfully!")
    setIsEditing(false)
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  // For buyers, only these fields are editable
  const isBuyer = user.role === "buyer"
  const editableFields = isBuyer ? ["email", "phone", "address", "district"] : []
  const selectedDistrict = watch("district") || ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-green-50/50">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 sm:mb-6 hover:bg-green-50 hover:text-green-700 transition-all duration-200 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl">
              Manage your account information and preferences
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          {/* Main Profile Card - Centered */}
          <div className="w-full max-w-4xl">
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-6 space-y-4 bg-gradient-to-br from-green-50/50 to-emerald-50/30 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></div>
                        Personal Information
                      </CardTitle>
                      <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                        {user.role === "buyer" ? "Buyer Account" : "Seller Account"}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">
                      {isBuyer
                        ? "You can update your email, phone, address, and district"
                        : "Update your personal details"}
                    </CardDescription>
                  </div>

                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-2 border-green-300 hover:bg-green-50 hover:border-green-400 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                  {/* Name Fields Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* First Name - Read Only */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-semibold flex items-center gap-2 text-gray-700"
                      >
                        <User className="h-4 w-4 text-green-600" />
                        First Name
                      </Label>
                      <div className="relative group">
                        <Input
                          id="firstName"
                          value={getFirstName()}
                          disabled
                          className="bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors"
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        This field cannot be changed
                      </p>
                    </div>

                    {/* Last Name - Read Only */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                        <User className="h-4 w-4 text-green-600" />
                        Last Name
                      </Label>
                      <div className="relative group">
                        <Input
                          id="lastName"
                          value={getLastName()}
                          disabled
                          className="bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors"
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        This field cannot be changed
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100"></div>

                  {/* Email - Editable for Buyers */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4 text-green-600" />
                      Email Address
                      {isBuyer && <span className="text-green-600 text-base">*</span>}
                      {isBuyer && isEditing && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Editable
                        </Badge>
                      )}
                    </Label>
                    {isEditing && editableFields.includes("email") ? (
                      <div className="space-y-2">
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          className="border-2 border-green-200 focus:border-green-400 focus:ring-green-400/20 transition-all"
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <span className="text-base">⚠</span>
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="relative group">
                        <Input
                          id="email"
                          value={user.email}
                          disabled
                          className="bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors"
                        />
                        {!isBuyer && (
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    )}
                    {!isBuyer && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Email cannot be changed
                      </p>
                    )}
                  </div>

                  {/* NIC - Read Only */}
                  <div className="space-y-2">
                    <Label htmlFor="nic" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                      <IdCard className="h-4 w-4 text-green-600" />
                      NIC Number
                    </Label>
                    <div className="relative group">
                      <Input
                        id="nic"
                        value={user.nic || "Not provided"}
                        disabled
                        className="bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors font-mono"
                      />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      This field cannot be changed
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100"></div>

                  {/* Phone - Editable for Buyers */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4 text-green-600" />
                      Phone Number
                      {isBuyer && <span className="text-green-600 text-base">*</span>}
                      {isBuyer && isEditing && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Editable
                        </Badge>
                      )}
                    </Label>
                    {isEditing && editableFields.includes("phone") ? (
                      <div className="space-y-2">
                        <Input
                          id="phone"
                          {...register("phone")}
                          className="border-2 border-green-200 focus:border-green-400 focus:ring-green-400/20 transition-all"
                          placeholder="+94771234567"
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <span className="text-base">⚠</span>
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Input
                        id="phone"
                        value={user.phone || "Not provided"}
                        disabled
                        className="bg-gray-50/80 border-gray-200 disabled:opacity-70"
                      />
                    )}
                  </div>

                  {/* Location Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* District - Editable for Buyers */}
                    <div className="space-y-2">
                      <Label htmlFor="district" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-green-600" />
                        District
                        {isBuyer && <span className="text-green-600 text-base">*</span>}
                        {isBuyer && isEditing && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Editable
                          </Badge>
                        )}
                      </Label>
                      <input type="hidden" {...register("district")} />
                      {isEditing && editableFields.includes("district") ? (
                        <Select
                          value={selectedDistrict}
                          onValueChange={(value) => setValue("district", value, { shouldDirty: true })}
                        >
                          <SelectTrigger className="border-2 border-green-200 focus:border-green-400 focus:ring-green-400/20 transition-all">
                            <SelectValue placeholder="Select your district" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {sriLankaDistricts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="district"
                          value={user.district || "Not provided"}
                          disabled
                          className="bg-gray-50/80 border-gray-200 disabled:opacity-70"
                        />
                      )}
                    </div>
                  </div>

                  {/* Address - Editable for Buyers */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-green-600" />
                      Full Address
                      {isBuyer && <span className="text-green-600 text-base">*</span>}
                      {isBuyer && isEditing && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Editable
                        </Badge>
                      )}
                    </Label>
                    {isEditing && editableFields.includes("address") ? (
                      <Textarea
                        id="address"
                        {...register("address")}
                        className="border-2 border-green-200 focus:border-green-400 focus:ring-green-400/20 transition-all min-h-[120px] resize-none"
                        placeholder="Enter your full address"
                      />
                    ) : (
                      <Textarea
                        id="address"
                        value={user.address || "Not provided"}
                        disabled
                        className="bg-gray-50/80 border-gray-200 disabled:opacity-70 min-h-[120px] resize-none"
                      />
                    )}
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 h-11"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 h-11 bg-transparent"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Side Info Card - Takes 1 column on large screens */}
          
        </div>
      </div>
    </div>
  )
}

export default AccountProfile
