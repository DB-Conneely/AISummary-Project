// summary-project/src/frontend/src/components/Background.js
// Component for creating a dynamic, animated background for the application.

// Background component takes 'children' as a prop, allowing other components to be rendered on top of it.
function Background({ children }) {
  return (
    // Main container for the background, setting minimum height and hiding overflow.
    <div className="min-h-screen relative overflow-hidden">
      {/* Primary radial gradient background layer. */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, rgba(10, 18, 38, 1) 80%)
          `,
        }}
      />
      {/* Animated radial gradient for a pulsing effect. */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.2), transparent 50%)
          `,
          animation: 'pulse 30s ease-in-out infinite', // Applies the 'pulse' animation.
          filter: 'blur(50px)', // Applies a blur effect.
        }}
      />
      {/* First animated linear gradient for a 'tendril' effect. */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            linear-gradient(
              60deg,
              transparent,
              rgba(43, 78, 161, 0.1) 30%,
              transparent 60%
            )
          `,
          backgroundSize: '200% 200%', // Allows the background to be larger than the container for animation.
          animation: 'tendril1 40s linear infinite', // Applies the 'tendril1' animation.
          filter: 'blur(30px)', // Applies a blur effect.
        }}
      />
      {/* Second animated linear gradient for a 'tendril' effect, moving in reverse. */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            linear-gradient(
              120deg,
              transparent,
              rgba(30, 58, 138, 0.1) 30%,
              transparent 60%
            )
          `,
          backgroundSize: '200% 200%', // Allows the background to be larger than the container for animation.
          animation: 'tendril2 50s linear infinite reverse', // Applies 'tendril2' animation in reverse.
          filter: 'blur(40px)', // Applies a blur effect.
        }}
      />
      {/* Animated radial gradient for a subtle shimmering effect. */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 70% 20%, rgba(42, 54, 95, 0.05), transparent 50%)
          `,
          animation: 'shimmer 20s ease-in-out infinite', // Applies the 'shimmer' animation.
          filter: 'blur(20px)', // Applies a blur effect.
        }}
      />
      {/* Content area, positioned above the background layers using z-index. */}
      <div className="relative z-10">{children}</div>

      {/* Inline style block for keyframe animations.
          These animations are defined directly within the component and are critical for the background effects. */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.5; transform: scale(1); }
          }
          @keyframes tendril1 {
            0% { background-position: 0% 50%; transform: translate(0, 0); }
            100% { background-position: 200% 50%; transform: translate(10%, 10%); }
          }
          @keyframes tendril2 {
            0% { background-position: 200% 50%; transform: translate(0, 0); }
            100% { background-position: 0% 50%; transform: translate(-10%, -10%); }
          }
          @keyframes shimmer {
            0% { opacity: 0.3; }
            50% { opacity: 0.8; }
            100% { opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
}

// Export the Background component as the default export.
export default Background;