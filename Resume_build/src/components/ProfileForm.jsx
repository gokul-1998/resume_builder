import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
        name: user.name || '',
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

      const updatedUser = await response.json();
      onProfileUpdate(updatedUser);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Profile Information</CardTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                  }}
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              ) : (
                <>
                  <Button type="submit" variant="default">
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Information */}
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.profile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
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
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                name="summary"
                value={formData.profile.summary}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
              />
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                name="education"
                value={formData.profile.education}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                placeholder="List your educational qualifications..."
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                name="skills"
                value={formData.profile.skills}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                placeholder="List your technical and soft skills..."
              />
            </div>

            {/* Work Experience */}
            <div className="space-y-2">
              <Label htmlFor="workExperience">Work Experience</Label>
              <Textarea
                id="workExperience"
                name="workExperience"
                value={formData.profile.workExperience}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={6}
                placeholder="Detail your work experience..."
              />
            </div>

            {/* Projects */}
            <div className="space-y-2">
              <Label htmlFor="projects">Projects</Label>
              <Textarea
                id="projects"
                name="projects"
                value={formData.profile.projects}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                placeholder="List your significant projects..."
              />
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Textarea
                id="certifications"
                name="certifications"
                value={formData.profile.certifications}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                placeholder="List your certifications..."
              />
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label htmlFor="languages">Languages Known</Label>
              <Input
                id="languages"
                name="languages"
                value={formData.profile.languages}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., English, Spanish, French"
              />
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label htmlFor="interests">Interests & Hobbies</Label>
              <Input
                id="interests"
                name="interests"
                value={formData.profile.interests}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="List your interests and hobbies..."
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.profile.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  value={formData.profile.github}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.profile.linkedin}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.profile.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
