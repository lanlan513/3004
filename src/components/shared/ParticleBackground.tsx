export default function ParticleBackground() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 10 + 15,
    color: Math.random() > 0.5 ? "cyan" : "pink",
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-float"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              backgroundColor:
                p.color === "cyan"
                  ? "rgba(0, 240, 255, 0.4)"
                  : "rgba(255, 0, 170, 0.4)",
              boxShadow:
                p.color === "cyan"
                  ? "0 0 6px rgba(0, 240, 255, 0.6)"
                  : "0 0 6px rgba(255, 0, 170, 0.6)",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
      <div
        className="absolute left-0 w-full h-32 animate-scan"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0, 240, 255, 0.1) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
