import { useState, useEffect } from 'react';

export default function Resume({ resumeData }) {
  const [fontSize, setFontSize] = useState(16);
  const [interestFontSize, setInterestFontSize] = useState(14); // Font size for interests

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

    const adjustInterestFontSize = () => {
      const interestsSection = document.getElementById('interests-section');
      if (interestsSection) {
        let currentFontSize = interestFontSize;
        while (interestsSection.scrollHeight > interestsSection.clientHeight && currentFontSize > 8) {
          currentFontSize -= 0.5;
          setInterestFontSize(currentFontSize);
        }
      }
    };

    adjustFontSize();
    adjustInterestFontSize();
  }, [fontSize, interestFontSize]);

  if (!resumeData) return <div>Loading...</div>;

  return (
    <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-lg p-8 box-border overflow-hidden">
      {/* Main content container using grid */}
      <div id="resume-content" className="grid grid-cols-3 gap-6 h-full" style={{ fontSize: `${fontSize}px` }}>
        
        {/* Left column for main content */}
        <div className="col-span-2 flex flex-col">
          <header className="mb-1">
            <h1 className="text-3xl font-bold">{resumeData.personalInfo.name}</h1>
            <h2 className="text-xl text-gray-600">{resumeData.personalInfo.title}</h2>
          </header>

          <section className="mb-1">
            <h3 className="text-lg font-semibold mb-1">About Me</h3>
            <p className="text-sm">{resumeData.aboutMe}</p>
          </section>

          <section className="mb-1">
            <h3 className="text-lg font-semibold mb-1">Experience</h3>
            <div className="grid gap-1">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-sm">{exp.title}</h4>
                  <p className="text-sm font-semibold">{exp.company} | {exp.duration}</p>
                  <ul className="list-disc list-inside text-sm">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-1">
            <h3 className="text-lg font-semibold mb-1">Projects</h3>
            <div className="grid gap-1">
              {resumeData.projects.map((project, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-base">{project.title}</h4>
                  <p className="text-sm">{project.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-1">
            <h3 className="text-lg font-semibold mb-1">Education</h3>
            <div className="grid gap-1">
              {resumeData.academics
                .filter((academic, index, self) =>
                  index === self.findIndex((a) => a.degree === academic.degree && a.year === academic.year)
                )
                .map((academic, index) => (
                  <div key={index}>
                    <h4 className="text-sm font-semibold">{academic.degree}</h4>
                    <p className="text-sm">{academic.institution} | {academic.year}</p>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Right column for contact, skills, awards, and interests */}
        <div className="col-span-1 flex flex-col">
          <section className="mb-1">
            <h3 className="text-lg font-semibold mb-1">Contact</h3>
            <div className="flex flex-wrap gap-1">
              {resumeData.contact.map((item, index) => (
                <span key={index} className="text-sm">
                  {item.type}: {item.value}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-1">
            <h3 className="text-lg font-semibold mb-1">Skills</h3>
            <div className="mb-1">
              <h4 className="font-medium text-base">Architectures</h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.Architectures.map((skill, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-1">
              <h4 className="font-medium text-base">Cloud</h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.cloud.map((language, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {language}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-1">
              <h4 className="font-medium text-base">Languages</h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.Languages.map((language, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {language}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-1">
              <h4 className="font-medium text-base">Frameworks</h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.Frameworks.map((framework, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {framework}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-1">
              <h4 className="font-medium text-base"> Libraries</h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.libraries.map((language, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {language}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-1">
              <h4 className="font-medium text-base"> Database</h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.databases.map((language, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {language}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-1">
              <h4 className="font-medium text-base"> Tools</h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.tools.map((language, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {language}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-1">
              <h4 className="font-medium text-base"> Tools</h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.others.map((language, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-1">
            <h3 className="text-lg font-semibold mb-1">Awards</h3>
            <div className="grid gap-1">
              {resumeData.awards_and_certifications.map((award, index) => (
                <div key={index}>
                  <h4 className="font-medium text-base">{award.title}</h4>
                  <p className="text-sm">{award.organization && `${award.organization} | `}{award.year}</p>
                </div>
              ))}
            </div>
          </section>

          {/* New Interests Section */}
          <section id="interests-section" className="mb-1">
            <h3 className="text-sm font-semibold mb-1">Interests</h3>
            <div className="flex flex-wrap gap-1">
              {resumeData.interests.map((interest, index) => (
                <span key={index} className="text-sm bg-gray-200  rounded" style={{ fontSize: `${interestFontSize}px` }}>
                  {interest}
                </span>
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
