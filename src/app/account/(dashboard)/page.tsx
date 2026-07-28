"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/toast";
import { useChangePassword, useCurrentCustomer, useUpdateProfile } from "@/lib/api/mutations/auth";
import { changePasswordSchema, updateProfileSchema, type ChangePasswordInput, type UpdateProfileInput } from "@/lib/validation";

function ProfileForm() {
  const { data: customer } = useCurrentCustomer();
  const { toast } = useToast();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileInput>({ resolver: zodResolver(updateProfileSchema) });

  useEffect(() => {
    if (customer) reset({ name: customer.name, phone: customer.phone ?? "" });
  }, [customer, reset]);

  return (
    <form
      onSubmit={handleSubmit((input) =>
        updateProfile.mutate(input, {
          onSuccess: () => toast({ title: "Profile updated", variant: "success" }),
          onError: (error) => toast({ title: "Update failed", description: error.message, variant: "error" }),
        }),
      )}
      className="flex flex-col gap-4"
    >
      <Input label="Full Name" {...register("name")} error={errors.name?.message} />
      <Input label="Email" value={customer?.email ?? ""} disabled />
      <Input label="Phone" {...register("phone")} error={errors.phone?.message} />
      <Button type="submit" isLoading={updateProfile.isPending} className="w-fit">
        Save Changes
      </Button>
    </form>
  );
}

function ChangePasswordForm() {
  const { toast } = useToast();
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  return (
    <form
      onSubmit={handleSubmit((input) =>
        changePassword.mutate(input, {
          onSuccess: () => {
            toast({ title: "Password changed", variant: "success" });
            reset();
          },
          onError: (error) => toast({ title: "Couldn't change password", description: error.message, variant: "error" }),
        }),
      )}
      className="flex flex-col gap-4"
    >
      <Input label="Current Password" type="password" {...register("current_password")} error={errors.current_password?.message} />
      <Input label="New Password" type="password" {...register("password")} error={errors.password?.message} />
      <Input
        label="Confirm New Password"
        type="password"
        {...register("password_confirmation")}
        error={errors.password_confirmation?.message}
      />
      <Button type="submit" isLoading={changePassword.isPending} className="w-fit">
        Update Password
      </Button>
    </form>
  );
}

export default function ProfilePage() {
  const { data: customer, isLoading } = useCurrentCustomer();

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-ink">My Profile</h1>
        <p className="text-sm text-ink-soft">Manage your account details and password.</p>
      </div>

      {customer && (
        <>
          <Card className="p-6">
            <h2 className="mb-4 font-display text-lg text-ink">Personal Information</h2>
            <ProfileForm />
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-display text-lg text-ink">Change Password</h2>
            <ChangePasswordForm />
          </Card>
        </>
      )}
    </div>
  );
}
