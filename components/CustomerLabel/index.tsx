import Image from 'next/image';
import React from 'react';

interface Props{
    children: React.ReactNode
    image: string
}

const CustomLabel:React.FC<Props> = ({ children, image }) => {
    // Customize the label rendering here
    return (
        <div className=' flex p-1 bg-secondary-50 justify-between pr-2 pl-2 rounded-sm w-4/5'>
            <Image src={image} width={20} height={20} alt='label-image' />
            { children }
        </div>
    );
};

export default CustomLabel;
