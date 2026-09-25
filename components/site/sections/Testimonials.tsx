"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const GOOGLE_RATING = "5.0";
const GOOGLE_REVIEW_COUNT = "4";

const AUTOPLAY_MS = 4000;

function GoogleLogo() {
  return (
    <span className="text-2xl font-bold">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div>
      <div className="relative z-10 mx-auto h-16 w-16 overflow-hidden rounded-md border-2 border-gold-500 bg-navy-100 shadow-md sm:h-24 sm:w-24 lg:h-32 lg:w-32">
        {testimonial.photoUrl ? (
          <Image
            src={testimonial.photoUrl}
            alt={testimonial.clientName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-navy-400">
            {testimonial.clientName.charAt(0)}
          </div>
        )}
      </div>

      <div className="relative -mt-8 sm:-mt-12 lg:-mt-16">
        <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl border-2 border-gold-500" />
        <div className="relative rounded-xl bg-white px-4 pt-12 pb-6 text-center shadow-lg sm:px-6 sm:pt-16 sm:pb-8 lg:pt-20">
          <Quote className="mx-auto h-6 w-6 text-gold-500" />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {testimonial.content}
          </p>
          <p className="mt-4 text-sm font-semibold text-navy-950">{testimonial.clientName}</p>
          {(testimonial.designation || testimonial.company) && (
            <p className="text-xs font-medium text-gold-600">
              {[testimonial.designation, testimonial.company].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const autoplay = useRef(Autoplay({ delay: AUTOPLAY_MS, stopOnInteraction: false }));

  if (testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 before:absolute before:inset-0 before:z-0 before:bg-[url('/background_reviewImg.png')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-10 before:content-['']">
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center ">
          <GoogleLogo />
          <p className="mt-2 text-sm text-navy-200">
            Rated <span className="font-semibold text-white">{GOOGLE_RATING}</span> out of 5 by{" "}
            <span className="font-semibold text-white">{GOOGLE_REVIEW_COUNT}</span> Happy
            Customers on Google!
          </p>
          <div className="mt-2 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Hear From Our Clients How</h2>
          <p className="mt-1 text-3xl font-bold text-gold-500 sm:text-4xl">
            We Solved Their Biggest Problems
          </p>
        </div>

        <Carousel
          opts={{ loop: true, align: "start" }}
          plugins={[autoplay.current]}
          className="mt-14"
        >
          <CarouselContent className="-ml-6 mr-6 py-2 sm:-ml-10 lg:-ml-14">
            {testimonials.map((t) => (
              <CarouselItem
                key={t.id}
                className="basis-full pl-6 sm:basis-1/2 sm:pl-10 lg:pl-14"
              >
                <TestimonialCard testimonial={t} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {testimonials.length > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <CarouselPrevious className="static size-9 translate-y-0 border-gold-500/40 bg-navy-900 text-gold-400 hover:bg-navy-800 hover:text-gold-300" />
              <CarouselNext className="static size-9 translate-y-0 border-gold-500/40 bg-navy-900 text-gold-400 hover:bg-navy-800 hover:text-gold-300" />
            </div>
          )}
        </Carousel>

        <div className="mt-14 text-center">
          <Button asChild size="lg" className="bg-gold-500 text-navy-950 hover:bg-gold-400">
            <Link href="/contact">View More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
