"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSubmitContact } from "@/lib/api/mutations/contact";
import { contactSchema, type ContactInput } from "@/lib/validation";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const submitContact = useSubmitContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line p-10 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h3 className="font-display text-xl text-ink">Message Sent</h3>
        <p className="text-sm text-ink-soft">Thanks for reaching out — our team will get back to you shortly.</p>
        <Button variant="outline" size="sm" onClick={() => setSent(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((input) =>
        submitContact.mutate(input, {
          onSuccess: () => {
            setSent(true);
            reset();
          },
        }),
      )}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full Name" {...register("name")} error={errors.name?.message} />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Phone (optional)" type="tel" {...register("phone")} error={errors.phone?.message} />
        <Input label="Subject (optional)" {...register("subject")} error={errors.subject?.message} />
      </div>
      <Textarea label="Message" rows={6} {...register("message")} error={errors.message?.message} />
      <Button type="submit" isLoading={submitContact.isPending} className="w-fit">
        Send Message
      </Button>
    </form>
  );
}
