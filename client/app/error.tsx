"use client";

import { Page } from "@/components/ui/Page";
import { ErrorState } from "@/components/ui/States";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Page narrow>
      <ErrorState
        title="Something went wrong"
        text="We could not load this page. Please try again in a moment."
        onRetry={reset}
      />
    </Page>
  );
}
