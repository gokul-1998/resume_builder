import React from 'react';

const PrintButton = () => {
    
          
    const handlePrint = () => {
        window.print();
        // the browser to display the standard print window, giving the user the option to either print the page or save it as a PDF.




        
    };
    
    return (
        <div className="print:hidden">
            <button
                onClick={handlePrint}
                className="fixed top-40 right-20 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 shadow-lg z-50"
                // these are Tailwind CSS classes 
            >
                Print Resume
            </button>
        </div>
    );
};

export default PrintButton;
