import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Resume from './components/resume.jsx'; 
import { Github, Linkedin, Mail, Phone } from 'lucide-react'; 

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Resume /> {/* Use the Resume component */}

     
      
      
      
          
    </div>
      
  );
}

export default App;
