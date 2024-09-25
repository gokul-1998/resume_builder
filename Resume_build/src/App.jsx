import { useState } from 'react';
import './App.css'; // If you still need this for other styles
import ResumeForm from './components/ResumeForm1.jsx';
import Resume from './components/resume1.jsx';
import PrintButton from './components/PrintButton.jsx';
import data from './resumeData1.json';

function App() {
  const [count, setCount] = useState(0);
  const data = JSON.parse(localStorage.getItem("resumeFormData"));

  return (
    <div className="App">
      <div className="flex flex-row h-screen">
        {/* Resume on the left */}
        <div className="w-1/2 bg-gray-100 p-4">
          <Resume resumeData={data} />
        </div>

        {/* Form on the right, hidden during print */}
        <div className="w-1/2 bg-white p-4 hide-on-print">
          <ResumeForm />
        </div>
      </div>
    </div>
  );
}

export default App;
