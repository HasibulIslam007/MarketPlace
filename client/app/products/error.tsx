"use client";

import { Page } from "@/components/ui/Page";
import { ErrorState } from "@/components/ui/States";

export default function ProductsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Page>
      <ErrorState
        title="Unable to load products"
        text="The catalogue is temporarily unavailable. Please try again."
        onRetry={reset}
      />
    </Page>
  );
}
