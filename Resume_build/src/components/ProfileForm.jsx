import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Save, X, ChevronDown, ChevronRight, User, Briefcase, BookOpen, Award, Code } from 'lucide-react';
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
      education: '',
      skills: '',
      workExperience: '',
      projects: '',
      certifications: '',
      languages: '',
      interests: ''
    }
  });
  
  const { toast } = useToast();
  const url = `${import.meta.env.VITE_AUTH_BACKEND_URL}` || "http://localhost:8000";

  useEffect(() => {
    if (user) {
      const profile = user.profile ? JSON.parse(user.profile) : {};
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
          education: profile.education || '',
          skills: profile.skills || '',
          workExperience: profile.workExperience || '',
          projects: profile.projects || '',
          certifications: profile.certifications || '',
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
    const fields = Object.values(formData.profile);
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const [progress, setProgress] = useState(0);
  const [openSections, setOpenSections] = useState({
    personal: true,
    professional: false,
    education: false,
    skills: false
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
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <div className="flex items-start">
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.profile.bio}
                        onChange={handleInputChange}
                        className="flex-grow"
                        disabled={!isEditing}
                      />
                      {isEditing && (
                        <AIImprove
                          content={formData.profile.bio}
                          contentType="bio"
                          onImprove={(improved) => handleAIImprovement('bio', improved)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

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
                  <div className="flex items-start">
                    <Textarea
                      id="summary"
                      name="summary"
                      value={formData.profile.summary}
                      onChange={handleInputChange}
                      className="flex-grow"
                      disabled={!isEditing}
                    />
                    {isEditing && (
                      <AIImprove
                        content={formData.profile.summary}
                        contentType="summary"
                        onImprove={(improved) => handleAIImprovement('summary', improved)}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="workExperience">Work Experience</Label>
                  <div className="flex items-start">
                    <Textarea
                      id="workExperience"
                      name="workExperience"
                      value={formData.profile.workExperience}
                      onChange={handleInputChange}
                      className="flex-grow"
                      disabled={!isEditing}
                    />
                    {isEditing && (
                      <AIImprove
                        content={formData.profile.workExperience}
                        contentType="work_experience"
                        onImprove={(improved) => handleAIImprovement('workExperience', improved)}
                      />
                    )}
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
                  <Label htmlFor="education">Education</Label>
                  <Textarea
                    id="education"
                    name="education"
                    value={formData.profile.education}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="min-h-[100px] border-input focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Textarea
                    id="certifications"
                    name="certifications"
                    value={formData.profile.certifications}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="min-h-[100px] border-input focus:ring-2 focus:ring-primary"
                  />
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
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    name="skills"
                    value={formData.profile.skills}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="min-h-[100px] border-input focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projects">Projects</Label>
                  <Textarea
                    id="projects"
                    name="projects"
                    value={formData.profile.projects}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="min-h-[150px] border-input focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </form>
  );
}
