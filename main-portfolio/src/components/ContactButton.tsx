const CONTACT_HREF = "mailto:jj794001@gmail.com";

/** Gradient pill CTA with the inset glow and inner white outline. */
export default function ContactButton() {
  return (
    <a
      href={CONTACT_HREF}
      className="inline-block rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-opacity duration-200 hover:opacity-90 sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        background:
          "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        boxShadow:
          "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
        outline: "2px solid #FFFFFF",
        outlineOffset: "-3px",
      }}
    >
      Contact Me
    </a>
  );
}
