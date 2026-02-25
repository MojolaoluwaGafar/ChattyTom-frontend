import React, { useState } from "react";
import AuthLayout from "../../Layout/AuthLayout";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

interface LoginFormData {
  email: string;
  password: string;
}

type ErrorFields = {
  email?: string;
  password?: string;
};

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ErrorFields>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validForm = () => {
    const newErrors: ErrorFields = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validForm()) return;

    setIsLoading(true);
    setErrors({});
    setSubmitError("");

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Login successful!");
      console.log("Login response:", response);
      navigate("/chat");
    } catch (error: any) {
      setSubmitError(error.message || "Login failed. Please try again.");
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In">
      {submitError && (
        <p className="text-red-500 text-sm text-center">{submitError}</p>
      )}
      <form onSubmit={handleSubmit} className="w-[85%]">
        <label className="font-semibold" htmlFor="Email">Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="block my-1 w-full border-[1.5px] border-gray-300 px-2 py-1 rounded-md"
          placeholder="Email"
          type="email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <label className="font-semibold" htmlFor="Password">Password</label>
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="block my-1 w-full border-[1.5px] border-gray-300 px-2 py-1 rounded-md"
          placeholder="Password"
          type="password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <button
          disabled={isLoading}
          type="submit"
          className="w-full h-10 my-2 bg-[#4e6fe0] hover:bg-[#2b4dbc] rounded-md text-white"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <Link to="">
          <h1 className="text-center text-sm md:text-lg">Forgot Password?</h1>
        </Link>
        <p className="text-center text-sm md:text-lg pb-3">
          Don’t have an account?
          <Link to="/signUp">
            <span className="text-[#4e6fe0] font-semibold">Sign up</span>
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}