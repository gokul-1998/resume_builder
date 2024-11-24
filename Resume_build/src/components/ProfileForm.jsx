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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  useEffect(() => {
    setProgress(calculateProgress());
  }, [formData]);

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

  const [sectionCompletion, setSectionCompletion] = useState({
    personal: false,
    professional: false,
    education: false,
    skills: false
  });

  useEffect(() => {
    const personalComplete = formData.name && formData.email && formData.profile.phone && formData.profile.location;
    const professionalComplete = formData.profile.summary && formData.profile.workExperience;
    const educationComplete = formData.profile.academics.some(a => a.degree && a.institution && a.year);
    const skillsComplete = Object.values(formData.profile.skills).some(category => category.some(skill => skill.trim() !== ''));

    setSectionCompletion({
      personal: personalComplete,
      professional: professionalComplete,
      education: educationComplete,
      skills: skillsComplete
    });
  }, [formData]);

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2 w-full md:w-auto">
              <CardTitle>Profile Information</CardTitle>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Profile completion: {progress}%
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fill in all sections to complete your profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress value={progress} className="w-full md:w-[200px]" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {!isEditing ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                  }}
                  className="w-full md:w-auto hover:bg-primary/10"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              ) : (
                <>
                  <Button type="submit" variant="default" className="w-full md:w-auto bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="w-full md:w-auto">
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-input focus:ring
-2 focus:ring-primary"
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing && (
                    <AIImprove
                      content={formData.profile.bio}
                      contentType="bio"
                      onImprove={(improved) => handleAIImprovement('bio', improved)}
                    />
                  )}
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.profile.bio}
                    onChange={handleTextareaChange}
                    disabled={!isEditing}
                    className="w-full min-h-[100px] p-2 border rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="professional" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  {isEditing && (
                    <AIImprove
                      content={formData.profile.summary}
                      contentType="summary"
                      onImprove={(improved) => handleAIImprovement('summary', improved)}
                    />
                  )}
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.profile.summary}
                    onChange={handleTextareaChange}
                    disabled={!isEditing}
                    className="w-full min-h-[100px] p-2 border rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workExperience">Work Experience</Label>
                  {isEditing && (
                    <AIImprove
                      content={formData.profile.workExperience}
                      contentType="work_experience"
                      onImprove={(improved) => handleAIImprovement('workExperience', improved)}
                    />
                  )}
                  <textarea
                    id="workExperience"
                    name="workExperience"
                    value={formData.profile.workExperience}
                    onChange={handleTextareaChange}
                    disabled={!isEditing}
                    className="w-full min-h-[200px] p-2 border rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="education" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Academics</Label>
                  {formData.profile.academics.map((academic, index) => (
                    <div key={index} className="space-y-2 p-4 border rounded-md">
                      <div className="grid grid-cols-2 gap-4">
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
                          onClick={() => removeAcademic(index)}
                          className="mt-2"
                        >
                          <Minus className="h-4 w-4 mr-2" /> Remove
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
                      <Plus className="h-4 w-4 mr-2" /> Add Academic
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Certifications</Label>
                  {formData.profile.certifications.map((certification, index) => (
                    <div key={index} className="space-y-2 p-4 border rounded-md">
                      <div className="grid grid-cols-2 gap-4">
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
                          onClick={() => removeCertification(index)}
                          className="mt-2"
                        >
                          <Minus className="h-4 w-4 mr-2" /> Remove
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
                      <Plus className="h-4 w-4 mr-2" /> Add Certification
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="skills" className="mt-4">
              <div className="space-y-4">
                {Object.entries(formData.profile.skills).map(([category, skills]) => (
                  <div key={category} className="space-y-2">
                    <Label className="text-lg font-semibold">{category}</Label>
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
                          <Plus className="h-4 w-4 mr-2" /> Add {category} Skill
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <Label htmlFor="projects">Projects</Label>
                  <textarea
                    id="projects"
                    name="projects"
                    value={formData.profile.projects}
                    onChange={handleTextareaChange}
                    disabled={!isEditing}
                    className="w-full min-h-[200px] p-2 border rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </form>
  );
}

