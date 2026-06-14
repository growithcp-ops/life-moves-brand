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
  const [form, setForm] = useState<any>({ edition: "goa-aug-12", invest: "₹60,000 – ₹80,000", tried: [] as string[] });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStep(0);
      setDone(false);
    } else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const submit = () => setDone(true);

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const toggleTried = (v: string) =>
    setForm((f: any) => ({ ...f, tried: f.tried.includes(v) ? f.tried.filter((x: string) => x !== v) : [...f.tried, v] }));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] overflow-y-auto bg-charcoal/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 text-offwhite md:px-12 md:py-16">
            <div className="flex items-center justify-between">
              <div className="eyebrow text-offwhite/60">Take a Living Break</div>
              <button
                onClick={onClose}
                data-cursor="Close"
                className="eyebrow text-offwhite/70 transition hover:text-clay"
              >
                Close ✕
              </button>
            </div>

            {!done && (
              <>
                <div className="mt-10 flex items-center gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex-1">
                      <div className="eyebrow mb-2 text-offwhite/50">
                        0{i + 1} ·{" "}
                        {["About You", "What's Bringing You Here", "Choose Your Edition"][i]}
                      </div>
                      <div className="relative h-px bg-offwhite/15">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-clay"
                          initial={false}
                          animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                          transition={{ duration: 0.6, ease }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative mt-14 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={step}
                      initial={{ x: 60, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -60, opacity: 0 }}
                      transition={{ duration: 0.5, ease }}
                    >
                      {step === 0 && (
                        <div className="grid gap-10 md:grid-cols-2">
                          <h2 className="font-serif text-5xl leading-[1.05] md:text-6xl">
                            Let's start with <em className="font-serif italic text-clay-soft">who you are</em>.
                          </h2>
                          <div className="space-y-7">
                            {["Full name", "Phone (with country code)", "Email", "City you're moving from"].map((l) => (
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
                        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
                          <h2 className="font-serif text-5xl leading-[1.05] md:text-6xl">
                            What's <em className="font-serif italic text-clay-soft">bringing you</em> here?
                          </h2>
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
                              options={["Therapy", "Meditation apps", "Silent retreats", "Yoga / movement", "Travel", "Coaching", "Nothing yet"]}
                              values={form.tried}
                              onToggle={toggleTried}
                            />
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-12">
                          <h2 className="font-serif text-5xl leading-[1.05] md:text-6xl">
                            Choose your <em className="font-serif italic text-clay-soft">edition</em>.
                          </h2>
                          <div className="space-y-3">
                            {editions.map((e) => (
                              <button
                                key={e.id}
                                onClick={() => update("edition", e.id)}
                                className={`group flex w-full items-center justify-between gap-6 border px-6 py-5 text-left transition ${
                                  form.edition === e.id ? "border-clay bg-clay/10" : "border-offwhite/15 hover:border-offwhite/40"
                                }`}
                              >
                                <div className="flex items-center gap-5">
                                  <span
                                    className={`grid h-5 w-5 place-items-center rounded-full border ${
                                      form.edition === e.id ? "border-clay" : "border-offwhite/30"
                                    }`}
                                  >
                                    <motion.span
                                      animate={{ scale: form.edition === e.id ? 1 : 0 }}
                                      transition={{ duration: 0.3, ease }}
                                      className="block h-2.5 w-2.5 rounded-full bg-clay"
                                    />
                                  </span>
                                  <span className="font-serif text-2xl">{e.label}</span>
                                </div>
                                {e.cap > 0 && <SpotsDots filled={e.cap - e.spots} cap={e.cap} />}
                              </button>
                            ))}
                          </div>

                          <PillGroup
                            label="Investment range"
                            options={["₹40,000 – ₹60,000", "₹60,000 – ₹80,000", "₹80,000 – ₹1,00,000", "₹1,00,000+"]}
                            value={form.invest}
                            onChange={(v) => update("invest", v)}
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-16 flex items-center justify-between">
                  <button onClick={back} disabled={step === 0} className="eyebrow text-offwhite/60 disabled:opacity-30 hover:text-clay">
                    ← Back
                  </button>
                  {step < 2 ? (
                    <button
                      onClick={next}
                      data-cursor="Continue"
                      className="group inline-flex items-center gap-3 bg-clay px-8 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-offwhite transition hover:bg-offwhite hover:text-charcoal"
                    >
                      Continue
                      <svg width="22" height="6" viewBox="0 0 22 6"><path d="M0 3H21M21 3L18 1M21 3L18 5" stroke="currentColor" strokeWidth="0.8" fill="none" /></svg>
                    </button>
                  ) : (
                    <button
                      onClick={submit}
                      data-cursor="Send"
                      className="bg-clay px-8 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-offwhite transition hover:bg-offwhite hover:text-charcoal"
                    >
                      Submit Application
                    </button>
                  )}
                </div>
              </>
            )}

            {done && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
                className="mt-24 flex flex-col items-center text-center"
              >
                <svg width="84" height="84" viewBox="0 0 84 84" className="text-clay">
                  <motion.circle
                    cx="42" cy="42" r="40" fill="none" stroke="currentColor" strokeWidth="0.8"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease }}
                  />
                  <motion.path
                    d="M24 44 L37 56 L60 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.6, ease }}
                  />
                </svg>
                <h2 className="mt-10 font-serif text-5xl md:text-6xl">
                  We've got it. <em className="italic text-clay-soft">Thank you.</em>
                </h2>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-offwhite/70">
                  We read every application personally. You'll hear from Aman or someone on the team within 48 hours — usually sooner.
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
          active ? "top-0 text-[10px] tracking-[0.22em] text-clay-soft" : "top-5 text-base text-offwhite/60"
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
        className="block w-full border-b border-offwhite/20 bg-transparent pb-3 pt-6 text-lg text-offwhite outline-none transition focus:border-clay"
      />
    </label>
  );
}

function PillGroup({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="eyebrow mb-4 text-offwhite/50">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <motion.button
              key={o}
              whileTap={{ scale: 0.94 }}
              onClick={() => onChange(o)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                active ? "border-clay bg-clay text-offwhite" : "border-offwhite/20 text-offwhite/70 hover:border-offwhite/50"
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

function RadioRows({ label, options, value, onChange, name }: { label: string; options: string[]; value?: string; onChange: (v: string) => void; name: string }) {
  return (
    <div>
      <div className="eyebrow mb-4 text-offwhite/50">{label}</div>
      <div className="space-y-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              className={`flex w-full items-center gap-4 border px-5 py-4 text-left text-base transition ${
                active ? "border-clay bg-clay/10 text-offwhite" : "border-offwhite/15 text-offwhite/80 hover:border-offwhite/35"
              }`}
            >
              <span className={`grid h-4 w-4 place-items-center rounded-full border ${active ? "border-clay" : "border-offwhite/30"}`}>
                <motion.span animate={{ scale: active ? 1 : 0 }} transition={{ duration: 0.25 }} className="h-2 w-2 rounded-full bg-clay" />
              </span>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CheckRows({ label, options, values, onToggle }: { label: string; options: string[]; values: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      <div className="eyebrow mb-4 text-offwhite/50">{label}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const active = values.includes(o);
          return (
            <button
              key={o}
              onClick={() => onToggle(o)}
              className={`flex items-center gap-3 border px-4 py-3 text-left text-sm transition ${
                active ? "border-clay bg-clay/10 text-offwhite" : "border-offwhite/15 text-offwhite/80 hover:border-offwhite/35"
              }`}
            >
              <span className={`grid h-4 w-4 place-items-center border ${active ? "border-clay bg-clay" : "border-offwhite/30"}`}>
                <motion.svg width="10" height="10" viewBox="0 0 10 10" animate={{ scale: active ? 1 : 0 }} transition={{ duration: 0.25 }}>
                  <path d="M1 5 L4 8 L9 2" stroke="#F7F4EF" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                </motion.svg>
              </span>
              {o}
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
      <div className="flex gap-1">
        {Array.from({ length: cap }).map((_, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < filled ? "bg-offwhite/30" : "bg-clay"}`} />
        ))}
      </div>
      <span className="eyebrow text-offwhite/50">{cap - filled} left</span>
    </div>
  );
}
