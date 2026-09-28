"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, User, Mail, Phone, Building2, LayoutGrid, MessageSquare, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { enquirySchema, type EnquiryInput } from "@/lib/validations/enquiry";
import { submitEnquiry } from "@/app/(site)/contact/actions";

const fieldClass =
  "h-12 rounded-xl border-border/70 bg-secondary/20 pl-11 focus-visible:bg-background";

function RequiredMark() {
  return <span className="text-destructive">*</span>;
}

export function ContactForm({ services }: { services: { id: string; name: string }[] }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
  });

  const onSubmit = async (values: EnquiryInput) => {
    const result = await submitEnquiry(values);
    if (result.success) {
      toast.success("Thank you — we've received your enquiry and will be in touch shortly.");
      reset();
    } else {
      toast.error(result.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Name <RequiredMark />
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" placeholder="Your full name" className={fieldClass} {...register("name")} />
          </div>
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <RequiredMark />
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={fieldClass}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">
            Phone <RequiredMark />
          </Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              placeholder="+91 98765 43210"
              className={fieldClass}
              {...register("phone")}
            />
          </div>
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Company</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="company"
              placeholder="Your company name"
              className={fieldClass}
              {...register("company")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="serviceNeeded">
          Service Required <RequiredMark />
        </Label>
        <Controller
          control={control}
          name="serviceNeeded"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="serviceNeeded"
                className="h-12 w-full rounded-xl border-border/70 bg-secondary/20 px-3.5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <LayoutGrid className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <SelectValue placeholder="Select a service" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.name}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.serviceNeeded && (
          <p className="text-xs text-destructive">{errors.serviceNeeded.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">
          Message <RequiredMark />
        </Label>
        <div className="relative">
          <MessageSquare className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-muted-foreground" />
          <Textarea
            id="message"
            rows={5}
            placeholder="Tell us about your requirement..."
            className="rounded-xl border-border/70 bg-secondary/20 pl-11 focus-visible:bg-background"
            {...register("message")}
          />
        </div>
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="rounded-full bg-navy-950 px-7 text-white hover:bg-navy-900"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send Enquiry
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
