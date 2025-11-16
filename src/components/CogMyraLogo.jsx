// src/components/CogMyraLogo.jsx

export default function CogMyraLogo({ size = 28, weight = 600 }) {
  const baseStyle = {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeight: weight,
    letterSpacing: "0.16em",
    fontSize: size,
    lineHeight: 1,
    display: "inline-flex",
    alignItems: "center",
    textTransform: "uppercase",
  };

  return (
    <span style={baseStyle}>
      {/* “Cog” in charcoal blue, “Myra” in muted teal */}
      <span style={{ color: "#3E505B" }}>Cog</span>
      <span
        style={{
          fontWeight: Math.min(weight + 100, 800),
          color: "#8AB0AB",
          marginLeft: 4,
        }}
      >
        Myra
      </span>
    </span>
  );
}
