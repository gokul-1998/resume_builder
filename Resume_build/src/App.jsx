import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Resume from './components/resume.jsx'; 
import { Github, Linkedin, Mail, Phone } from 'lucide-react'; 
import ResumeForm from './components/ResumeForm.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      {/* <Resume /> Use the Resume component */}
      <ResumeForm />
     
      
      
      
          
    </div>
      
  );
}

export default App;
