import { Page } from "@/components/ui/Page";
import { Skeleton, SkeletonProductGrid } from "@/components/ui/States";

export default function ProductsLoading() {
  return (
    <Page>
      <div className="z-stack z-mb-8">
        <Skeleton width={150} height={13} />
        <Skeleton width={260} height={30} />
        <Skeleton width={340} height={14} />
      </div>
      <SkeletonProductGrid count={6} />
    </Page>
  );
}
