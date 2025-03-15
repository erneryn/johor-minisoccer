import FormLogin from "@/components/auth/form-login";

const Login =  () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Sign in to your account</h1>
      <FormLogin/>
    </div>
  )
}

export default Login;