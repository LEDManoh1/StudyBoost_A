import { cn } from "@/lib/utils";
import React from "react";

type CardProps<C extends React.ElementType> = {
    as?: C;
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
} & React.ComponentPropsWithoutRef<C>;

export function Card<C extends React.ElementType = "div">({
    as,
    children,
    className,
    hoverEffect = true,
    ...props
}: CardProps<C>) {
    const Component = as || "div";
    return (
        <Component
            className={cn(
                "bg-[var(--card)] backdrop-blur-md border border-[var(--card-border)] rounded-3xl p-6 transition-all duration-300",
                hoverEffect && "hover:-translate-y-1 hover:shadow-xl hover:border-[var(--primary)]",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}
