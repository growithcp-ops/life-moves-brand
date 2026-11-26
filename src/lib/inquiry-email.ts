export const INQUIRY_RECIPIENT_EMAIL = "info@velirahealth.in";

export type InquiryField = [label: string, value: string | undefined];

export interface InquiryEmailLinks {
  gmailUrl: string;
  mailtoUrl: string;
}

/** Builds pre-filled Gmail web compose and mailto URLs addressed to info@velirahealth.in. */
export function buildInquiryEmailLinks({
  subject,
  fields,
}: {
  subject: string;
  fields: InquiryField[];
}): InquiryEmailLinks {
  const details = fields
    .filter(([, value]) => Boolean(value && value.trim()))
    .map(([label, value]) => `${label}: ${value!.trim()}`)
    .join("\n");

  const body = details
    ? `Hello Velira Health & Wellness Team,\n\nHere are my inquiry details:\n\n${details}\n`
    : "Hello Velira Health & Wellness Team,\n\nI would like to book a consultation.\n";

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    INQUIRY_RECIPIENT_EMAIL,
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const mailtoUrl = `mailto:${INQUIRY_RECIPIENT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  return { gmailUrl, mailtoUrl };
}

/** Opens Gmail web compose on desktop or native Mail/Gmail app via mailto on mobile. */
export function openInquiryComposer({ gmailUrl, mailtoUrl }: InquiryEmailLinks): void {
  if (typeof window === "undefined") return;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = mailtoUrl;
    return;
  }
  const win = window.open(gmailUrl, "_blank", "noopener,noreferrer");
  if (!win) {
    window.location.href = mailtoUrl;
  }
}
