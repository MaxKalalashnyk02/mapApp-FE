export default function MapZoomDemo({ src }: { src: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 [mask-image:url(/screens/map-zoom-mask.png)] [mask-size:100%_100%]"
    >
      <div
        style={{ backgroundImage: `url(${src})` }}
        className="absolute inset-0 origin-[52%_42%] bg-[length:100%_100%] motion-safe:animate-map-zoom"
      />
    </div>
  );
}
