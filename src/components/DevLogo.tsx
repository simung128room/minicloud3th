import React from 'react';

interface DevLogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  variant?: 'svg' | 'image';
  withText?: boolean;
}

export const DevLogo: React.FC<DevLogoProps> = ({
  className = "h-8 w-auto",
  height,
  width,
  variant = 'svg',
  withText = false,
}) => {
  if (variant === 'image') {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <img
          src="/logo.png"
          alt="DEV Logo"
          referrerPolicy="no-referrer"
          className="h-full w-auto object-contain rounded-md"
          style={{ height, width }}
        />
        {withText && (
          <span className="font-black text-xl tracking-tighter text-white">
            DEV
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 1000 550"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-h-12 drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)] transition-transform duration-200 group-hover:scale-105"
        style={{ height, width }}
      >
        {/* Letter D */}
        <path
          d="M 45 520 L 195 155 L 360 300 L 315 480 L 175 470 L 165 500 Z M 165 270 L 105 460 L 225 440 L 275 340 Z"
          fill="currentColor"
          fillRule="evenodd"
        />
        {/* Letter E */}
        <path
          d="M 380 340 L 610 215 L 585 285 L 435 365 Z M 370 385 L 570 330 L 555 395 L 410 415 Z M 325 490 L 525 490 L 510 440 L 330 440 Z M 330 440 L 380 340 L 350 335 L 305 450 Z"
          fill="currentColor"
        />
        {/* Letter V */}
        <path
          d="M 605 270 L 640 495 L 975 145 L 820 210 L 660 395 L 675 285 Z"
          fill="currentColor"
        />
      </svg>
      {withText && (
        <span className="font-black text-xl tracking-tighter text-white">
          DEV
        </span>
      )}
    </div>
  );
};

export default DevLogo;
