import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/account/auth-layout";
import { VerifyOtpForm } from "@/components/account/verify-otp-form";

export const metadata: Metadata = { title: "Enter Verification Code" };

export default function VerifyOtpPage() {
  return (
    <AuthLayout title="Enter Verification Code">
      <Suspense>
        <VerifyOtpForm />
      </Suspense>
    </AuthLayout>
  );
}
