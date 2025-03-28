import FormLogin from "@/components/auth/form-login";
import { Suspense } from "react";
import Loading from "@/components/loading";

const Login =  () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Sign in to your account</h1>
      <Suspense fallback={<Loading />}>
      <FormLogin/>
      </Suspense>
    </div>
  )
}

export default Login;