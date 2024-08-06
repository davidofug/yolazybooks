import React from 'react';

interface ButtonProps{
    buttonName: string,
    handleButton(): any;
}

const FloatingButton: React.FC<ButtonProps> = ({
    buttonName,
    handleButton
}) => {
    return (
        <div className="fixed bottom-4 right-4">
            <button className="px-4 py-2 font-bold text-white rounded-full shadow-lg bg-primary-500 hover:bg-primary-600" onClick={handleButton}>
                {buttonName}
            </button>
        </div>
    )
}


export default FloatingButton;