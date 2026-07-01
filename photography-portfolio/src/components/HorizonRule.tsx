export function HorizonRule({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`h-px w-full bg-alpenglow/60 ${className}`} />;
}
