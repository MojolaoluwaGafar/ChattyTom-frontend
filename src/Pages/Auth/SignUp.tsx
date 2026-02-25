import React, { useState } from 'react'
import AuthLayout from '../../Layout/AuthLayout'
import {Link, useNavigate} from "react-router"
import {toast} from "react-toastify"
import { useAuth } from "../../hooks/useAuth"

interface SignUpFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}
type ErrorFields = {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
};


export default function SignUp() {
  const [ formData, setFormData ] = useState<SignUpFormData>({
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
  })
  const [ errors, setErrors ] = useState<ErrorFields>({});
  const [ submitError, setSubmitError ] = useState<string>("")
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const { signUp } = useAuth()
  const Navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const { name , value } = e.target
    setFormData(prev => ({...prev, [name]: value }))
  }

  const validForm = ()=>{
    const newErrors: ErrorFields = {}
    const emailRegex =  /^\S+@\S+\.\S+$/
    const {email, firstName, lastName, password, confirmPassword} = formData

    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validForm()) return;
  setIsLoading(true)
  setErrors({})
  setSubmitError("")
  try {
    const response = await signUp({
      email : formData.email,
      firstName : formData.firstName,
      lastName : formData.lastName,
      password : formData.password
    })
  toast.success("signup successful!")
  console.log("Form submitted:", response);
  Navigate("/login")
  } catch (error : any) {
    setSubmitError(error.message || "Signup failed. Please try again.")
    toast.error(error.message || "signup failed")
  }finally{
    setIsLoading(false)
  }
  };

  return (
        <AuthLayout title="Sign Up">
          {submitError && <p className="text-red-500 text-sm text-center">{submitError}</p>}
          <form onSubmit={handleSubmit} className="w-[85%]">
            <label className="font-semibold" htmlFor="Email">Email</label>
            <input name='email' value={formData.email} onChange={handleChange} className='block my-1 w-full border-[1.5px] border-gray-300 px-2 py-1 rounded-md' placeholder='Email' type="email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <div className='flex flex-col justify-between md:flex-row w-full md:gap-5 md:py-1'>
                <div className='w-full md:w-1/2'>
                     <label className="font-semibold" htmlFor="firstName">First Name</label>
                     <input name='firstName' value={formData.firstName} onChange={handleChange} className='block my-1 w-full border-[1.5px] border-gray-300 px-2 py-1 rounded-md' placeholder='John' type="text" />
                     {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                <div className='w-full md:w-1/2'>
                     <label className="font-semibold" htmlFor="lastName">Last Name</label>
                     <input name='lastName' value={formData.lastName} onChange={handleChange} className='block my-1 w-full border-[1.5px] border-gray-300 px-2 py-1 rounded-md' placeholder='Doe' type="text" />
                     {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
            </div>
             
            <div className='flex flex-col justify-between md:flex-row w-full md:gap-5'>
                <div className='w-full md:w-1/2'>
                    <label className="font-semibold" htmlFor="Passwword">Password</label>
                    <input name='password' value={formData.password} onChange={handleChange} className='block my-1 w-full border-[1.5px] border-gray-300 px-2 py-1 rounded-md' placeholder='Password' type="password" />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div className='w-full md:w-1/2'>
                    <label className="font-semibold" htmlFor="Passwword">Confirm  Password</label>
                    <input name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} className='block my-1 w-full border-[1.5px] border-gray-300 px-2 py-1 rounded-md' placeholder='Confirm Password' type="password" />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
            </div>
    
            <button disabled={isLoading} type='submit' className="w-full h-10 my-2 bg-[#4e6fe0] hover:bg-[#2b4dbc] rounded-md text-white">{isLoading ? "Signing up" : "Sign up"}</button>
            <p className='text-center text-sm md:text-lg pb-3'>Already have an account? <Link to="/login"><span className='text-[#4e6fe0] font-semibold'>Sign in</span></Link></p>
          </form>
        </AuthLayout>
  )
}