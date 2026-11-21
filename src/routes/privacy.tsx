import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/velira/legal-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Velira Health & Wellness" },
      {
        name: "description",
        content: "Privacy Policy for Velira Health & Wellness.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal · Privacy"
      title="Privacy Policy"
      subtitle="How Velira Health & Wellness collects, protects, and uses the personal and wellness information you share during inquiries and consultations."
      sections={[
        {
          heading: "1. Information We Collect",
          body: [
            "When you submit an inquiry or request a personal consultation with Velira Health & Wellness, we may collect your name, phone or WhatsApp number, email address, city, preferred schedule, and wellness goals that you choose to share.",
          ],
        },
        {
          heading: "2. How We Use Your Details",
          body: [
            "Your information is used strictly to respond to your inquiry, schedule personal consultations, design tailored yoga, diet therapy, lifestyle modification, or reset programs, and communicate updates related to your care.",
            "We never sell, rent, or trade your personal or health-related details to third-party advertisers or data brokers.",
          ],
        },
        {
          heading: "3. Confidentiality & Storage",
          body: [
            "All consultation notes and wellness preferences shared with the Velira team are treated with strict confidentiality and accessed only for delivering your personalised services.",
          ],
        },
        {
          heading: "4. Your Rights & Contact",
          body: [
            "You may request access to, correction of, or deletion of your personal details at any time by writing to velirahealth@gmail.com or messaging us on WhatsApp at +91 81482 88704.",
          ],
        },
      ]}
    />
  );
}
