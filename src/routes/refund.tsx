import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/velira/legal-page";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Velira Health & Wellness" },
      {
        name: "description",
        content: "Cancellation and Refund Policy for Velira Health & Wellness.",
      },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal · Refunds"
      title="Refund Policy"
      subtitle="Transparent expectations around bookings, rescheduling, and refund eligibility for Velira Health & Wellness consultations and programs."
      sections={[
        {
          heading: "1. Inquiry & Consultation Clarity",
          body: [
            "Because Velira Health & Wellness operates on a tailored inquiry-first model, all scope, timelines, and engagement details are discussed clearly during your initial consultation before any payment is finalised.",
          ],
        },
        {
          heading: "2. Rescheduling & Cancellations",
          body: [
            "Confirmed 1-on-1 personal consultations or yoga sessions may be rescheduled without penalty when notified at least 12 hours prior to the scheduled slot.",
            "For full program cancellations requested before personalised diet plans, yoga schedules, or reset materials have been delivered or sessions commenced, a full or pro-rated refund may be reviewed on a fair, case-by-case basis.",
          ],
        },
        {
          heading: "3. Customised Digital & Reset Plans",
          body: [
            "Once bespoke diet therapy protocols, reset schedules, or multi-session guidance have been prepared and delivered, completed consultation hours and custom planning work are non-refundable, though unused session credits may be paused or rescheduled with mutual agreement.",
          ],
        },
        {
          heading: "4. Requesting Support",
          body: [
            "To discuss a schedule adjustment or refund request, contact our care team directly at velirahealth@gmail.com or via WhatsApp / call at +91 81482 88704.",
          ],
        },
      ]}
    />
  );
}
