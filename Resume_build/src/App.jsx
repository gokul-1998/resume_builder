import { useState } from 'react';

import './App.css';
// import Resume from './components/resume.jsx'; 
import ResumeForm from './components/ResumeForm1.jsx';
import Resume from './components/resume1.jsx';

// to import the  data from json file
import data from './resumeData1.json';

function App() {
  const [count, setCount] = useState(0);
  console.log(data);
  console.log("Aaaaaaaaaaa");

  return (
    <div className="App">
      <Resume resumeData={data} /> 
      <br />
      <ResumeForm />
     
      
      
      
          
    </div>
      
  );
}

export default App;
