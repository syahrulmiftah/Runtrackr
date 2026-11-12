import React from 'react';

/**
 * Global Decorative Background Element (Figma Reference):
 * - Shape: Ellipse
 * - Fill: White (#FFFFFF)
 * - Width: 300px, Height: 32px
 * - Horizontal position: Centered relative to the page
 * - Vertical position: -24px from top
 * - Positioning: Absolute, -z-10, pointer-events-none
 * - Effect: Soft, subtle diffused glow reproducing Figma's 200px layer blur
 */
export const DecorativeBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-[24px] left-1/2 -translate-x-1/2 -z-10 overflow-visible flex items-center justify-center select-none"
      style={{
        width: '300px',
        height: '32px',
      }}
    >
      {/* Diffused elliptical white glow reproducing Figma's 200px layer blur on white ellipse */}
      <div
        className="w-[300px] h-[32px] rounded-[50%]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.22) 40%, rgba(255, 255, 255, 0) 75%)',
          filter: 'blur(35px)',
          transform: 'scale(1.15)',
        }}
      />
    </div>
  );
};
