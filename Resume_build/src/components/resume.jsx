import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Adjust the path if necessary

export default function Resume({ resumeData }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container relative">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - 75% */}
        <div className="md:w-3/4 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{resumeData.personalInfo.name}</h1>
            <p className="text-xl text-gray-900">{resumeData.personalInfo.title}</p>
            <div>
              <h2 className="font-semibold">About Me</h2>
              <p>
                {resumeData.aboutMe}
              </p>
            </div>
          </div>
          {/* Experience */}
          <div>
            <h2 className="font-semibold">Experience</h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index}>
                <h3 className="font-semibold">{exp.title} - {exp.company}</h3>
                <p className="text-sm text-gray-900">{exp.duration}</p>
                <ul className="list-disc list-inside mt-2">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
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
                <h3 className="font-semibold">{project.title}</h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
          {/* Academics */}
          <div>
            <h2 className="font-semibold">Academics</h2>
            {resumeData.academics.map((education, index) => (
              <div key={index}>
                <h3 className="font-semibold">{education.degree}</h3>
                <p className="text-sm text-gray-900">{education.institution} - {education.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - 25% */}
        <div className="md:w-1/4 space-y-6">
          {/* Contact & Social */}
          <div>
            <h2 className="font-semibold">Contact & Social</h2>
            <div className="space-y-2">
              {resumeData.contact.map((contact, index) => (
                <a
                  key={index}
                  href={
                    contact.type === "email"
                      ? `mailto:${contact.value}`
                      : contact.value
                  }
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  {contact.type === "email" && <Mail className="w-4 h-4" />}
                  {contact.type === "linkedin" && <Linkedin className="w-4 h-4" />}
                  {contact.type === "github" && <Github className="w-4 h-4" />}
                  {contact.value}
                </a>
              ))}
            </div>
          </div>
          {/* Skills */}
          <div>
            <h2 className="font-semibold">Skills</h2>
            <div className="grid grid-cols-2 gap-2">
              {resumeData.skills.map((skill, index) => (
                <li key={index} className="skill-item text-gray-800">
                  {skill}</li>
              ))}
            </div>
          </div>
          {/* Awards & Certifications */}
          <div>
            <h2 className="font-semibold">Awards & Certifications</h2>
            {resumeData.awards.map((award, index) => (
              <div key={index}>
                <h3 className="font-semibold">{award.title}</h3>
                <p className="text-sm text-gray-900">{award.year}</p>
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
          /* Ensure two-column layout is maintained on print */
          .container {
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .flex {
            display: flex;
            flex-direction: row;
          }
          .md\\:w-3\\/4, .md\\:w-1\\/4 {
            width: 75%;
            width: 25%;
          }
          /* Prevent page breaks inside sections */
          h1, h2, h3, p, ul, div {
            page-break-inside: avoid;
          }
          /* Adjust font sizes and layout for printing */
          h1 {
            font-size: 24pt;
          }
          h2 {
            font-size: 18pt;
          }
          p, li {
            font-size: 12pt;
          }
          /* Hide print button on print */
          .print:hidden {
            display: none;
          }
          /* Fix unwanted headers (like date and time) from showing */
          @page {
            margin: 0;
          }
          /* Ensure skills align properly */
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
