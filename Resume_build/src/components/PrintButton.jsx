import React from 'react';

const PrintButton = () => {
    const handlePrint = () => {
        window.print();
    };
    
    return (
        <div className="print:hidden">
            <button
                onClick={handlePrint}
                className="fixed top-40 right-20 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 shadow-lg z-50"
            >
                Print Resume
            </button>
        </div>
    );
};

export default PrintButton;
