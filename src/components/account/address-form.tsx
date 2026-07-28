"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { addressSchema, type AddressInput } from "@/lib/validation";
import type { CustomerAddress } from "@/lib/types";

export function AddressForm({
  initialValue,
  isSubmitting,
  onSubmit,
}: {
  initialValue?: CustomerAddress;
  isSubmitting: boolean;
  onSubmit: (input: AddressInput) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValue
      ? {
          label: initialValue.label ?? "",
          full_name: initialValue.full_name,
          phone: initialValue.phone,
          address_line1: initialValue.address_line1,
          address_line2: initialValue.address_line2 ?? "",
          city: initialValue.city,
          state: initialValue.state,
          postal_code: initialValue.postal_code,
          country: initialValue.country ?? "IN",
          is_default: initialValue.is_default,
        }
      : { country: "IN" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Label (e.g. Home, Office)" {...register("label")} error={errors.label?.message} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full Name" {...register("full_name")} error={errors.full_name?.message} />
        <Input label="Phone" {...register("phone")} error={errors.phone?.message} />
      </div>
      <Input label="Address Line 1" {...register("address_line1")} error={errors.address_line1?.message} />
      <Input label="Address Line 2 (optional)" {...register("address_line2")} error={errors.address_line2?.message} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="City" {...register("city")} error={errors.city?.message} />
        <Input label="State" {...register("state")} error={errors.state?.message} />
        <Input label="Postal Code" {...register("postal_code")} error={errors.postal_code?.message} />
      </div>
      <Checkbox label="Set as default address" {...register("is_default")} />
      <Button type="submit" isLoading={isSubmitting} className="w-fit">
        Save Address
      </Button>
    </form>
  );
}
