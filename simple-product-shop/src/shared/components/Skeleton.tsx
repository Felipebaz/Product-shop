export type SkeletonVariant = 'text' | 'rectangular' | 'circular';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
}

const VARIANT_CLASSES: Record<SkeletonVariant, string> = {
  text: 'rounded h-4',
  rectangular: 'rounded-md',
  circular: 'rounded-full',
};

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
}: SkeletonProps) {
  return (
    <span role="status" aria-busy="true" aria-label="Loading">
      <span
        data-testid="skeleton"
        data-variant={variant}
        style={{ width, height }}
        className={`block animate-pulse bg-gray-200 ${VARIANT_CLASSES[variant]} ${className}`.trim()}
      />
    </span>
  );
}
