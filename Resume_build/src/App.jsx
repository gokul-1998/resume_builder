import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
// import Resume from './components/resume.jsx'; 
import { Github, Linkedin, Mail, Phone } from 'lucide-react'; 
import ResumeForm from './components/ResumeForm.jsx';
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
      <ResumeForm />
     
      
      
      
          
    </div>
      
  );
}

export default App;
