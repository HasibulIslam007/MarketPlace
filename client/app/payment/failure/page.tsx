import Link from "next/link";
import { Page } from "@/components/ui/Page";
import { ResultState } from "@/components/ui/States";

export default function PaymentFailurePage() {
  return (
    <Page narrow>
      <ResultState
        tone="danger"
        icon="alert"
        title="Payment was not completed"
        text="Your order was not marked as paid. You can try again from your cart — no charge was made."
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
