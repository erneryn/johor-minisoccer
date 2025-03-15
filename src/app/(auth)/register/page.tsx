import FormRegisterComp from "@/components/auth/form-register"

const RegisterForm = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Create An Account</h1>
      <FormRegisterComp/>
    </div>
  )
}

export default RegisterForm