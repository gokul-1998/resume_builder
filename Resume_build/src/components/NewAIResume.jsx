"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Resume from './resume1'
import ResumeForm from './ResumeForm1'
import PrintButton from './PrintButton'

export default function NewAIResume() {
  const [jd, setJd] = useState('')
  const [resumeData, setResumeData] = useState({})
  const [showNewResume, setShowNewResume] = useState(false)

  const handleUpdateResume = () => {
    // Here you would typically send the JD to an AI service to update the resume
    // For this example, we'll just set some dummy data
    setResumeData({
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      // Add more fields as needed
    })
    setShowNewResume(true)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Job Description Input</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Paste the job description here..." 
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            className="min-h-[200px]"
          />
          <Button onClick={handleUpdateResume} className="mt-4">
            Update Resume
          </Button>
        </CardContent>
      </Card>

      {showNewResume && (
        <Card>
          <CardHeader>
            <CardTitle>Updated Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row h-screen">
              {/* Resume on the left */}
              <div className="w-full lg:w-1/2 bg-gray-100 p-4">
                <Resume resumeData={resumeData} />
              </div>

              {/* Form on the right, hidden during print */}
              <div className="w-full lg:w-1/2 bg-white p-4 hide-on-print">
                <ResumeForm />
              </div>
            </div>
            <PrintButton />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

