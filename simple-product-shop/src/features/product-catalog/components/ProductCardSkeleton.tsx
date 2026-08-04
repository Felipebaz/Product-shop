import { Skeleton } from '@/shared/components';

export function ProductCardSkeleton() {
  return (
    <article
      data-testid="product-card-skeleton"
      className="rounded-lg shadow-md p-4 bg-white flex flex-col gap-2"
    >
      <Skeleton variant="rectangular" height="10rem" />
      <Skeleton width="70%" />
      <Skeleton width="100%" />
      <Skeleton width="40%" />
      <Skeleton variant="rectangular" height="2.5rem" className="mt-2" />
    </article>
  );
}
