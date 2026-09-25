import { Page } from "@/components/ui/Page";
import { LoadingState } from "@/components/ui/States";

export default function AppLoading() {
  return (
    <Page>
      <LoadingState label="Loading ZMart…" />
    </Page>
  );
}
