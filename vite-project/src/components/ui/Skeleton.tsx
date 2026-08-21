interface SkeletonProps {
    className?: string;
}

export default function Skeleton({ className = "h-4 w-full" }: SkeletonProps) {
    return <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`} />;
}