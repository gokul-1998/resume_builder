import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import resumeData from '../components/resumeData.json'; // Adjust the path if necessary

export default function Resume() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container relative">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - 75% */}
        <div className="md:w-3/4 space-y-6">
          {/* Personal Info */}
          <div>
            <h1 className="text-2xl font-bold">{resumeData.personalInfo.name}</h1>
            <p className="text-lg text-gray-900">{resumeData.personalInfo.title}</p>
          </div>

          {/* About Me */}
          <div>
            <h2 className="font-semibold">About Me</h2>
            <p>{resumeData.aboutMe}</p>
          </div>

          {/* Experience */}
          <div>
            <h2 className="font-semibold">Experience</h2>
            {resumeData.experience.map((job, index) => (
              <div key={index}>
                <h3 className="font-semibold">{job.role} - {job.company}</h3>
                <p className="text-sm text-gray-900">{job.duration}</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div>
            <h2 className="font-semibold">Projects</h2>
            {resumeData.projects.map((project, index) => (
              <div key={index}>
                <h3 className="font-semibold">{project.name}</h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>

          {/* Academics */}
          <div>
            <h2 className="font-semibold">Academics</h2>
            {resumeData.academics.map((degree, index) => (
              <div key={index}>
                <h3 className="font-semibold">{degree.degree}</h3>
                <p className="text-sm text-gray-900">{degree.institution} - {degree.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - 25% */}
        <div className="md:w-1/4 space-y-6">
          {/* Contact & Social */}
          <div>
            <h2 className="font-semibold">Contact & Social</h2>
            <div className="space-y-1">
              <a href={`mailto:${resumeData.personalInfo.contact.email}`} className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="w-4 h-4" /> {resumeData.personalInfo.contact.email}
              </a>
              <a href={`tel:${resumeData.personalInfo.contact.phone}`} className="flex items-center gap-2 text-primary hover:underline">
                <Phone className="w-4 h-4" /> {resumeData.personalInfo.contact.phone}
              </a>
              <a href={resumeData.personalInfo.contact.github} className="flex items-center gap-2 text-primary hover:underline">
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a href={resumeData.personalInfo.contact.linkedin} className="flex items-center gap-2 text-primary hover:underline">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="font-semibold">Skills</h2>
            <ul className="grid grid-cols-2 gap-2">
              {resumeData.skills.map((skill, index) => (
                <li key={index} className="skill-item text-gray-800">{skill}</li>
              ))}
            </ul>
          </div>

          {/* Awards & Certifications */}
          <div>
            <h2 className="font-semibold">Awards & Certifications</h2>
            {resumeData.awardsAndCertifications.map((award, index) => (
              <div key={index}>
                <h3 className="font-semibold">{award.name}</h3>
                <p className="text-sm text-gray-900">{award.issuer ? `${award.issuer}, ` : ''}{award.year}</p>
              </div>
            ))}
          </div>

          {/* Print button */}
          <div className="mt-4 print:hidden">
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
            >
              Print Resume
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body, html {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            height: auto;
          }

          .container {
            width: 100%;
            margin: 0;
            padding: 0;
          }

          .flex {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }

          .md\\:w-3\\/4 {
            width: 75%;
          }

          .md\\:w-1\\/4 {
            width: 25%;
          }

          /* Prevent page breaks inside sections */
          h1, h2, h3, p, ul, div {
            page-break-inside: avoid;
          }

          /* Adjust font sizes for printing */
          h1 {
            font-size: 20pt;
          }

          h2 {
            font-size: 14pt;
          }

          p, li {
            font-size: 10pt;
          }

          /* Hide print button and unwanted elements */
          .print\\:hidden {
            display: none;
          }

          header, footer, .no-print {
            display: none !important;
          }

          /* Adjust spacing for print */
          .space-y-6 > *:not(:first-child) {
            margin-top: 0.75rem; /* Adjusted for more uniform spacing */
          }

          .space-y-1 > *:not(:first-child) {
            margin-top: 0.25rem; /* Adjusted for more uniform spacing */
          }

          /* Skills list adjustment */
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem; /* Adjust gap if needed */
          }

          /* Prevent icon overflow */
          .flex .w-4, .flex .h-4 {
            max-width: 20px;
            max-height: 20px;
            overflow: hidden;
          }

          /* Fix page overflow */
          .container {
            overflow: hidden;
          }

          /* Adjust page margins */
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}
