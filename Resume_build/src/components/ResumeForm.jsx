  import { useState, useEffect } from 'react'
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Textarea } from "@/components/ui/textarea"
  import { Label } from "@/components/ui/label"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

  // Helper function to load from localStorage safely
  const loadFromLocalStorage = (key, fallback) => {
    try {
      const savedData = localStorage.getItem(key)
      const parsedData = savedData ? JSON.parse(savedData) : fallback
      // Ensure skills are properly initialized as arrays
      parsedData.skills = parsedData.skills || {
        Architectures: [''],
        Languages: [''],
        Frameworks: [''],
        libraries: [''],
        tools: [''],
        databases: [''],
        cloud: [''],
        others: ['']
      }
      return parsedData
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return fallback
    }
  }
  

  export default function ResumeForm() {
    const [formData, setFormData] = useState(() => 
      loadFromLocalStorage('resumeFormData', {
        personalInfo: { name: '', title: '' },
        experience: [{ title: '', company: '', duration: '', responsibilities: [''] }],
        projects: [{ title: '', description: '' }],
        aboutMe: '',
        academics: [{ degree: '', institution: '', year: '' }],
        contact: [{ type: '', value: '' }],
        skills: {
          Architectures: [''],
          Languages: [''],
          Frameworks: [''],
          libraries: [''],
          tools: [''],
          databases: [''],
          cloud: [''],
          others: ['']
        },
        awards_and_certifications: [{ title: '', organization: '', year: '' }],
        interests: ['']
      })
    )

    // Save form data to localStorage whenever it changes (with a slight delay to avoid performance issues)
    useEffect(() => {
      const timer = setTimeout(() => {
        localStorage.setItem('resumeFormData', JSON.stringify(formData))
      }, 500) // Debounce to save after 500ms

      return () => clearTimeout(timer) // Clean up on unmount or data change
    }, [formData])

    // Save data before the page unloads to prevent data loss
    useEffect(() => {
      const handleBeforeUnload = () => {
        localStorage.setItem('resumeFormData', JSON.stringify(formData))
      }
      
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }, [formData])

    const handleChange = (section, index, field, value) => {
      setFormData(prevData => {
        const newData = { ...prevData }
        if (section === 'skills') {
          if (Array.isArray(newData.skills[field])) {
            newData.skills[field][index] = value
          } else {
            newData.skills[field] = [value]
          }
        } else if (Array.isArray(newData[section])) {
          newData[section][index][field] = value
        } else if (typeof newData[section] === 'object') {
          newData[section][field] = value
        } else {
          newData[section] = value
        }
        return newData
      })
    }
    

    const addItem = (section) => {
      setFormData(prevData => {
        const newData = { ...prevData }
        if (section === 'experience') {
          newData[section].push({ title: '', company: '', duration: '', responsibilities: [''] })
        } else if (section === 'projects') {
          newData[section].push({ title: '', description: '' })
        } else if (section === 'academics') {
          newData[section].push({ degree: '', institution: '', year: '' })
        } else if (section === 'contact') {
          newData[section].push({ type: '', value: '' })
        } else if (section === 'awards_and_certifications') {
          newData[section].push({ title: '', organization: '', year: '' })
        } else if (section === 'interests') {
          newData[section].push('')
        }
        return newData
      })
    }

    const addSkill = (category) => {
      setFormData(prevData => {
        const newData = { ...prevData }
        newData.skills[category].push('')
        return newData
      })
    }

    const addResponsibility = (index) => {
      setFormData(prevData => {
        const newData = { ...prevData }
        newData.experience[index].responsibilities.push('')
        return newData
      })
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      console.log(JSON.stringify(formData, null, 2))
      // Here you would typically send the data to a server or process it further
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-6">
        {/* Personal Information */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.personalInfo.name}
                onChange={(e) => handleChange('personalInfo', null, 'name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.personalInfo.title}
                onChange={(e) => handleChange('personalInfo', null, 'title', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Experience</h2>
          {formData.experience.map((exp, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`exp-title-${index}`}>Title</Label>
                  <Input
                    id={`exp-title-${index}`}
                    value={exp.title}
                    onChange={(e) => handleChange('experience', index, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`exp-company-${index}`}>Company</Label>
                  <Input
                    id={`exp-company-${index}`}
                    value={exp.company}
                    onChange={(e) => handleChange('experience', index, 'company', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`exp-duration-${index}`}>Duration</Label>
                  <Input
                    id={`exp-duration-${index}`}
                    value={exp.duration}
                    onChange={(e) => handleChange('experience', index, 'duration', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Responsibilities</Label>
                  {exp.responsibilities.map((resp, respIndex) => (
                    <Input
                      key={respIndex}
                      value={resp}
                      onChange={(e) => handleChange('experience', index, 'responsibilities', [
                        ...exp.responsibilities.slice(0, respIndex),
                        e.target.value,
                        ...exp.responsibilities.slice(respIndex + 1)
                      ])}
                      className="mb-2"
                    />
                  ))}
                  <Button type="button" onClick={() => addResponsibility(index)} className="mt-2">
                    Add Responsibility
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button type="button" onClick={() => addItem('experience')}>Add Experience</Button>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          {formData.projects.map((project, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`project-title-${index}`}>Title</Label>
                  <Input
                    id={`project-title-${index}`}
                    value={project.title}
                    onChange={(e) => handleChange('projects', index, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`project-description-${index}`}>Description</Label>
                  <Textarea
                    id={`project-description-${index}`}
                    value={project.description}
                    onChange={(e) => handleChange('projects', index, 'description', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" onClick={() => addItem('projects')}>Add Project</Button>
        </div>

        {/* About Me */}
        <div>
          <h2 className="text-2xl font-bold mb-4">About Me</h2>
          <Textarea
            value={formData.aboutMe}
            onChange={(e) => handleChange('aboutMe', null, null, e.target.value)}
          />
        </div>

        {/* Academics */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Academics</h2>
          {formData.academics.map((academic, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`academic-degree-${index}`}>Degree</Label>
                  <Input
                    id={`academic-degree-${index}`}
                    value={academic.degree}
                    onChange={(e) => handleChange('academics', index, 'degree', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`academic-institution-${index}`}>Institution</Label>
                  <Input
                    id={`academic-institution-${index}`}
                    value={academic.institution}
                    onChange={(e) => handleChange('academics', index, 'institution', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`academic-year-${index}`}>Year</Label>
                  <Input
                    id={`academic-year-${index}`}
                    value={academic.year}
                    onChange={(e) => handleChange('academics', index, 'year', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" onClick={() => addItem('academics')}>Add Academic</Button>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          {formData.contact.map((contact, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`contact-type-${index}`}>Type</Label>
                  <Input
                    id={`contact-type-${index}`}
                    value={contact.type}
                    onChange={(e) => handleChange('contact', index, 'type', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`contact-value-${index}`}>Value</Label>
                  <Input
                    id={`contact-value-${index}`}
                    value={contact.value}
                    onChange={(e) => handleChange('contact', index, 'value', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" onClick={() => addItem('contact')}>Add Contact</Button>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          {Object.entries(formData.skills).map(([category, skills]) => (
            <div key={category} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{category}</h3>
              {skills?.map((skill, index) => (
                <Input
                  key={index}
                  value={skill}
                  onChange={(e) => handleChange('skills', index, category, [
                    ...skills.slice(0, index),
                    e.target.value,
                    ...skills.slice(index + 1)
                  ])}
                  className="mb-2"
                />
              ))}
              <Button type="button" onClick={() => addSkill(category)}>Add {category} Skill</Button>
            </div>
          ))}
        </div>

        {/* Awards and Certifications */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Awards and Certifications</h2>
          {formData.awards_and_certifications.map((award, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`award-title-${index}`}>Title</Label>
                  <Input
                    id={`award-title-${index}`}
                    value={award.title}
                    onChange={(e) => handleChange('awards_and_certifications', index, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`award-organization-${index}`}>Organization</Label>
                  <Input
                    id={`award-organization-${index}`}
                    value={award.organization}
                    onChange={(e) => handleChange('awards_and_certifications', index, 'organization', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`award-year-${index}`}>Year</Label>
                  <Input
                    id={`award-year-${index}`}
                    value={award.year}
                    onChange={(e) => handleChange('awards_and_certifications', index, 'year', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" onClick={() => addItem('awards_and_certifications')}>Add Award/Certification</Button>
        </div>

        {/* Interests */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Interests</h2>
          {formData.interests.map((interest, index) => (
            <Input
              key={index}
              value={interest}
              onChange={(e) => handleChange('interests', index, null, e.target.value)}
              className="mb-2"
            />
          ))}
          <Button type="button" onClick={() => addItem('interests')}>Add Interest</Button>
        </div>

        <Button type="submit" className="w-full">Submit Resume</Button>
      </form>
    )
  }