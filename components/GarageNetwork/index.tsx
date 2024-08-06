import React from "react";
interface GarageNetworkIconProps {
  size: number;
  className: string;
}
export const GarageNetworkIcon: React.FC<GarageNetworkIconProps> = ({
  size,
  className,
}) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 512 512"
      height={size}
      width={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        stroke-miterlimit="10"
        stroke-width="32"
        d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48z"
      ></path>
      <path
        fill="none"
        stroke-miterlimit="10"
        stroke-width="32"
        d="M256 48c-58.07 0-112.67 93.13-112.67 208S197.93 464 256 464s112.67-93.13 112.67-208S314.07 48 256 48z"
      ></path>
      <path
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="M117.33 117.33c38.24 27.15 86.38 43.34 138.67 43.34s100.43-16.19 138.67-43.34m0 277.34c-38.24-27.15-86.38-43.34-138.67-43.34s-100.43 16.19-138.67 43.34"
      ></path>
      <path
        fill="none"
        stroke-miterlimit="10"
        stroke-width="32"
        d="M256 48v416m208-208H48"
      ></path>
    </svg>
  );
};

export default GarageNetworkIcon;
