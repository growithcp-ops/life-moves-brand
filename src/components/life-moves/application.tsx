import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VeliraLogoMark } from "@/components/velira/layout";
import {
  buildInquiryEmailLinks,
  INQUIRY_RECIPIENT_EMAIL,
  openInquiryComposer,
} from "@/lib/inquiry-email";

const ease = [0.16, 1, 0.3, 1] as const;

const programs = [
  {
    id: "personalised-yoga",
    label: "Personalised Yoga & Lifestyle",
    tag: "1-on-1 Practice",
  },
  {
    id: "diet-therapy",
    label: "Diet Therapy & Nutrition",
    tag: "Whole-Food Care",
  },
  {
    id: "reset-programs",
    label: "Guided Reset Programs",
    tag: "Inside-Out Renewal",
  },
  {
    id: "personal-consultation",
    label: "Personal Consultation",
    tag: "1-on-1 Assessment",
  },
];

export function ApplicationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    phone: string;
    email: string;
    city: string;
    timing: string;
    focus: string;
    timeline: string;
    services: string[];
    program: string;
    channel: string;
  }>({
    name: "",
    phone: "",
    email: "",
    city: "",
    timing: "Morning",
    focus: "",
    timeline: "",
    services: [],
    program: "personalised-yoga",
    channel: `Email (${INQUIRY_RECIPIENT_EMAIL})`,
  });

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStep(0);
      setDone(false);
    } else document.body.style.overflow = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectedProgramLabel =
    programs.find((p) => p.id === form.program)?.label ?? "Wellness Consultation";

  const emailLinks = buildInquiryEmailLinks({
    subject: `Velira Wellness Inquiry — ${selectedProgramLabel}${form.name ? ` (${form.name})` : ""}`,
    fields: [
      ["Full Name", form.name],
      ["Phone / WhatsApp", form.phone],
      ["Email", form.email],
      ["City", form.city],
      ["Preferred Time", form.timing],
      ["Primary Focus", form.focus],
      ["Timeline", form.timeline],
      ["Services Interested In", form.services.join(", ")],
      ["Selected Program", selectedProgramLabel],
      ["Preferred Response Channel", form.channel],
    ],
  });

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const submit = () => {
    setDone(true);
    openInquiryComposer(emailLinks);
  };

  const update = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const toggleService = (v: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(v) ? f.services.filter((x) => x !== v) : [...f.services, v],
    }));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] overflow-y-auto bg-charcoal/98"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease }}
        >
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8 text-offwhite md:px-16 md:py-12">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-offwhite/10 pb-6">
              <div className="flex items-center gap-3">
                <VeliraLogoMark className="h-9 w-9" />
                <span className="eyebrow text-offwhite/80">Velira Health &amp; Wellness · Inquiry</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-cursor="Close"
                className="group flex items-center gap-2 eyebrow text-offwhite/60 transition hover:text-clay cursor-pointer"
              >
                <span>Close</span>
                <span className="transition-transform duration-300 group-hover:rotate-90">✕</span>
              </button>
            </div>

            {!done && (
              <>
                {/* Step Indicators */}
                <div className="mt-10 grid grid-cols-3 gap-4 md:gap-8">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex flex-col">
                      <div className="eyebrow mb-2 text-[9px] text-offwhite/40 md:text-[10px]">
                        Step 0{i + 1}
                      </div>
                      <div className="mb-2 hidden font-serif text-xs italic text-offwhite/80 md:block">
                        {["About You", "Your Wellness Goals", "Choose Your Path"][i]}
                      </div>
                      <div className="relative h-[2px] bg-offwhite/10">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-clay"
                          initial={false}
                          animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                          transition={{ duration: 0.8, ease }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Content Panel */}
                <div className="relative mt-12 flex-1 rounded-sm border border-offwhite/5 bg-offwhite/[0.01] p-6 md:mt-16 md:p-12">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={step}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -30, opacity: 0 }}
                      transition={{ duration: 0.6, ease }}
                    >
                      {step === 0 && (
                        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.3fr]">
                          <div className="space-y-6">
                            <span className="eyebrow text-clay">01 / Introduction</span>
                            <h2 className="font-serif text-[clamp(1.85rem,4.5vw,4rem)] leading-[1.05]">
                              Care shaped <br />
                              <em className="font-serif italic text-clay-soft">around you</em>.
                            </h2>
                            <p className="max-w-sm text-sm leading-relaxed text-offwhite/60">
                              Share a few details so our Velira care team can recommend the right
                              yoga, diet therapy, or reset plan for your daily rhythm.
                            </p>
                          </div>

                          <div className="space-y-8">
                            <FloatField
                              label="Full name"
                              value={form.name}
                              onChange={(v) => update("name", v)}
                            />
                            <FloatField
                              label="WhatsApp / Phone number"
                              value={form.phone}
                              onChange={(v) => update("phone", v)}
                            />
                            <FloatField
                              label="Email address"
                              value={form.email}
                              onChange={(v) => update("email", v)}
                            />
                            <FloatField
                              label="Your city"
                              value={form.city}
                              onChange={(v) => update("city", v)}
                            />

                            <PillGroup
                              label="Preferred time of day"
                              options={["Morning", "Afternoon", "Evening", "Weekend"]}
                              value={form.timing}
                              onChange={(v) => update("timing", v)}
                            />
                          </div>
                        </div>
                      )}

                      {step === 1 && (
                        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.3fr]">
                          <div className="space-y-6">
                            <span className="eyebrow text-clay">02 / Intentions</span>
                            <h2 className="font-serif text-[clamp(1.85rem,4.5vw,4rem)] leading-[1.05]">
                              How would you <br />
                              <em className="font-serif italic text-clay-soft">like to feel</em>?
                            </h2>
                            <p className="max-w-sm text-sm leading-relaxed text-offwhite/60">
                              No generic plans or slow guesswork. Tell us what you want to shift so
                              we can shape practical steps around your lifestyle.
                            </p>
                          </div>

                          <div className="space-y-10">
                            <RadioRows
                              label="What brings you to Velira right now?"
                              name="focus"
                              options={[
                                "Low energy, fatigue & daily lifestyle balance",
                                "Stress, stiffness & nervous system recovery",
                                "Digestive wellness & sustainable diet habits",
                                "A structured reset to feel fresh from inside",
                              ]}
                              value={form.focus}
                              onChange={(v) => update("focus", v)}
                            />

                            <RadioRows
                              label="When are you hoping to start?"
                              name="timeline"
                              options={[
                                "Right away — this week",
                                "Within the next 2–4 weeks",
                                "Just exploring and asking questions",
                              ]}
                              value={form.timeline}
                              onChange={(v) => update("timeline", v)}
                            />

                            <CheckRows
                              label="Services you are interested in"
                              options={[
                                "Personalised Yoga",
                                "Diet Therapy",
                                "Reset Programs",
                                "Personal Consultation",
                                "Lifestyle Modification",
                                "Breath & Sleep Support",
                              ]}
                              values={form.services}
                              onToggle={toggleService}
                            />
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.3fr]">
                          <div className="space-y-6">
                            <span className="eyebrow text-clay">03 / Inquiry Path</span>
                            <h2 className="font-serif text-[clamp(1.85rem,4.5vw,4rem)] leading-[1.05]">
                              Choose your <br />
                              <em className="font-serif italic text-clay-soft">starting point</em>.
                            </h2>
                            <p className="max-w-sm text-sm leading-relaxed text-offwhite/60">
                              Every plan is customised following your consultation — clear
                              expectations, rapid follow-up, and no confusing pricing tiers.
                            </p>
                          </div>

                          <div className="space-y-10">
                            <div className="space-y-3">
                              <div className="eyebrow mb-2 text-offwhite/40">Select Primary Service</div>
                              {programs.map((e) => (
                                <button
                                  key={e.id}
                                  type="button"
                                  onClick={() => update("program", e.id)}
                                  className={`group flex w-full items-center justify-between gap-4 sm:gap-6 border px-4 py-4 sm:px-6 sm:py-5 text-left transition-all duration-300 cursor-pointer ${
                                    form.program === e.id
                                      ? "border-clay bg-clay/5"
                                      : "border-offwhite/10 hover:border-offwhite/30"
                                  }`}
                                >
                                  <div className="flex items-center gap-4 sm:gap-5">
                                    <span
                                      className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                                        form.program === e.id
                                          ? "border-clay"
                                          : "border-offwhite/20 group-hover:border-offwhite/40"
                                      }`}
                                    >
                                      <motion.span
                                        animate={{ scale: form.program === e.id ? 1 : 0 }}
                                        transition={{ duration: 0.3, ease }}
                                        className="block h-2.5 w-2.5 rounded-full bg-clay"
                                      />
                                    </span>
                                    <span className="font-serif text-lg sm:text-xl md:text-2xl">
                                      {e.label}
                                    </span>
                                  </div>
                                  <span className="eyebrow hidden text-[9px] text-offwhite/45 sm:inline-flex">
                                    {e.tag}
                                  </span>
                                </button>
                              ))}
                            </div>

                            <PillGroup
                              label="Preferred way for us to respond"
                              options={[`Email (${INQUIRY_RECIPIENT_EMAIL})`]}
                              value={form.channel}
                              onChange={(v) => update("channel", v)}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={back}
                    disabled={step === 0}
                    className="eyebrow text-offwhite/40 transition hover:text-clay disabled:pointer-events-none disabled:opacity-0"
                  >
                    ← Back
                  </button>

                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={next}
                      data-cursor="Continue"
                      className="group inline-flex items-center gap-3 bg-clay px-8 py-4 text-[10.5px] font-medium uppercase tracking-[0.24em] text-offwhite transition duration-500 hover:bg-offwhite hover:text-charcoal"
                    >
                      <span>Continue</span>
                      <svg
                        width="20"
                        height="6"
                        viewBox="0 0 22 6"
                        fill="none"
                        className="transition-transform duration-500 group-hover:translate-x-1"
                      >
                        <path
                          d="M0 3H21M21 3L18 1M21 3L18 5"
                          stroke="currentColor"
                          strokeWidth="0.8"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submit}
                      data-cursor="Send"
                      className="bg-clay px-8 py-4 text-[10.5px] font-medium uppercase tracking-[0.24em] text-offwhite transition duration-500 hover:bg-offwhite hover:text-charcoal"
                    >
                      Submit Inquiry
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Inquiry Submitted State */}
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
                className="mx-auto mt-20 flex max-w-lg flex-col items-center text-center"
              >
                <svg width="84" height="84" viewBox="0 0 84 84" className="text-clay">
                  <motion.circle
                    cx="42"
                    cy="42"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease }}
                  />
                  <motion.path
                    d="M28 44 L38 54 L58 32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.6, ease }}
                  />
                </svg>
                <h2 className="mt-8 sm:mt-10 font-serif text-3xl sm:text-5xl leading-tight">
                  Ready to send. <br />
                  <em className="italic text-clay-soft">Thank you.</em>
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-offwhite/70">
                  We&apos;ve opened a pre-filled email addressed to{" "}
                  <span className="text-offwhite font-medium">{INQUIRY_RECIPIENT_EMAIL}</span>. Hit
                  Send in Gmail to deliver your inquiry — our team will reply within 24 hours.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={emailLinks.gmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-clay px-7 py-3.5 text-[10.5px] font-medium uppercase tracking-[0.22em] text-offwhite transition duration-300 hover:bg-offwhite hover:text-charcoal"
                  >
                    Open in Gmail
                  </a>
                  <a
                    href={emailLinks.mailtoUrl}
                    className="border border-offwhite/25 px-6 py-3.5 text-[10.5px] font-medium uppercase tracking-[0.2em] text-offwhite/85 transition duration-300 hover:border-clay hover:text-clay-soft"
                  >
                    Open Mail App
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="eyebrow px-4 py-3 text-clay-soft hover:text-clay cursor-pointer"
                  >
                    ← Back to Velira
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloatField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focus, setFocus] = useState(false);
  const active = focus || value.length > 0;
  return (
    <label className="relative block">
      <span
        className={`pointer-events-none absolute left-0 transition-all duration-300 ${
          active
            ? "-top-2 text-[9px] tracking-[0.22em] text-clay-soft font-semibold"
            : "top-5 text-base text-offwhite/40"
        }`}
        style={{ textTransform: active ? "uppercase" : "none" }}
      >
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="block w-full border-b border-offwhite/15 bg-transparent pb-3 pt-6 text-lg text-offwhite outline-none transition duration-300 focus:border-clay"
      />
    </label>
  );
}

function PillGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="eyebrow text-offwhite/40">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <motion.button
              type="button"
              key={o}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(o)}
              className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.16em] transition-all duration-300 ${
                active
                  ? "border-clay bg-clay text-offwhite"
                  : "border-offwhite/10 text-offwhite/70 hover:border-offwhite/30"
              }`}
            >
              {o}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function RadioRows({
  label,
  options,
  value,
  onChange,
  name: _name,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <div className="space-y-3">
      <div className="eyebrow text-offwhite/40">{label}</div>
      <div className="space-y-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              type="button"
              key={o}
              onClick={() => onChange(o)}
              className={`flex w-full items-center gap-4 border px-5 py-4 text-left text-sm transition-all duration-300 md:text-base ${
                active
                  ? "border-clay bg-clay/5 text-offwhite"
                  : "border-offwhite/10 text-offwhite/70 hover:border-offwhite/25"
              }`}
            >
              <span
                className={`grid h-4 w-4 place-items-center rounded-full border transition-colors duration-300 ${active ? "border-clay" : "border-offwhite/20"}`}
              >
                <motion.span
                  animate={{ scale: active ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="h-2 w-2 rounded-full bg-clay"
                />
              </span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CheckRows({
  label,
  options,
  values,
  onToggle,
}: {
  label: string;
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="eyebrow text-offwhite/40">{label}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const active = values.includes(o);
          return (
            <button
              type="button"
              key={o}
              onClick={() => onToggle(o)}
              className={`flex items-center gap-3 border px-4 py-3 text-left text-sm transition-all duration-300 ${
                active
                  ? "border-clay bg-clay/5 text-offwhite"
                  : "border-offwhite/10 text-offwhite/70 hover:border-offwhite/25"
              }`}
            >
              <span
                className={`grid h-4 w-4 place-items-center border transition-all duration-300 ${active ? "border-clay bg-clay" : "border-offwhite/20"}`}
              >
                <motion.svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  animate={{ scale: active ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <path
                    d="M1 5 L4 8 L9 2"
                    stroke="#F7F4EF"
                    strokeWidth="1.4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
