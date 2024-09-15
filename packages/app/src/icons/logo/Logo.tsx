import * as React from 'react';
import type { SVGProps } from 'react';

export const SvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 100 100"
    style={{
      color: 'inherit',
      ...props.style,
    }}
  >
    <g clipPath="url(#clip0_1128_533)">
      <path
        d="M48.4375 63.1524C41.1737 63.1524 35.2852 57.2639 35.2852 50C35.2852 42.7362 41.1737 36.8477 48.4375 36.8477C55.7013 36.8477 61.5898 42.7362 61.5898 50C61.5898 57.2639 55.7013 63.1524 48.4375 63.1524Z"
        stroke="currentColor"
        strokeWidth="6.50781"
      />
      <path
        d="M64.8437 25.7812L80.4688 50.3906L64.8437 75"
        stroke="currentColor"
        strokeWidth="6.51042"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M78.125 50H64.8438"
        stroke="currentColor"
        strokeWidth="6.51042"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.0313 50H18.75"
        stroke="currentColor"
        strokeWidth="6.51042"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 49.7396C18.75 67.7176 33.3333 82.2917 51.3021 82.2917C33.3241 82.2917 18.75 67.7176 18.75 49.7396ZM18.75 49.7396C18.75 31.7616 33.3241 17.1875 51.3021 17.1875C33.3333 17.1875 18.75 31.7616 18.75 49.7396Z"
        stroke="currentColor"
        strokeWidth="6.51042"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1128_533">
        <rect width="100" height="100" fill="currentColor" />
      </clipPath>
    </defs>
  </svg>
);