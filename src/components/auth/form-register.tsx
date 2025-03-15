"use client";

import Link from "next/link";
import { signUpCredentials } from "@/lib/action";
import { useActionState } from "react";

const intialState: any = {
  error: "",
  data: {
    name: "",
    email: "",
  },
};
const FormRegisterComp = () => {
  const [state, formAction, isPending] = useActionState(signUpCredentials, intialState);
  console.log("🚀 ~ FormRegisterComp ~ state:", state)
  return (
    <form action={formAction} className="space-y-6">
      {state.message ? (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100"
          role="alert"
        >
          <span className="font-medium">{state?.message}</span>
        </div>
      ) : null}
      <div>
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          defaultValue={state?.data?.name}
          placeholder="Username"
          className="bg-gray-50 border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
        />
        <div aria-live="polite" aria-atomic="true">
          <span className="text-sm text-red-500 mt-2">
            {state?.error?.name}
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="username@yourmail.com"
          defaultValue={state?.data.email}
          className="bg-gray-50 border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
        />
        <div aria-live="polite" aria-atomic="true">
          <span className="text-sm text-red-500 mt-2">
            {state?.error?.email}
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          className="bg-gray-50 border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
        />
        <div aria-live="polite" aria-atomic="true">
          <span className="text-sm text-red-500 mt-2">
            {state?.error?.password}
          </span>
        </div>
      </div>

      <button className="w-full text-white bg-blue-700  hover:bg-blue-800 font-medium rounded-lg px-5 py-3 text-center uppercase">
        {isPending ?  "Register..." : "Register" }
      </button>
      <p className="text-sm font-light text-gray-500">
        Already Have An Account?
        <Link href="/login">
          <span className="font-medium pl-1 text-blue-400">Sign In</span>
        </Link>
      </p>
    </form>
  );
};

export default FormRegisterComp;
