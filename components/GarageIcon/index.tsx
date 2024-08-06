import React from "react";

// garage icon props
interface GarageIconProps {
  size: number;
  className: string;
}

export const GarageIcon: React.FC<GarageIconProps> = ({ size, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M12.9998 2.03V4.05C17.3898 4.59 20.4998 8.58 19.9598 12.97C19.4998 16.61 16.6398 19.5 12.9998 19.93V21.93C18.4998 21.38 22.4998 16.5 21.9498 11C21.4998 6.25 17.7298 2.5 12.9998 2.03ZM10.9998 2.06C9.0498 2.25 7.1898 3 5.6698 4.26L7.0998 5.74C8.2198 4.84 9.5698 4.26 10.9998 4.06V2.06ZM4.2598 5.67C3.00946 7.18734 2.24001 9.04308 2.0498 11H4.0498C4.2398 9.58 4.7998 8.23 5.6898 7.1L4.2598 5.67ZM2.0598 13C2.2598 14.96 3.0298 16.81 4.2698 18.33L5.6898 16.9C4.80673 15.7696 4.24376 14.4226 4.0598 13H2.0598ZM7.0998 18.37L5.6698 19.74C7.18458 21.0027 9.03907 21.789 10.9998 22V20C9.57721 19.816 8.23021 19.2531 7.0998 18.37ZM16.8198 15.19L12.7098 11.08C13.1198 10.04 12.8898 8.82 12.0298 7.97C11.1298 7.06 9.7798 6.88 8.6898 7.38L10.6298 9.32L9.2798 10.68L7.2898 8.73C6.7498 9.82 6.9998 11.17 7.8798 12.08C8.7398 12.94 9.9598 13.16 10.9998 12.76L15.1098 16.86C15.2898 17.05 15.5598 17.05 15.7398 16.86L16.7798 15.83C16.9998 15.65 16.9998 15.33 16.8198 15.19Z"
      />
    </svg>
  );
};