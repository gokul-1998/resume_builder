'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusIcon, MinusIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { isEqual } from 'lodash'

export default function ResumeForm({ initialResumeData,setResumeData }) {
  const [formData, setFormData] = useState(initialResumeData || {
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
  });

  const [openSections, setOpenSections] = useState({
    personalInfo: true,
    experience: true,
    projects: true,
    aboutMe: true,
    academics: true,
    contact: true,
    skills: true,
    awards_and_certifications: true,
    interests: true
  });

  const lastSavedData = useRef(formData);
  const lastApiCallTime = useRef(Date.now());

  useEffect(() => {
    if (initialResumeData) {
      setFormData(initialResumeData);
      lastSavedData.current = initialResumeData;
      setResumeData(initialResumeData)
    }
  }, [initialResumeData]);

  const updateBackend = useCallback(async () => {
    const currentTime = Date.now();
    if (currentTime - lastApiCallTime.current < 5000) {
      return; // Don't call API if less than 5 seconds have passed
    }

    if (!isEqual(formData, lastSavedData.current)) {
      const location = window.location.href;
      const username = location.split("/")[3];

      try {
        const response = await fetch(`http://localhost:8000/users/${username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profile: formData }),
        });

        if (response.ok) {
          console.log('Data updated successfully');
          lastSavedData.current = formData;
          lastApiCallTime.current = currentTime;
        } else {
          console.error('Error updating data:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to update data:', error);
      }
    }
  }, [formData]);

  useEffect(() => {
    const intervalId = setInterval(updateBackend, 5000); // Check every 5 seconds
    return () => clearInterval(intervalId);
  }, [updateBackend]);

  // ... (rest of the component code remains the same)
  const handleChange = (section, index, field, value) => {
    setFormData(prevData => {
        const newData = { ...prevData };
        if (Array.isArray(newData[section])) {
          newData[section] = [...newData[section]];
          newData[section][index] = { ...newData[section][index], [field]: value };
        } else if (typeof newData[section] === 'object') {
          newData[section] = { ...newData[section], [field]: value };
        } else {
          newData[section] = value;
        }
        setResumeData(newData);  // Call the updateResumeData function
        return newData;
      });
    };
  

  const handleArrayChange = (section, index, value) => {
    setFormData(prevData => {
      const newArray = [...prevData[section]];
      newArray[index] = value;
      return { ...prevData, [section]: newArray };
    });
  };

  const handleSkillChange = (category, index, value) => {
    setFormData(prevData => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        [category]: prevData.skills[category].map((skill, i) => i === index ? value : skill),
      }
    }));
  };

  const addField = (section) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: [...prevData[section], section === 'experience' ? { title: '', company: '', duration: '', responsibilities: [''] } :
                                        section === 'projects' ? { title: '', description: '' } :
                                        section === 'academics' ? { degree: '', institution: '', year: '' } :
                                        section === 'contact' ? { type: '', value: '' } :
                                        section === 'awards_and_certifications' ? { title: '', organization: '', year: '' } :
                                        '']
    }));
  };

  const removeField = (section, index) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: prevData[section].filter((_, i) => i !== index),
    }));
  };

  const addResponsibility = (expIndex) => {
    setFormData(prevData => ({
      ...prevData,
      experience: prevData.experience.map((exp, i) => 
        i === expIndex ? { ...exp, responsibilities: [...exp.responsibilities, ''] } : exp
      )
    }));
  };

  const removeResponsibility = (expIndex, respIndex) => {
    setFormData(prevData => ({
      ...prevData,
      experience: prevData.experience.map((exp, i) => 
        i === expIndex ? { ...exp, responsibilities: exp.responsibilities.filter((_, j) => j !== respIndex) } : exp
      )
    }));
  };

  const addSkill = (category) => {
    setFormData(prevData => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        [category]: [...prevData.skills[category], ''],
      }
    }));
  };

  const removeSkill = (category, index) => {
    setFormData(prevData => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        [category]: prevData.skills[category].filter((_, i) => i !== index),
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateBackend();
    alert('Form submitted successfully');
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); updateBackend(); }} className="space-y-8 max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <Collapsible open={openSections.personalInfo} onOpenChange={() => toggleSection('personalInfo')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          {openSections.personalInfo ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
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
        </CollapsibleContent>
      </Collapsible>

      {/* Experience */}
      <Collapsible open={openSections.experience} onOpenChange={() => toggleSection('experience')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">Experience</h2>
          {openSections.experience ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {formData.experience.map((exp, index) => (
            <div key={index} className="space-y-2 p-4 bg-white rounded-md">
              <Input
                placeholder="Title"
                value={exp.title}
                onChange={(e) => handleChange('experience', index, 'title', e.target.value)}
                
              />
              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(e) => handleChange('experience', index, 'company', e.target.value)}
                
              />
              <Input
                placeholder="Duration eg : ( Jan 2020 - Jan 2021 )"
                value={exp.duration}
                onChange={(e) => handleChange('experience', index, 'duration', e.target.value)}
                
              />
              {exp.responsibilities.map((resp, respIndex) => (
                <div key={respIndex} className="flex items-center space-x-2">
                  <Input
                    placeholder="Responsibility"
                    value={resp}
                    onChange={(e) => {
                      const newResp = [...exp.responsibilities]
                      newResp[respIndex] = e.target.value
                      handleChange('experience', index, 'responsibilities', newResp)
                    }}
                    
                  />
                  <Button type="button" onClick={() => removeResponsibility(index, respIndex)} variant="destructive" size="icon">
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addResponsibility(index)} variant="outline" size="sm">
                Add Responsibility
              </Button>
              <Button type="button" onClick={() => removeField('experience', index)} variant="destructive" size="sm">
                Remove Experience
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => addField('experience')} variant="outline">
            Add Experience
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Projects */}
      <Collapsible open={openSections.projects} onOpenChange={() => toggleSection('projects')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">Projects</h2>
          {openSections.projects ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {formData.projects.map((project, index) => (
            <div key={index} className="space-y-2 p-4 bg-white rounded-md">
              <Input
                placeholder="Title"
                value={project.title}
                onChange={(e) => handleChange('projects', index, 'title', e.target.value)}
                
              />
              <Textarea
                placeholder="Description"
                value={project.description}
                onChange={(e) => handleChange('projects', index, 'description', e.target.value)}
                
              />
              <Button type="button" onClick={() => removeField('projects', index)} variant="destructive" size="sm">
                Remove Project
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => addField('projects')} variant="outline">
            Add Project
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* About Me */}
      <Collapsible open={openSections.aboutMe} onOpenChange={() => toggleSection('aboutMe')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">About Me</h2>
          {openSections.aboutMe ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          <Textarea
            value={formData.aboutMe}
            onChange={(e) => handleChange('aboutMe', null, null, e.target.value)}
            
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Academics */}
      <Collapsible open={openSections.academics} onOpenChange={() => toggleSection('academics')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">Academics</h2>
          {openSections.academics ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {formData.academics.map((academic, index) => (
            <div key={index} className="space-y-2 p-4 bg-white rounded-md">
              <Input
                placeholder="Degree"
                value={academic.degree}
                onChange={(e) => handleChange('academics', index, 'degree', e.target.value)}
                
              />
              <Input
                placeholder="Institution"
                value={academic.institution}
                onChange={(e) => handleChange('academics', index, 'institution', e.target.value)}
                
              />
              <Input
                placeholder="Year"
                value={academic.year}
                onChange={(e) => handleChange('academics', index, 'year', e.target.value)}
                
              />
              <Button type="button" onClick={() => removeField('academics', index)} variant="destructive" size="sm">
                Remove Academic
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => addField('academics')} variant="outline">
            Add Academic
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Contact */}
      <Collapsible open={openSections.contact} onOpenChange={() => toggleSection('contact')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">Contact</h2>
          {openSections.contact ? <ChevronUpIcon className="h-5 w-5" /> :   <ChevronDownIcon className="h-5 w-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {formData.contact.map((contact, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Type (e.g., email, linkedin)"
                value={contact.type}
                onChange={(e) => handleChange('contact', index, 'type', e.target.value)}
                
              />
              <Input
                placeholder="Value"
                value={contact.value}
                onChange={(e) => handleChange('contact', index, 'value', e.target.value)}
                
              />
              <Button type="button" onClick={() => removeField('contact', index)} variant="destructive" size="icon">
                <MinusIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => addField('contact')} variant="outline">
            Add Contact
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Skills */}
      <Collapsible open={openSections.skills} onOpenChange={() => toggleSection('skills')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">Skills</h2>
          {openSections.skills ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {Object.entries(formData.skills).map(([category, skills]) => (
            <div key={category} className="space-y-2">
              <h3 className="font-medium">{category}</h3>
              {Array.isArray(skills) && skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`${category} skill`}
                    value={skill}
                    onChange={(e) => handleSkillChange(category, index, e.target.value)}
                    
                  />
                  <Button type="button" onClick={() => removeSkill(category, index)} variant="destructive" size="icon">
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => addSkill(category)} variant="outline" size="sm">
                Add {category} Skill
              </Button>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Awards and Certifications */}
      <Collapsible open={openSections.awards_and_certifications} onOpenChange={() => toggleSection('awards_and_certifications')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">Awards and Certifications</h2>
          {openSections.awards_and_certifications ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {Array.isArray(formData.awards_and_certifications) && formData.awards_and_certifications.map((award, index) => (
            <div key={index} className="space-y-2 p-4 bg-white rounded-md">
              <Input
                placeholder="Title"
                value={award.title}
                onChange={(e) => handleChange('awards_and_certifications', index, 'title', e.target.value)}
                
              />
              <Input
                placeholder="Organization"
                value={award.organization}
                onChange={(e) => handleChange('awards_and_certifications', index, 'organization', e.target.value)}
              />
              <Input
                placeholder="Year"
                value={award.year}
                onChange={(e) => handleChange('awards_and_certifications', index, 'year', e.target.value)}
                
              />
              <Button type="button" onClick={() => removeField('awards_and_certifications', index)} variant="destructive" size="sm">
                Remove Award/Certification
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => addField('awards_and_certifications')} variant="outline">
            Add Award/Certification
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Interests */}
      <Collapsible open={openSections.interests} onOpenChange={() => toggleSection('interests')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">Interests</h2>
          {openSections.interests ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {Array.isArray(formData.interests) && formData.interests.map((interest, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Interest"
                value={interest}
                onChange={(e) => handleArrayChange('interests', index, e.target.value)}
                
              />
              <Button type="button" onClick={() => removeField('interests', index)} variant="destructive" size="icon">
                <MinusIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => addField('interests')} variant="outline">
            Add Interest
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Button type="submit" className="w-full">Submit Resume</Button>
    </form>
  );
}