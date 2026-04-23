export default function DripText({ children }) {
  return (
    <div style={{
      position: "relative",
      display: "inline-block",
      fontFamily: "var(--font-display)",
      fontSize: "72px",
      color: "var(--white)",
      textShadow: "4px 4px 0 var(--red)",
    }}>
      {children}

      {/* efeito de tinta escorrendo */}
      {[20, 45, 70, 85].map((left, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${left}%`,
            top: "100%",
            width: "4px",
            height: `${12 + i * 6}px`,
            background: "var(--red)",
            borderRadius: "0 0 4px 4px",
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
}