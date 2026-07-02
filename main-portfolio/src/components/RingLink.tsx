type RingLinkProps = {
  href: string;
  /** classes for the inner pill: padding, colors, text size */
  className?: string;
  /** classes for the outer anchor: visibility, scale-on-hover */
  wrapperClassName?: string;
  external?: boolean;
  children: React.ReactNode;
};

/** Pill link that reveals an animated gradient border ring on hover. */
export default function RingLink({
  href,
  className = "",
  wrapperClassName = "",
  external = false,
  children,
}: RingLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group relative inline-flex items-center justify-center rounded-full ${wrapperClassName}`}
    >
      <span
        aria-hidden
        className="animate-gradient-shift pointer-events-none absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        className={`relative inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 ${className}`}
      >
        {children}
      </span>
    </a>
  );
}
