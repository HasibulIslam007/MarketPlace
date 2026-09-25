import Link from "next/link";
import { Page } from "@/components/ui/Page";
import { ResultState } from "@/components/ui/States";

export default function PaymentCancelledPage() {
  return (
    <Page narrow>
      <ResultState
        tone="warning"
        icon="alert-circle"
        title="Payment cancelled"
        text="No payment was taken. You can return to your cart and try again whenever you are ready."
        action={
          <>
            <Link href="/cart" className="btn btn-primary">
              Return to cart
            </Link>
            <Link href="/products" className="btn btn-secondary">
              Keep shopping
            </Link>
          </>
        }
      />
    </Page>
  );
}
