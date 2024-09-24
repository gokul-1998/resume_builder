import React from 'react';

const PrintButton = () => {
    const handlePrint = () => {
        window.print();
    };
    
    return (
        <div className="mt-4 flex justify-center print:hidden">
            <button
                onClick={handlePrint}
                className="sticky top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Print Resume
            </button>
        </div>
    );
};

export default PrintButton;
