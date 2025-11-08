import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function PageContainer({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-[80vw]",
                className
            )}
            {...props}
        />
    );
}

