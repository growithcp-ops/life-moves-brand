import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, MessageCircle, Phone, Instagram, CheckCircle2 } from "lucide-react";

import consultationImg from "@/assets/velira-consultation.webp";
import { Nav, Footer } from "@/components/velira/layout";
import { ApplicationModal } from "@/components/life-moves/application";
import { useInquiryModal } from "@/hooks/use-inquiry-modal";
import { Reveal, MagneticButton, ClipReveal } from "@/components/life-moves/primitives";
import {
  buildInquiryEmailLinks,
  INQUIRY_RECIPIENT_EMAIL,
  openInquiryComposer,
} from "@/lib/inquiry-email";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Inquiry — Velira Health & Wellness" },
      {
        name: "description",
        content:
          "Connect with the Velira Health & Wellness team for personalised yoga, diet therapy, reset programs, and personal consultations.",
      },
    ],
  }),
  component: ContactPage,
});

const servicesList = [
  "Personalised Yoga",
  "Diet Therapy",
  "Reset Programs",
  "Personal Consultation",
];

function ContactPage() {
  const [modalOpen, setModalOpen] = useInquiryModal();
  const [selectedService, setSelectedService] = useState("Personal Consultation");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailLinks = buildInquiryEmailLinks({
    subject: `Velira Inquiry — ${selectedService}${name ? ` (${name})` : ""}`,
    fields: [
      ["Service Interest", selectedService],
      ["Full Name", name],
      ["WhatsApp / Phone", phone],
      ["Email Address", email],
      ["Goals / Message", message],
    ],
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    openInquiryComposer(emailLinks);
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal overflow-x-safe selection:bg-clay selection:text-offwhite font-sans">
      <Nav onApply={() => setModalOpen(true)} alwaysSolid />

      {/* Botanical Watermark (desktop only to keep mobile scroll fast) */}
      <div className="hidden md:block fixed inset-0 pointer-events-none opacity-[0.04] z-0">
        <img
          src="/velira-botanical-bg.webp"
          alt="Velira botanical watermark"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <main className="relative z-10 pt-32 sm:pt-40 pb-20 sm:pb-28 px-5 sm:px-6 md:px-12">
        <div className="mx-auto max-w-[1300px]">
          <Reveal>
            <span className="eyebrow text-clay mb-4 block">Step into Velira · Inquiry</span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-black text-charcoal tracking-tight leading-[1.05]">
              Care shaped <br />
              <em className="italic font-normal text-forest font-serif">around your inquiry.</em>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-charcoal/70 font-light max-w-2xl">
              Have a question about personalised yoga, diet therapy, reset programs, or booking a
              1-on-1 personal consultation? Reach out directly to our care team — no slow
              turnaround, no confusing pricing.
            </p>
            <div className="w-20 h-0.5 bg-clay my-10" />
          </Reveal>

          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.25fr] items-start">
            {/* Left Column: Direct Channels & Visual */}
            <div className="space-y-8">
              <Reveal delay={0.08}>
                <ClipReveal
                  src={consultationImg}
                  alt="Personal consultation at Velira Health & Wellness"
                  ratio="aspect-[4/3]"
                  className="rounded-sm border border-charcoal/10 shadow-luxury"
                />
              </Reveal>

              <Reveal delay={0.14}>
                <div className="glass rounded-sm p-6 md:p-8 space-y-6">
                  <div>
                    <span className="eyebrow text-[10px] text-clay mb-2 block">
                      Direct Contact Details
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-charcoal">
                      Velira Health &amp; Wellness · Care Team
                    </h2>
                  </div>

                  <div className="space-y-4 text-sm">
                    <a
                      href="https://wa.me/918148288704"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 text-charcoal/80 hover:text-clay transition"
                    >
                      <span className="w-10 h-10 rounded-full bg-clay/10 text-clay flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-charcoal/45 font-semibold">
                          WhatsApp
                        </div>
                        <div className="font-medium">+91 81482 88704</div>
                      </div>
                    </a>

                    <a
                      href="tel:+918148288704"
                      className="flex items-center gap-4 text-charcoal/80 hover:text-clay transition"
                    >
                      <span className="w-10 h-10 rounded-full bg-clay/10 text-clay flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-charcoal/45 font-semibold">
                          Phone
                        </div>
                        <div className="font-medium">+91 81482 88704</div>
                      </div>
                    </a>

                    <a
                      href="mailto:velirahealth@gmail.com"
                      className="flex items-center gap-4 text-charcoal/80 hover:text-clay transition"
                    >
                      <span className="w-10 h-10 rounded-full bg-clay/10 text-clay flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-widest text-charcoal/45 font-semibold">
                          Email
                        </div>
                        <div className="font-medium break-all">velirahealth@gmail.com</div>
                      </div>
                    </a>

                    <a
                      href="https://instagram.com/velirahealth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 text-charcoal/80 hover:text-clay transition"
                    >
                      <span className="w-10 h-10 rounded-full bg-clay/10 text-clay flex items-center justify-center flex-shrink-0">
                        <Instagram className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-charcoal/45 font-semibold">
                          Instagram
                        </div>
                        <div className="font-medium">@velirahealth</div>
                      </div>
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Inquiry Form */}
            <Reveal delay={0.12}>
              <div className="bg-white border border-charcoal/10 rounded-sm p-5 sm:p-8 md:p-12 shadow-luxury">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                      <span className="eyebrow text-[10px] text-clay mb-2 block">
                        Inquiry Form · Pricing Shared After Consultation
                      </span>
                      <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal">
                        Tell us what you&apos;re looking for.
                      </h2>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-charcoal/55 font-semibold">
                        Service Interest
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {servicesList.map((srv) => {
                          const active = selectedService === srv;
                          return (
                            <button
                              key={srv}
                              type="button"
                              onClick={() => setSelectedService(srv)}
                              className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.16em] transition-all duration-300 cursor-pointer ${
                                active
                                  ? "border-clay bg-clay text-offwhite"
                                  : "border-charcoal/15 text-charcoal/70 hover:border-clay/50"
                              }`}
                            >
                              {srv}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <label className="block space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/55 font-semibold">
                          Your Name *
                        </span>
                        <input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full name"
                          className="w-full border-b border-charcoal/20 bg-transparent py-3 text-base text-charcoal outline-none focus:border-clay transition"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/55 font-semibold">
                          WhatsApp / Phone *
                        </span>
                        <input
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 ..."
                          className="w-full border-b border-charcoal/20 bg-transparent py-3 text-base text-charcoal outline-none focus:border-clay transition"
                        />
                      </label>
                    </div>

                    <label className="block space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/55 font-semibold">
                        Email Address *
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border-b border-charcoal/20 bg-transparent py-3 text-base text-charcoal outline-none focus:border-clay transition"
                      />
                    </label>

                    <label className="block space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/55 font-semibold">
                        How can Velira support you?
                      </span>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share a quick note about your wellness goals, routine, or preferred timings..."
                        className="w-full border-b border-charcoal/20 bg-transparent py-3 text-base text-charcoal outline-none focus:border-clay transition resize-none"
                      />
                    </label>

                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <MagneticButton type="submit">Send Inquiry</MagneticButton>
                    </div>
                  </form>
                ) : (
                  <div className="py-12 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="font-serif text-4xl font-bold text-charcoal">
                      Thank you{name ? `, ${name}` : ""}.
                    </h2>
                    <p className="text-base text-charcoal/70 font-light max-w-md mx-auto leading-relaxed">
                      Your pre-filled email regarding <strong>{selectedService}</strong> is ready
                      for <strong>{INQUIRY_RECIPIENT_EMAIL}</strong>. Click Send in Gmail to
                      deliver your inquiry.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                      <a
                        href={emailLinks.gmailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-clay text-offwhite px-7 py-3.5 text-[10.5px] font-medium uppercase tracking-[0.2em] hover:bg-charcoal transition"
                      >
                        Open in Gmail
                      </a>
                      <a
                        href={emailLinks.mailtoUrl}
                        className="border border-charcoal/20 text-charcoal px-6 py-3.5 text-[10.5px] font-medium uppercase tracking-[0.18em] hover:border-clay hover:text-clay transition"
                      >
                        Open Mail App
                      </a>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="eyebrow text-[10px] text-charcoal/60 hover:text-clay px-4 py-3 cursor-pointer"
                      >
                        Send another inquiry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer onApply={() => setModalOpen(true)} />
      <ApplicationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
