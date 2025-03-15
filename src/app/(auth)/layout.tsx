const AuthLayout = ({children}: { children: React.ReactNode}) => {
  return (
    <div className="bg-gray-50">
       <div className="flex flex-col justify-center items-center px-6 py-8 mx-auto h-screen">
        <div className="w-full bg-white rounded-lg shadow mt-0 max-w-md">
          {children}
        </div>
       </div>
    </div>
  )
}

export default AuthLayout