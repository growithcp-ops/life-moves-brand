import { useEffect, useState } from "react";

/** Manages inquiry modal visibility and replays clicks captured before React hydration. */
export function useInquiryModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const win = window as Window & {
      __veliraHydrated?: boolean;
      __veliraPendingInquiry?: boolean;
    };
    win.__veliraHydrated = true;
    if (win.__veliraPendingInquiry) {
      win.__veliraPendingInquiry = false;
      setOpen(true);
    }
  }, []);

  return [open, setOpen] as const;
}
