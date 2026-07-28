"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { AddressForm } from "@/components/account/address-form";
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from "@/lib/api/mutations/addresses";
import type { AddressInput } from "@/lib/validation";
import type { CustomerAddress } from "@/lib/types";

export default function AddressesPage() {
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerAddress | null>(null);

  function handleSubmit(input: AddressInput) {
    const onSuccess = () => {
      toast({ title: editing ? "Address updated" : "Address added", variant: "success" });
      setModalOpen(false);
      setEditing(null);
    };
    const onError = (error: Error) => toast({ title: "Something went wrong", description: error.message, variant: "error" });

    if (editing) {
      updateAddress.mutate({ id: editing.id, input }, { onSuccess, onError });
    } else {
      createAddress.mutate(input, { onSuccess, onError });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">My Addresses</h1>
          <p className="text-sm text-ink-soft">Manage your saved delivery addresses.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          size="sm"
        >
          <Plus className="size-4" /> Add Address
        </Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : !addresses || addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No addresses saved" description="Add an address to speed up checkout." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className="flex flex-col gap-2 p-5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">{address.label || "Address"}</span>
                {address.is_default && (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    <Star className="size-3.5 fill-primary" /> Default
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-soft">{address.full_name}</p>
              <p className="text-sm text-ink-soft">
                {address.address_line1}
                {address.address_line2 ? `, ${address.address_line2}` : ""}, {address.city}, {address.state}{" "}
                {address.postal_code}
              </p>
              <p className="text-sm text-ink-soft">{address.phone}</p>

              <div className="mt-2 flex items-center gap-4 text-sm">
                <button
                  onClick={() => {
                    setEditing(address);
                    setModalOpen(true);
                  }}
                  className="flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  <Pencil className="size-3.5" /> Edit
                </button>
                {!address.is_default && (
                  <button
                    onClick={() => setDefaultAddress.mutate(address.id)}
                    className="font-medium text-ink-soft hover:text-ink"
                  >
                    Set as default
                  </button>
                )}
                <button
                  onClick={() => deleteAddress.mutate(address.id)}
                  className="ml-auto flex items-center gap-1 font-medium text-danger hover:underline"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Address" : "Add Address"}
      >
        <AddressForm
          key={editing?.id ?? "new"}
          initialValue={editing ?? undefined}
          isSubmitting={createAddress.isPending || updateAddress.isPending}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
