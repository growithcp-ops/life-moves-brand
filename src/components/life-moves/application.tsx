import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const editions = [
  { id: "goa-aug-12", label: "Goa · Aug 12 – 16", spots: 6, cap: 12 },
  { id: "goa-aug-26", label: "Goa · Aug 26 – 30", spots: 9, cap: 12 },
  { id: "himachal-oct", label: "Himachal · October (Waitlist)", spots: 0, cap: 12 },
  { id: "not-sure", label: "Not sure yet — keep me posted", spots: -1, cap: 0 },
];

export function ApplicationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<any>({
    edition: "goa-aug-12",
    invest: "₹60,000 – ₹80,000",
    tried: [] as string[],
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStep(0);
      setDone(false);
    } else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const submit = () => setDone(true);

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const toggleTried = (v: string) =>
    setForm((f: any) => ({
      ...f,
      tried: f.tried.includes(v) ? f.tried.filter((x: string) => x !== v) : [...f.tried, v],
    }));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] overflow-y-auto bg-charcoal/98 backdrop-blur-xl grain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 text-offwhite md:px-16 md:py-12">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-offwhite/10 pb-6">
              <div className="flex items-center gap-3">
                <svg width="22" height="16" viewBox="0 0 28 20" fill="none" className="text-clay">
                  <path
                    d="M1 14 Q5 4 10 14 T19 14 T27 8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="eyebrow text-offwhite/80">Life Moves · Application</span>
              </div>
              <button
                onClick={onClose}
                data-cursor="Close"
                className="group flex items-center gap-2 eyebrow text-offwhite/60 transition hover:text-clay"
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
                        {["About You", "What's Bringing You Here", "Choose Your Edition"][i]}
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
                            <h2 className="font-serif text-[clamp(2.4rem,4.5vw,4rem)] leading-[1.05]">
                              Let's start with <br />
                              <em className="font-serif italic text-clay-soft">who you are</em>.
                            </h2>
                            <p className="max-w-sm text-sm leading-relaxed text-offwhite/60">
                              Every edition of Life Moves is limited to 12 individuals, curated to
                              foster deep safety and mutual aliveness.
                            </p>
                          </div>

                          <div className="space-y-8">
                            {[
                              "Full name",
                              "Phone (with country code)",
                              "Email",
                              "City you're moving from",
                            ].map((l) => (
                              <FloatField key={l} label={l} />
                            ))}

                            <PillGroup
                              label="Which best describes you?"
                              options={["Founder", "Executive", "Creative", "Investor", "Other"]}
                              value={form.role}
                              onChange={(v) => update("role", v)}
                            />

                            <PillGroup
                              label="Income range (annual)"
                              options={["₹25L – ₹50L", "₹50L – ₹1Cr", "₹1Cr – ₹3Cr", "₹3Cr+"]}
                              value={form.income}
                              onChange={(v) => update("income", v)}
                            />
                          </div>
                        </div>
                      )}

                      {step === 1 && (
                        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.3fr]">
                          <div className="space-y-6">
                            <span className="eyebrow text-clay">02 / Intentions</span>
                            <h2 className="font-serif text-[clamp(2.4rem,4.5vw,4rem)] leading-[1.05]">
                              What's <br />
                              <em className="font-serif italic text-clay-soft">
                                bringing you
                              </em>{" "}
                              here?
                            </h2>
                            <p className="max-w-sm text-sm leading-relaxed text-offwhite/60">
                              Be as honest as you can. We ask because we design the cohort's
                              conversations around what everyone is quietly carrying.
                            </p>
                          </div>

                          <div className="space-y-10">
                            <RadioRows
                              label="How are you actually doing, underneath the busy?"
                              name="state"
                              options={[
                                "Running on fumes — something has to give.",
                                "Functional, but feeling flat.",
                                "Good on paper. Hollow in private.",
                                "Curious. Looking for the next chapter.",
                              ]}
                              value={form.state}
                              onChange={(v) => update("state", v)}
                            />

                            <RadioRows
                              label="When did you last feel fully alive?"
                              name="alive"
                              options={[
                                "I can't remember.",
                                "Months ago.",
                                "A few weeks ago.",
                                "Recently — and I want more of it.",
                              ]}
                              value={form.alive}
                              onChange={(v) => update("alive", v)}
                            />

                            <CheckRows
                              label="What have you already tried? (select all)"
                              options={[
                                "Therapy",
                                "Meditation apps",
                                "Silent retreats",
                                "Yoga / movement",
                                "Travel",
                                "Coaching",
                                "Nothing yet",
                              ]}
                              values={form.tried}
                              onToggle={toggleTried}
                            />
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.3fr]">
                          <div className="space-y-6">
                            <span className="eyebrow text-clay">03 / Options</span>
                            <h2 className="font-serif text-[clamp(2.4rem,4.5vw,4rem)] leading-[1.05]">
                              Choose your <br />
                              <em className="font-serif italic text-clay-soft">edition</em>.
                            </h2>
                            <p className="max-w-sm text-sm leading-relaxed text-offwhite/60">
                              Select the date and location that works best. We will contact you to
                              confirm final availability.
                            </p>
                          </div>

                          <div className="space-y-10">
                            <div className="space-y-3">
                              <div className="eyebrow mb-2 text-offwhite/40">Select Edition</div>
                              {editions.map((e) => (
                                <button
                                  key={e.id}
                                  onClick={() => update("edition", e.id)}
                                  className={`group flex w-full items-center justify-between gap-6 border px-6 py-5 text-left transition-all duration-300 ${
                                    form.edition === e.id
                                      ? "border-clay bg-clay/5"
                                      : "border-offwhite/10 hover:border-offwhite/30"
                                  }`}
                                >
                                  <div className="flex items-center gap-5">
                                    <span
                                      className={`grid h-5 w-5 place-items-center rounded-full border transition-colors duration-300 ${
                                        form.edition === e.id
                                          ? "border-clay"
                                          : "border-offwhite/20 group-hover:border-offwhite/40"
                                      }`}
                                    >
                                      <motion.span
                                        animate={{ scale: form.edition === e.id ? 1 : 0 }}
                                        transition={{ duration: 0.3, ease }}
                                        className="block h-2.5 w-2.5 rounded-full bg-clay"
                                      />
                                    </span>
                                    <span className="font-serif text-xl md:text-2xl">
                                      {e.label}
                                    </span>
                                  </div>
                                  {e.cap > 0 && <SpotsDots filled={e.cap - e.spots} cap={e.cap} />}
                                </button>
                              ))}
                            </div>

                            <PillGroup
                              label="Investment range"
                              options={[
                                "₹40,000 – ₹60,000",
                                "₹60,000 – ₹80,000",
                                "₹80,000 – ₹1,00,000",
                                "₹1,00,000+",
                              ]}
                              value={form.invest}
                              onChange={(v) => update("invest", v)}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="mt-10 flex items-center justify-between">
                  <button
                    onClick={back}
                    disabled={step === 0}
                    className="eyebrow text-offwhite/40 transition hover:text-clay disabled:pointer-events-none disabled:opacity-0"
                  >
                    ← Back
                  </button>

                  {step < 2 ? (
                    <button
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
                      onClick={submit}
                      data-cursor="Send"
                      className="bg-clay px-8 py-4 text-[10.5px] font-medium uppercase tracking-[0.24em] text-offwhite transition duration-500 hover:bg-offwhite hover:text-charcoal"
                    >
                      Submit Application
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Application Submitted State */}
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
                className="mx-auto mt-24 flex max-w-lg flex-col items-center text-center"
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
                <h2 className="mt-10 font-serif text-5xl leading-tight">
                  We've got it. <br />
                  <em className="italic text-clay-soft">Thank you.</em>
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-offwhite/70">
                  We read every application personally. You'll hear from Aman or someone on the team
                  within 48 hours — usually sooner.
                </p>
                <button onClick={onClose} className="mt-12 eyebrow text-clay-soft hover:text-clay">
                  ← Back to Life Moves
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloatField({ label }: { label: string }) {
  const [v, setV] = useState("");
  const [focus, setFocus] = useState(false);
  const active = focus || v.length > 0;
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
        value={v}
        onChange={(e) => setV(e.target.value)}
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
  name,
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

function SpotsDots({ filled, cap }: { filled: number; cap: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: cap }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${i < filled ? "bg-offwhite/10" : "bg-clay"}`}
          />
        ))}
      </div>
      <span className="eyebrow text-[9px] text-offwhite/40">{cap - filled} left</span>
    </div>
  );
}
