import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { Badge } from '../components/ui/badge'; // Adjust the path if necessary
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'; // Adjust the path if necessary

export default function Component() {
  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - 75% */}
        <div className="md:w-3/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">John Doe</CardTitle>
              <p className="text-xl text-muted-foreground">Full Stack Python and React Engineer</p>
            </CardHeader>
            <CardContent>
              <p>Passionate full stack developer with expertise in Python and React. Committed to creating efficient, scalable, and user-friendly web applications.</p>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Senior Full Stack Developer - Tech Solutions Inc.</h3>
                <p className="text-sm text-muted-foreground">2020 - Present</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Developed and maintained large-scale web applications using Python (Django) and React</li>
                  <li>Implemented RESTful APIs and integrated third-party services</li>
                  <li>Led a team of 5 developers and mentored junior team members</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Full Stack Developer - Innovative Web Co.</h3>
                <p className="text-sm text-muted-foreground">2017 - 2020</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Built responsive web applications using React and Redux</li>
                  <li>Developed backend services using Python (Flask) and PostgreSQL</li>
                  <li>Collaborated with UX designers to implement intuitive user interfaces</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Academics Section */}
          <Card>
            <CardHeader>
              <CardTitle>Academics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Master of Science in Computer Science</h3>
                <p className="text-sm text-muted-foreground">University of Technology - 2017</p>
              </div>
              <div>
                <h3 className="font-semibold">Bachelor of Science in Software Engineering</h3>
                <p className="text-sm text-muted-foreground">State University - 2015</p>
              </div>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">E-commerce Platform</h3>
                <p>Developed a full-stack e-commerce platform using Django, React, and PostgreSQL. Implemented features such as user authentication, product catalog, shopping cart, and payment integration.</p>
              </div>
              <div>
                <h3 className="font-semibold">Task Management Application</h3>
                <p>Created a responsive task management app using React and Flask. Features include real-time updates, task prioritization, and team collaboration tools.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - 25% */}
        <div className="md:w-1/4 space-y-6">
          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Python</Badge>
                <Badge>Django</Badge>
                <Badge>Flask</Badge>
                <Badge>React</Badge>
                <Badge>Redux</Badge>
                <Badge>JavaScript</Badge>
                <Badge>TypeScript</Badge>
                <Badge>HTML/CSS</Badge>
                <Badge>SQL</Badge>
                <Badge>Git</Badge>
                <Badge>Docker</Badge>
                <Badge>AWS</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Social Links Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Social</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="mailto:john.doe@email.com" className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="w-4 h-4" /> john.doe@email.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-primary hover:underline">
                <Phone className="w-4 h-4" /> (123) 456-7890
              </a>
              <a href="https://github.com/johndoe" className="flex items-center gap-2 text-primary hover:underline">
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a href="https://linkedin.com/in/johndoe" className="flex items-center gap-2 text-primary hover:underline">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </CardContent>
          </Card>

          {/* Awards and Certifications Section */}
          <Card>
            <CardHeader>
              <CardTitle>Awards & Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <h3 className="font-semibold">AWS Certified Developer</h3>
                <p className="text-sm text-muted-foreground">2022</p>
              </div>
              <div>
                <h3 className="font-semibold">Best Team Lead Award</h3>
                <p className="text-sm text-muted-foreground">Tech Solutions Inc., 2021</p>
              </div>
              <div>
                <h3 className="font-semibold">Python Developer Certification</h3>
                <p className="text-sm text-muted-foreground">Python Institute, 2019</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
