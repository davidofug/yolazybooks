import React from "react";

// garage icon props
interface CustomerIconProps {
  size: number;
  className: "string";
}

export const CustomerIcon: React.FC<CustomerIconProps> = ({
  size,
  className
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 30 30"
      className={className}
    >
      <path
        d="M11.8185 11.25C12.5745 10.335 13.719 9.75 15 9.75C16.281 9.75 17.4255 10.335 18.1815 11.25C18.6792 11.8535 18.9951 12.586 19.0923 13.3622C19.1895 14.1384 19.0639 14.9262 18.7304 15.6338C18.3968 16.3413 17.8689 16.9394 17.2082 17.3583C16.5476 17.7772 15.7815 17.9997 14.9993 17.9997C14.217 17.9997 13.4509 17.7772 12.7903 17.3583C12.1296 16.9394 11.6017 16.3413 11.2681 15.6338C10.9345 14.9262 10.809 14.1384 10.9062 13.3622C11.0034 12.586 11.3193 11.8535 11.817 11.25H11.8185ZM20.625 13.875C20.625 12.927 20.391 12.033 19.977 11.25H26.25C26.8467 11.25 27.419 11.4871 27.841 11.909C28.2629 12.331 28.5 12.9033 28.5 13.5V14.25C28.5 16.6305 26.691 19.068 23.5275 19.926C23.2024 19.342 22.7271 18.8555 22.1509 18.5169C21.5746 18.1783 20.9184 17.9998 20.25 18H18.825C19.3935 17.4739 19.847 16.8359 20.1568 16.1259C20.4666 15.416 20.626 14.6496 20.625 13.875ZM20.25 19.5C20.5457 19.4992 20.8386 19.5569 21.112 19.6697C21.3853 19.7825 21.6337 19.9482 21.8428 20.1572C22.0518 20.3663 22.2175 20.6147 22.3303 20.888C22.4431 21.1614 22.5008 21.4543 22.5 21.75V22.5C22.5 25.4565 19.71 28.5 15 28.5C10.29 28.5 7.5 25.4565 7.5 22.5V21.75C7.49921 21.4543 7.55687 21.1614 7.66966 20.888C7.78245 20.6147 7.94815 20.3663 8.15724 20.1572C8.36633 19.9482 8.61469 19.7825 8.88803 19.6697C9.16137 19.5569 9.4543 19.4992 9.75 19.5H20.25ZM1.5 14.25C1.5 16.6305 3.309 19.068 6.4725 19.926C6.7976 19.342 7.27287 18.8555 7.84911 18.5169C8.42535 18.1783 9.08163 17.9998 9.75 18H11.175C10.6065 17.4739 10.153 16.8359 9.84321 16.1259C9.53342 15.416 9.374 14.6496 9.375 13.875C9.375 12.927 9.609 12.033 10.0245 11.25H3.75C3.15326 11.25 2.58097 11.4871 2.15901 11.909C1.73705 12.331 1.5 12.9033 1.5 13.5V14.25ZM13.125 5.625C13.125 4.53098 12.6904 3.48177 11.9168 2.70818C11.1432 1.9346 10.094 1.5 9 1.5C7.90598 1.5 6.85677 1.9346 6.08318 2.70818C5.3096 3.48177 4.875 4.53098 4.875 5.625C4.875 6.71902 5.3096 7.76823 6.08318 8.54182C6.85677 9.3154 7.90598 9.75 9 9.75C10.094 9.75 11.1432 9.3154 11.9168 8.54182C12.6904 7.76823 13.125 6.71902 13.125 5.625ZM25.125 5.625C25.125 4.53098 24.6904 3.48177 23.9168 2.70818C23.1432 1.9346 22.094 1.5 21 1.5C19.906 1.5 18.8568 1.9346 18.0832 2.70818C17.3096 3.48177 16.875 4.53098 16.875 5.625C16.875 6.71902 17.3096 7.76823 18.0832 8.54182C18.8568 9.3154 19.906 9.75 21 9.75C22.094 9.75 23.1432 9.3154 23.9168 8.54182C24.6904 7.76823 25.125 6.71902 25.125 5.625Z"
      />
    </svg>
  );
};