import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/velira/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Velira Health & Wellness" },
      {
        name: "description",
        content: "Terms and Conditions for Velira Health & Wellness services.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal · Terms"
      title="Terms & Conditions"
      subtitle="Guidelines governing inquiries, consultations, and participation in Velira Health & Wellness programs."
      sections={[
        {
          heading: "1. Acceptance of Terms",
          body: [
            "By accessing this website or submitting an inquiry for personalised yoga, diet therapy, reset programs, or personal consultations with Velira Health & Wellness, you agree to these Terms & Conditions.",
          ],
        },
        {
          heading: "2. Customised Services & Scheduling",
          body: [
            "All programs are bespoke and initiated following an inquiry and personal consultation. Session timings, program scope, and follow-up schedules are confirmed directly with you prior to commencement.",
            "If you need to reschedule a 1-on-1 session, please notify us at least 12 hours in advance via WhatsApp or phone (+91 81482 88704).",
          ],
        },
        {
          heading: "3. Intellectual Property",
          body: [
            "Personalised diet guides, yoga sequences, and educational materials shared during your program are intended strictly for your personal wellness use and may not be republished, resold, or redistributed commercially without written consent.",
          ],
        },
        {
          heading: "4. Contact",
          body: [
            "For any clarifications regarding these terms, write to velirahealth@gmail.com or call +91 81482 88704.",
          ],
        },
      ]}
    />
  );
}
