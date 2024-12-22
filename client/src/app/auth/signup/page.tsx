/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRegisterMutation } from "@/lib/feature/auth/authThunk";
import 'react-toastify/dist/ReactToastify.css';

interface RegisterError {
  status?: number;
  data?: {
    message?: string;
  };
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }

    try {
      await register({firstName , lastName, email, password }).unwrap();
      toast.success("Registration successful!");
      router.push("/");
    } catch (error) {
      const err = error as RegisterError;
      if (err?.status === 400) {
        toast.error(err.data?.message || "Registration failed.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary p-8 text-white flex flex-col">
      <ToastContainer />
      {/* Header */}
      <div className="mx-auto mb-16 max-w-3xl items-center justify-center text-center">
        <h1 className="text-[68px] font-medium">Create account</h1>
        <div className="-mt-2 text-sm text-white">
          <Link href="/" className="hover:text-green-500">
            HOME
          </Link>
          <span className="mx-2">/</span>
          <span>REGISTER</span>
        </div>
      </div>

      {/* Register Container */}
      <div className="mx-auto w-full max-w-xl space-y-6">
        {/* Register Form */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
          <h2 className="mb-6 text-2xl font-bold text-center">REGISTER</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block">
                  First Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded border border-gray-700 bg-transparent p-2 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block">
                  Last Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded border border-gray-700 bg-transparent p-2 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block">
                Email address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-gray-700 bg-transparent p-2 focus:border-green-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block">
                Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border border-gray-700 bg-transparent p-2 focus:border-green-500 focus:outline-none"
                  required
                />
                {passwordVisible ? (
                  <EyeOff
                    onClick={() => setPasswordVisible(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-green-500"
                    size={20}
                  />
                ) : (
                  <Eye
                    onClick={() => setPasswordVisible(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-green-500"
                    size={20}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block">
                Confirm Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded border border-gray-700 bg-transparent p-2 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                className="rounded border-gray-700 bg-transparent text-green-500 focus:ring-green-500"
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-green-500 hover:underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-green-500 py-3 text-white transition-colors hover:bg-green-600 disabled:opacity-50"
              disabled={isLoading || !agreedToTerms}
            >
              {isLoading ? "Registering..." : "REGISTER"}
            </button>
          </form>
        </div>

        {/* Have an Account Section */}
        <div className="text-center bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
          <p className="text-gray-300 mb-4">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-green-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}