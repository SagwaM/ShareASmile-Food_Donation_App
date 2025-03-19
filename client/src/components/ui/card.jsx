import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", 
        "bg-white dark:bg-gray-800 text-black dark:text-white", // Ensure it adapts to dark mode
        className)}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef(function CardHeader({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", "rounded-lg border bg-card text-card-foreground shadow-sm",
  "bg-white dark:bg-gray-800 text-black dark:text-white",
  "transition-all duration-300 ease-in-out", className)} {...props} />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(function CardTitle({ className, ...props }, ref) {
  return (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", "rounded-lg border bg-card text-card-foreground shadow-sm",
  "bg-white dark:bg-gray-800 text-black dark:text-white",
  "transition-all duration-300 ease-in-out", className)} {...props} />
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(function CardDescription({ className, ...props }, ref) {
  return (
    <p ref={ref} className={cn("text-sm text-muted-foreground", "rounded-lg border bg-card text-card-foreground shadow-sm",
  "bg-white dark:bg-gray-800 text-black dark:text-white",
  "transition-all duration-300 ease-in-out",className)} {...props} />
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(function CardContent({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("p-6 pt-0", "rounded-lg border bg-card text-card-foreground shadow-sm",
  "bg-white dark:bg-gray-800 text-black dark:text-white",
  "transition-all duration-300 ease-in-out",className)} {...props} />
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(function CardFooter({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", "rounded-lg border bg-card text-card-foreground shadow-sm",
  "bg-white dark:bg-gray-800 text-black dark:text-white",
  "transition-all duration-300 ease-in-out", className)} {...props} />
  );
});
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
