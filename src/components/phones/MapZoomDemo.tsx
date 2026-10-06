export default function MapZoomDemo({ src, mask }: { src: string; mask: string }) {
  return (
    <div
      aria-hidden
      style={{ maskImage: `url(${mask})`, WebkitMaskImage: `url(${mask})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
      className="pointer-events-none absolute inset-0"
    >
      <div
        style={{ backgroundImage: `url(${src})` }}
        className="absolute inset-0 origin-[52%_42%] bg-[length:100%_100%] motion-safe:animate-map-zoom"
      />
    </div>
  );
}
