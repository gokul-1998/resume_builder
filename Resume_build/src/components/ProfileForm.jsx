import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Save, X, ChevronDown, ChevronRight, User, Briefcase, BookOpen, Code, Plus, Minus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AIImprove from './AIImprove';

export default function ProfileForm({ user, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profile: {
      phone: '',
      bio: '',
      location: '',
      website: '',
      github: '',
      linkedin: '',
      summary: '',
      academics: [{ degree: '', institution: '', year: '' }],
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
      workExperience: '',
      projects: '',
      certifications: [{ title: '', organization: '', year: '' }],
      languages: '',
      interests: ''
    }
  });
  
  const { toast } = useToast();
  const url = `${import.meta.env.VITE_AUTH_BACKEND_URL}` || "http://localhost:8000";

  useEffect(() => {
    if (user) {
      const profile = user.profile ? JSON.parse(user.profile) : {};
      // Initialize skills as an object with categories if it's a string or undefined
      const skills = typeof profile.skills === 'string' || !profile.skills ? {
        Architectures: [''],
        Languages: [''],
        Frameworks: [''],
        libraries: [''],
        tools: [''],
        databases: [''],
        cloud: [''],
        others: ['']
      } : profile.skills;

      setFormData({
        name: user.profile_name || '',
        email: user.email || '',
        profile: {
          phone: profile.phone || '',
          bio: profile.bio || '',
          location: profile.location || '',
          website: profile.website || '',
          github: profile.github || '',
          linkedin: profile.linkedin || '',
          summary: profile.summary || '',
          academics: profile.academics || [{ degree: '', institution: '', year: '' }],
          skills: skills,
          workExperience: profile.workExperience || '',
          projects: profile.projects || '',
          certifications: profile.certifications || [{ title: '', organization: '', year: '' }],
          languages: profile.languages || '',
          interests: profile.interests || ''
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'email') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: value
        }
      }));
    }
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    handleInputChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Not authenticated. Please login.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`${url}/api/auth/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          profile: formData.profile
        })
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        toast({
          title: "Error",
          description: "Session expired. Please login again.",
          variant: "destructive"
        });
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }

      if (response.ok) {
        const updatedUser = await response.json();
        if (onProfileUpdate) {
          onProfileUpdate(updatedUser);
        }
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.detail || "Failed to update profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const calculateProgress = () => {
    const fields = Object.entries(formData.profile).filter(([key]) => key !== 'skills' && key !== 'academics' && key !== 'certifications');
    const filledFields = fields.filter(([_, value]) => value && typeof value === 'string' && value.trim() !== '').length;
    
    // Calculate skills progress separately
    const skillCategories = Object.values(formData.profile.skills);
    const filledSkills = skillCategories.reduce((count, category) => {
      return count + category.filter(skill => skill && skill.trim() !== '').length;
    }, 0);
    
    const academics = formData.profile.academics.filter(academic => academic.degree && academic.institution && academic.year).length;
    const certifications = formData.profile.certifications.filter(certification => certification.title && certification.organization && certification.year).length;
    
    const totalFields = fields.length + filledSkills + academics + certifications;
    const totalFilledFields = filledFields + filledSkills + academics + certifications;
    
    return Math.round((totalFilledFields / totalFields) * 100);
  };

  const [progress, setProgress] = useState(0);
  const [openSections, setOpenSections] = useState({
    personal: true,
    professional: true,
    education: true,
    skills: true
  });

  useEffect(() => {
    setProgress(calculateProgress());
  }, [formData]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAIImprovement = (field, improvedContent) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: improvedContent
      }
    }));

    toast({
      title: "Content Improved",
      description: "The content has been improved with AI assistance.",
    });
  };

  const handleSkillChange = (category, index, value) => {
    setFormData(prevData => {
      const newSkills = { ...prevData.profile.skills };
      newSkills[category] = [...newSkills[category]];
      newSkills[category][index] = value;
      return {
        ...prevData,
        profile: {
          ...prevData.profile,
          skills: newSkills
        }
      };
    });
  };

  const addSkill = (category) => {
    setFormData(prevData => {
      const newSkills = { ...prevData.profile.skills };
      newSkills[category] = [...newSkills[category], ''];
      return {
        ...prevData,
        profile: {
          ...prevData.profile,
          skills: newSkills
        }
      };
    });
  };

  const removeSkill = (category, index) => {
    setFormData(prevData => {
      const newSkills = { ...prevData.profile.skills };
      newSkills[category] = newSkills[category].filter((_, i) => i !== index);
      if (newSkills[category].length === 0) {
        newSkills[category] = [''];
      }
      return {
        ...prevData,
        profile: {
          ...prevData.profile,
          skills: newSkills
        }
      };
    });
  };

  const handleAcademicChange = (index, field, value) => {
    setFormData(prevData => {
      const newAcademics = [...prevData.profile.academics];
      newAcademics[index][field] = value;
      return {
        ...prevData,
        profile: {
          ...prevData.profile,
          academics: newAcademics
        }
      };
    });
  };

  const addAcademic = () => {
    setFormData(prevData => {
      const newAcademics = [...prevData.profile.academics, { degree: '', institution: '', year: '' }];
      return {
        ...prevData,
        profile: {
          ...prevData.profile,
          academics: newAcademics
        }
      };
    });
  };

  const removeAcademic = (index) => {
    setFormData(prevData => {
      const newAcademics = prevData.profile.academics.filter((_, i) => i !== index);
      return {
        ...prevData,
        profile: {
          ...prevData.profile,
          academics: newAcademics
        }
      };
    });
  };

  const handleCertificationChange = (index, field, value) => {
    setFormData(prevData => {
      const newCertifications = [...prevData.profile.certifications];
      newCertifications[index][field] = value;
      return {
        ...prevData,
        profile: {
          ...prevData.profile,
          certifications: newCertifications
        }
      };
    });
  };

  const addCertification = () => {
    setFormData(prevData => {
      const newCertifications = [...prevData.profile.certifications, { title: '', organization: '', year: '' }];
      return {
        ...prevData,
        profile: {
          ...prevData.profile,
          certifications: newCertifications
        }
      };
    });
  };

  const removeCertification = (index) => {
    setFormData(prevData => {
      const newCertifications = prevData.profile.certifications.filter((_, i) => i !== index);
      return {
        ...prevData,
        profile: {
          ...prevData.profile,
          certifications: newCertifications
        }
      };
    });
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <CardTitle>Profile Information</CardTitle>
              <div className="text-sm text-muted-foreground">
                Profile completion: {progress}%
              </div>
              <Progress value={progress} className="w-[200px]" />
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                  }}
                  className="hover:bg-primary/10"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              ) : (
                <>
                  <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information Section */}
          <Collapsible open={openSections.personal} onOpenChange={() => toggleSection('personal')}>
            <CollapsibleTrigger className="flex items-center w-full py-2 hover:bg-accent rounded-lg px-4">
              <div className="flex items-center flex-1">
                <User className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
              {openSections.personal ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-input focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-input focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.profile.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-input focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.profile.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-input focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.profile.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-input focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Bio Section */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing && (
            <AIImprove
              content={formData.profile.bio}
              contentType="bio"
              onImprove={(improved) => handleAIImprovement('bio', improved)}
            />
            )}
            <div
              className="w-full min-h-[2rem] border p-2 rounded-md focus:ring-2 focus:ring-primary font-xl"
              contentEditable={isEditing}
              onBlur={(e) => {
                const newValue = e.target.innerText;
                handleTextareaChange({
                  target: {
                    name: 'bio',
                    value: newValue
                  }
                });
              }}
              suppressContentEditableWarning={true}
            >
              {formData.profile.bio}
            </div>
          </div>

          {/* Professional Section */}
          <Collapsible open={openSections.professional} onOpenChange={() => toggleSection('professional')}>
            <CollapsibleTrigger className="flex items-center w-full py-2 hover:bg-accent rounded-lg px-4">
              <div className="flex items-center flex-1">
                <Briefcase className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-semibold">Professional Experience</h3>
              </div>
              {openSections.professional ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pt-4 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  {isEditing && (
                      <AIImprove
                        content={formData.profile.summary}
                        contentType="summary"
                        onImprove={(improved) => handleAIImprovement('summary', improved)}
                      />
                    )}
                  <div
                    className="w-full min-h-[2rem] border p-2 rounded-md focus:ring-2 focus:ring-primary font-xl"
                    contentEditable={isEditing}
                    onBlur={(e) => {
                      const newValue = e.target.innerText;
                      handleTextareaChange({
                        target: {
                          name: 'summary',
                          value: newValue
                        }
                      });
                    }}
                    suppressContentEditableWarning={true}
                  >
                    {formData.profile.summary}
                  </div>
                </div>

                <div>
                  <Label htmlFor="workExperience">Work Experience</Label>
                  {isEditing && (
                      <AIImprove
                        content={formData.profile.workExperience}
                        contentType="work_experience"
                        onImprove={(improved) => handleAIImprovement('workExperience', improved)}
                      />
                    )}
                  <div
                    className="w-full min-h-[2rem] border p-2 rounded-md focus:ring-2 focus:ring-primary font-xl"
                    contentEditable={isEditing}
                    onBlur={(e) => {
                      const newValue = e.target.innerText;
                      handleTextareaChange({
                        target: {
                          name: 'workExperience',
                          value: newValue
                        }
                      });
                    }}
                    suppressContentEditableWarning={true}
                  >
                    {formData.profile.workExperience}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Education Section */}
          <Collapsible open={openSections.education} onOpenChange={() => toggleSection('education')}>
            <CollapsibleTrigger className="flex items-center w-full py-2 hover:bg-accent rounded-lg px-4">
              <div className="flex items-center flex-1">
                <BookOpen className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-semibold">Education & Certifications</h3>
              </div>
              {openSections.education ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pt-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Academics</Label>
                  {formData.profile.academics.map((academic, index) => (
                    <div key={index} className="space-y-2">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor={`degree-${index}`}>Degree</Label>
                          <Input
                            id={`degree-${index}`}
                            name="degree"
                            value={academic.degree}
                            onChange={(e) => handleAcademicChange(index, 'degree', e.target.value)}
                            disabled={!isEditing}
                            className="border-input focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`institution-${index}`}>Institution</Label>
                          <Input
                            id={`institution-${index}`}
                            name="institution"
                            value={academic.institution}
                            onChange={(e) => handleAcademicChange(index, 'institution', e.target.value)}
                            disabled={!isEditing}
                            className="border-input focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`year-${index}`}>Year</Label>
                        <Input
                          id={`year-${index}`}
                          name="year"
                          value={academic.year}
                          onChange={(e) => handleAcademicChange(index, 'year', e.target.value)}
                          disabled={!isEditing}
                          className="border-input focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeAcademic(index)}
                          className="h-10 w-10"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAcademic}
                      className="w-full mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Academic
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Certifications</Label>
                  {formData.profile.certifications.map((certification, index) => (
                    <div key={index} className="space-y-2">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor={`title-${index}`}>Title</Label>
                          <Input
                            id={`title-${index}`}
                            name="title"
                            value={certification.title}
                            onChange={(e) => handleCertificationChange(index, 'title', e.target.value)}
                            disabled={!isEditing}
                            className="border-input focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`organization-${index}`}>Organization</Label>
                          <Input
                            id={`organization-${index}`}
                            name="organization"
                            value={certification.organization}
                            onChange={(e) => handleCertificationChange(index, 'organization', e.target.value)}
                            disabled={!isEditing}
                            className="border-input focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`year-${index}`}>Year</Label>
                        <Input
                          id={`year-${index}`}
                          name="year"
                          value={certification.year}
                          onChange={(e) => handleCertificationChange(index, 'year', e.target.value)}
                          disabled={!isEditing}
                          className="border-input focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCertification(index)}
                          className="h-10 w-10"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCertification}
                      className="w-full mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </Button>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Skills Section */}
          <Collapsible open={openSections.skills} onOpenChange={() => toggleSection('skills')}>
            <CollapsibleTrigger className="flex items-center w-full py-2 hover:bg-accent rounded-lg px-4">
              <div className="flex items-center flex-1">
                <Code className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-semibold">Skills & Projects</h3>
              </div>
              {openSections.skills ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pt-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-4">
                  <Label>Skills</Label>
                  {Object.entries(formData.profile.skills).map(([category, skills]) => (
                    <div key={category} className="space-y-2">
                      <Label className="text-sm font-medium">{category}</Label>
                      <div className="space-y-2">
                        {skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={skill}
                              onChange={(e) => handleSkillChange(category, index, e.target.value)}
                              disabled={!isEditing}
                              placeholder={`Enter ${category} skill`}
                              className="flex-1"
                            />
                            {isEditing && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeSkill(category, index)}
                                className="h-10 w-10"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addSkill(category)}
                            className="w-full mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add {category} Skill
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projects">Projects</Label>
                  <div
                    className="w-full min-h-[2rem] border p-2 rounded-md focus:ring-2 focus:ring-primary font-xl"
                    contentEditable={isEditing}
                    onBlur={(e) => {
                      const newValue = e.target.innerText;
                      handleTextareaChange({
                        target: {
                          name: 'projects',
                          value: newValue
                        }
                      });
                    }}
                    suppressContentEditableWarning={true}
                  >
                    {formData.profile.projects}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </form>
  );
}
