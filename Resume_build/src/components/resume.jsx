import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Adjust the path if necessary

export default function Resume() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container relative">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - 75% */}
        <div className="md:w-3/4 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">John Doe</h1>
            <p className="text-xl text-gray-900">Full Stack Python and React Engineer</p>
            {/* About Me */}
            <div>
              <h2 className="font-semibold">About Me</h2>
              <p>
                I am a dedicated Full Stack Developer with a strong background in both front-end and back-end technologies. My responsive web applications using React, Python, and various tools and frameworks.
              </p>
            </div>
          </div>
          {/* Experience */}
          <div>
            <h2 className="font-semibold">Experience</h2>
            <div>
              <h3 className="font-semibold">Senior Full Stack Developer - Tech Solutions Inc.</h3>
              <p className="text-sm text-gray-900">2020 - Present</p>
              <ul className="list-disc list-inside mt-2">
                <li>Developed and maintained large-scale web applications using Python (Django) and React</li>
                <li>Implemented RESTful APIs and integrated third-party services</li>
                <li>Led a team of 5 developers and mentored junior team members</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Full Stack Developer - Innovative Web Co.</h3>
              <p className="text-sm text-gray-900">2017 - 2020</p>
              <ul className="list-disc list-inside mt-2">
                <li>Built responsive web applications using React and Redux</li>
                <li>Developed backend services using Python (Flask) and PostgreSQL</li>
                <li>Collaborated with UX designers to implement intuitive user interfaces</li>
              </ul>
            </div>
          </div>
          {/* Projects */}
          <div>
            <h2 className="font-semibold">Projects</h2>
            <div>
              <h3 className="font-semibold">E-commerce Platform</h3>
              <p>
                Developed a full-stack e-commerce platform using Django, React, and PostgreSQL. Implemented features such as user authentication, product catalog, shopping cart, and payment integration.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Task Management Application</h3>
              <p>
                Created a responsive task management app using React and Flask. Features include real-time updates, task prioritization, and team collaboration tools.
              </p>
            </div>
          </div>
          {/* Academics */}
          <div>
            <h2 className="font-semibold">Academics</h2>
            <div>
              <h3 className="font-semibold">Master of Science in Computer Science</h3>
              <p className="text-sm text-gray-900">University of Technology - 2017</p>
            </div>
            <div>
              <h3 className="font-semibold">Bachelor of Science in Software Engineering</h3>
              <p className="text-sm text-gray-900">State University - 2015</p>
            </div>
          </div>
        </div>

        {/* Right side - 25% */}
        <div className="md:w-1/4 space-y-6">
          {/* Contact & Social */}
          <div>
            <h2 className="font-semibold">Contact & Social</h2>
            <div className="space-y-2">
              <a href="mailto:john.doe@email.com" className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="w-4 h-4" /> john.doe@email.com
              </a>
              <a href="https://linkedin.com/in/johndoe" className="flex items-center gap-2 text-primary hover:underline">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
              <a href="https://github.com/johndoe" className="flex items-center gap-2 text-primary hover:underline">
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
          {/* Skills */}
          <div>
            <h2 className="font-semibold">Skills</h2>
            <div className="grid grid-cols-2 gap-2">
              <ul className="space-y-2">
                <li className="skill-item text-gray-800">Python</li>
                <li className="skill-item text-gray-800">Django</li>
                <li className="skill-item text-gray-800">Flask</li>
                <li className="skill-item text-gray-800">React</li>
              </ul>
              <ul className="space-y-2">
                <li className="skill-item text-gray-800">Redux</li>
                <li className="skill-item text-gray-800">JavaScript</li>
                <li className="skill-item text-gray-800">TypeScript</li>
                <li className="skill-item text-gray-800">SQL</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="font-semibold">Awards & Certifications</h2>
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold">AWS Certified Developer</h3>
                <p className="text-sm text-gray-900">2022</p>
              </div>
              <div>
                <h3 className="font-semibold">Best Team Lead Award</h3>
                <p className="text-sm text-gray-900">Tech Solutions Inc., 2021</p>
              </div>
              <div>
                <h3 className="font-semibold">Python Developer Certification</h3>
                <p className="text-sm text-gray-900">Python Institute, 2019</p>
              </div>
            </div>
          </div>
          {/* Print button after Awards & Certifications */}
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
