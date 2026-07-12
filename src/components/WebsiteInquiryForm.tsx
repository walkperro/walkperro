// Thin wrapper kept for /websites/[slug] — the original prop surface,
// byte-compatible payloads (topic defaults to "website" in InquiryForm).
// New surfaces should use InquiryForm directly with a topic.

import InquiryForm from "@/components/InquiryForm";

type Props = {
  templateSlug: string;
  templateTitle: string;
};

export default function WebsiteInquiryForm({ templateSlug, templateTitle }: Props) {
  return (
    <InquiryForm
      topic="website"
      templateSlug={templateSlug}
      templateTitle={templateTitle}
    />
  );
}
