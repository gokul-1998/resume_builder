import { useState, useEffect } from 'react';

export default function Resume({ resumeData }) {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const adjustFontSize = () => {
      const content = document.getElementById('resume-content');
      if (content) {
        let currentFontSize = fontSize;
        while (content.scrollHeight > content.clientHeight && currentFontSize > 8) {
          currentFontSize -= 0.5;
          setFontSize(currentFontSize);
        }
      }
    };

    adjustFontSize();
  }, [fontSize]);

  if (!resumeData) return <div>Loading...</div>;

  return (
    <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-lg p-8 box-border overflow-hidden">
      {/* Main content container using grid */}
      <div id="resume-content" className="grid grid-cols-3 gap-6 h-full" style={{ fontSize: `${fontSize}px` }}>
        
        {/* Left column for main content */}
        <div className="col-span-2 flex flex-col">
          <header className="mb-4">
            <h1 className="text-3xl font-bold">{resumeData.personalInfo.name}</h1>
            <h2 className="text-xl text-gray-600">{resumeData.personalInfo.title}</h2>
          </header>

          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">About Me</h3>
            <p className="text-sm">{resumeData.aboutMe}</p>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Experience</h3>
            <div className="grid gap-2">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
                  <h4 className="font-medium">{exp.title}</h4>
                  <p className="text-sm">{exp.company} | {exp.duration}</p>
                  <ul className="list-disc list-inside text-sm">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Projects</h3>
            <div className="grid gap-2">
              {resumeData.projects.map((project, index) => (
                <div key={index}>
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm">{project.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Education</h3>
            <div className="grid gap-2">
              {resumeData.academics
                .filter((academic, index, self) =>
                  index === self.findIndex((a) => a.degree === academic.degree && a.year === academic.year)
                )
                .map((academic, index) => (
                  <div key={index}>
                    <h4 className="font-medium">{academic.degree}</h4>
                    <p className="text-sm">{academic.institution} | {academic.year}</p>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Right column for contact, skills, and awards */}
        <div className="col-span-1 flex flex-col">
          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.contact.map((item, index) => (
                <span key={index} className="text-sm">
                  {item.type}: {item.value}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="mb-2">
              <h4 className="font-medium">Architectures</h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.Architectures.map((skill, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <h4 className="font-medium">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.Languages.map((language, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {language}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <h4 className="font-medium">Frameworks</h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.Frameworks.map((framework, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {framework}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Awards</h3>
            <div className="grid gap-2">
              {resumeData.awards_and_certifications.map((award, index) => (
                <div key={index}>
                  <h4 className="font-medium">{award.title}</h4>
                  <p className="text-sm">{award.organization && `${award.organization} | `}{award.year}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <style jsx>{`
        @media print {
          .print:hidden {
            display: none;
          }
          @page {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
