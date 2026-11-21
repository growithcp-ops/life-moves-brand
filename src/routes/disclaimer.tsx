import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/velira/legal-page";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — Velira Health & Wellness" },
      {
        name: "description",
        content: "Health & Wellness Disclaimer for Velira Health & Wellness.",
      },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal · Disclaimer"
      title="Wellness Disclaimer"
      subtitle="Important guidance regarding the holistic, educational, and non-medical scope of Velira Health & Wellness services."
      sections={[
        {
          heading: "1. Holistic Wellness Support — Not Medical Advice",
          body: [
            "All services offered by Velira Health & Wellness — including lifestyle modification, personalised yoga, diet therapy, reset programs, and personal consultations — are designed to support holistic well-being, vitality, and everyday healthy habits.",
            "Our sessions, guides, and website content do not constitute medical diagnosis, clinical treatment, or prescription advice and are not a substitute for care from a licensed physician or medical specialist.",
          ],
        },
        {
          heading: "2. Consulting Your Physician",
          body: [
            "If you have an existing medical condition, chronic illness, recent surgery, pregnancy, or take prescribed medication, please consult a qualified healthcare professional before starting any new yoga movement, dietary modification, or reset protocol.",
          ],
        },
        {
          heading: "3. Individual Results",
          body: [
            "While we craft every plan around your needs for measurable progress, wellness outcomes depend on individual health history, consistency, and personal circumstances.",
          ],
        },
        {
          heading: "4. Questions",
          body: [
            "If you have any questions regarding suitability before beginning a program, please reach out to our team at velirahealth@gmail.com or +91 81482 88704.",
          ],
        },
      ]}
    />
  );
}
