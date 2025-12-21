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
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { ProfileHeaderSection } from "./profile/ProfileHeaderSection"
import { ProfileCardHeaderSection } from "./profile/ProfileCardHeaderSection"
import { ProfileFormFieldsSection } from "./profile/ProfileFormFieldsSection"
import { ProfileActionButtonsSection } from "./profile/ProfileActionButtonsSection"

// Profile schema - editable fields for buyers (include first/last name and NIC)
const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  nic: z.string().optional(),
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
      firstName: getFirstName(),
      lastName: getLastName(),
      email: user?.email || '',
      phone: user?.phone || '',
      nic: user?.nic || '',
      address: user?.address || '',
      district: user?.district || '',
    },
  })

  if (!user) {
    navigate("/login")
    return null
  }

  const onSubmit = (data: ProfileFormData) => {
    const updates: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      nic: data.nic,
      address: data.address,
      district: data.district,
    }

    // For sellers, include additional fields
    if (user.role === "seller") {
      // Seller-specific updates can be added here
    }

    dispatch(updateProfile(updates))
    toast.success(t('profile.updateSuccess'))
    setIsEditing(false)
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  // For buyers, allow editing of first/last name, phone, address, district and nic. Keep email read-only.
  const isBuyer = user.role === 'buyer'
  const editableFields = isBuyer
    ? ['firstName', 'lastName', 'phone', 'address', 'district', 'nic']
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-green-50/50">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Header Section */}
        <ProfileHeaderSection />

        {/* Main Content */}
        <div className="flex justify-center">
          {/* Main Profile Card - Centered */}
          <div className="w-full max-w-4xl">
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
              <ProfileCardHeaderSection
                user={user}
                isBuyer={isBuyer}
                isEditing={isEditing}
                onEditClick={() => setIsEditing(true)}
              />

              <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <ProfileFormFieldsSection
                    user={user}
                    isBuyer={isBuyer}
                    isEditing={isEditing}
                    editableFields={editableFields}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    getFirstName={getFirstName}
                    getLastName={getLastName}
                    sriLankaDistricts={sriLankaDistricts}
                  />

                  <ProfileActionButtonsSection
                    isEditing={isEditing}
                    onCancel={handleCancel}
                  />
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountProfile