import React from 'react'
import Resume from './resume1'
import ResumeForm from './ResumeForm1'
import PrintButton from './PrintButton';

const NewResume = () => {
    const [data, setData] = React.useState({});
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
<PrintButton />
</div>
  )
}

export default NewResume