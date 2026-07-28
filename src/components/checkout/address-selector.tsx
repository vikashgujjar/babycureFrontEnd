"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { AddressForm } from "@/components/account/address-form";
import { useAddresses, useCreateAddress } from "@/lib/api/mutations/addresses";
import { useToast } from "@/components/ui/toast";
import type { AddressInput } from "@/lib/validation";
import { cn } from "@/lib/utils/cn";

export function AddressSelector({
  selectedId,
  onSelect,
}: {
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  function handleCreate(input: AddressInput) {
    createAddress.mutate(input, {
      onSuccess: (address) => {
        toast({ title: "Address saved", variant: "success" });
        onSelect(address.id);
        setShowForm(false);
      },
      onError: (error) => toast({ title: "Couldn't save address", description: error.message, variant: "error" }),
    });
  }

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-3">
      {addresses?.map((address) => (
        <label key={address.id} className={cn("block cursor-pointer")}>
          <Card
            className={cn(
              "flex items-start gap-3 p-4 transition-colors",
              selectedId === address.id ? "border-primary bg-primary-light/40" : "hover:border-primary/40",
            )}
          >
            <input
              type="radio"
              name="checkout_address"
              checked={selectedId === address.id}
              onChange={() => onSelect(address.id)}
              className="mt-1 size-4 accent-primary"
            />
            <div className="text-sm">
              <p className="font-medium text-ink">{address.label || "Address"}</p>
              <p className="text-ink-soft">{address.full_name}</p>
              <p className="text-ink-soft">
                {address.address_line1}
                {address.address_line2 ? `, ${address.address_line2}` : ""}, {address.city}, {address.state}{" "}
                {address.postal_code}
              </p>
              <p className="text-ink-soft">{address.phone}</p>
            </div>
          </Card>
        </label>
      ))}

      {showForm ? (
        <Card className="p-5">
          <AddressForm isSubmitting={createAddress.isPending} onSubmit={handleCreate} />
        </Card>
      ) : (
        <Button variant="outline" size="sm" className="w-fit" onClick={() => setShowForm(true)}>
          <Plus className="size-4" /> Add New Address
        </Button>
      )}
    </div>
  );
}
