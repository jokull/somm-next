import { type SVGAttributes } from "react";

export function LoadingSpinner({
  className,
  ...props
}: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      className={`animate-spin ${className ?? ""}`}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.3788 5.52024C14.3313 4.26247 12.876 3.41157 11.2662 3.11548C9.65631 2.8194 7.99358 3.09685 6.56707 3.8996C5.14056 4.70235 4.04047 5.97963 3.45807 7.50939C2.87567 9.03914 2.84778 10.7246 3.37925 12.2728C3.91072 13.821 4.96795 15.134 6.36712 15.9835C7.7663 16.833 9.41893 17.1653 11.0377 16.9226C12.6565 16.68 14.1391 15.8777 15.2276 14.6553"
        stroke="url(#paint0_angular_1246_75114)"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <defs>
        <radialGradient
          cx="0"
          cy="0"
          gradientTransform="translate(9.1894 10) rotate(88.76) scale(10.5025 9.28627)"
          gradientUnits="userSpaceOnUse"
          id="paint0_angular_1246_75114"
          r="1"
        >
          <stop offset="0.660833" stopColor="currentColor" />
          <stop offset="0.836362" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
