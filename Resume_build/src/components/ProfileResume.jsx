import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, Plus } from 'lucide-react';
import ResumeForm from './ResumeForm2';

export default function ProfileResume({ username }) {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const url = `${import.meta.env.VITE_AUTH_BACKEND_URL}` || "http://localhost:8000";

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${url}/api/resumes/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 404) {
        setResume(null);
        setError(null);
      } else if (!response.ok) {
        throw new Error('Failed to fetch resume');
      } else {
        const data = await response.json();
        setResume(data);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, [username]);

  const handleSaveResume = async (resumeData) => {
    try {
      const token = localStorage.getItem('token');
      const method = resume ? 'PUT' : 'POST';
      const response = await fetch(`${url}/api/resumes/`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resumeData)
      });

      if (!response.ok) {
        throw new Error('Failed to save resume');
      }

      const savedResume = await response.json();
      setResume(savedResume);
      setIsEditing(false);
      fetchResume(); // Refresh the resume data
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading resume: {error}
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Resume</h2>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
        <ResumeForm
          initialResumeData={resume}
          setResumeData={handleSaveResume}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resume</h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(true)}
        >
          {resume ? (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Resume
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Resume
            </>
          )}
        </Button>
      </div>

      {resume ? (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold">{resume.name}</h3>
            <p className="text-gray-600">{resume.title}</p>
          </div>

          {resume.summary && (
            <div>
              <h4 className="font-semibold mb-2">Summary</h4>
              <p>{resume.summary}</p>
            </div>
          )}

          {resume.experience?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Experience</h4>
              <div className="space-y-4">
                {resume.experience.map((exp, index) => (
                  <div key={index}>
                    <h5 className="font-medium">{exp.title}</h5>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                    <ul className="list-disc list-inside mt-2">
                      {exp.responsibilities?.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.education?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Education</h4>
              <div className="space-y-2">
                {resume.education.map((edu, index) => (
                  <div key={index}>
                    <h5 className="font-medium">{edu.degree}</h5>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.skills?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resume.projects?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Projects</h4>
              <div className="space-y-4">
                {resume.projects.map((project, index) => (
                  <div key={index}>
                    <h5 className="font-medium">{project.title}</h5>
                    <p>{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.certifications?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Certifications</h4>
              <div className="space-y-2">
                {resume.certifications.map((cert, index) => (
                  <div key={index}>
                    <h5 className="font-medium">{cert.title}</h5>
                    <p className="text-gray-600">{cert.organization}</p>
                    <p className="text-sm text-gray-500">{cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.languages?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {resume.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No resume created yet. Click the button above to create one.</p>
        </Card>
      )}
    </div>
  );
}
