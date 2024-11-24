import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function SkillAssessment({ userId, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [progress, setProgress] = useState({ answered: 0, total: 0, percent_complete: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentSkills, setCurrentSkills] = useState({});
  const { toast } = useToast();
  const url = `${import.meta.env.VITE_AUTH_BACKEND_URL}` || "http://localhost:8000";

  const startAssessment = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${url}/api/skills/assessment/${userId}/start`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to start assessment');
      }
      
      const data = await response.json();
      if (!data.question) {
        throw new Error('No skills available for assessment');
      }
      
      setCurrentQuestion(data.question);
      setProgress(data.progress);
      setIsCompleted(false);
      setCurrentSkills({});
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to start skill assessment",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const answerQuestion = async (hasSkill) => {
    if (!currentQuestion || !userId) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        skill: currentQuestion.skill,
        has_skill: hasSkill
      });

      const response = await fetch(
        `${url}/api/skills/assessment/${userId}/answer?${params.toString()}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to record answer');
      }

      const data = await response.json();
      setCurrentSkills(data.current_skills);

      toast({
        title: hasSkill ? "Skill Added" : "Skill Skipped",
        description: hasSkill 
          ? `${currentQuestion.skill} has been added to your profile`
          : `${currentQuestion.skill} was not added to your profile`,
        variant: hasSkill ? "default" : "secondary",
      });

      if (data.message === "Assessment completed") {
        setIsCompleted(true);
        setCurrentQuestion(null);
        if (onComplete) {
          onComplete();
        }
        toast({
          title: "Success",
          description: "Skill assessment completed!",
        });
      } else {
        setCurrentQuestion(data.question);
        setProgress(data.progress);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to record answer",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const renderCurrentSkills = () => {
    if (!currentSkills || Object.keys(currentSkills).length === 0) {
      return null;
    }

    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">Your Current Skills</h3>
        <div className="space-y-3">
          {Object.entries(currentSkills).map(([category, skills]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-md font-medium text-gray-700">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Skill Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        {!currentQuestion && !isCompleted && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Take a quick assessment to identify your skills. We'll show you one skill at a time,
              and you can indicate whether you have experience with it.
            </p>
            <Button onClick={startAssessment} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                "Start Assessment"
              )}
            </Button>
          </div>
        )}

        {currentQuestion && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{currentQuestion.category}</h3>
              <p className="text-gray-600">Do you have experience with {currentQuestion.skill}?</p>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => answerQuestion(true)}
                disabled={isLoading}
                className="flex-1"
                variant="default"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Yes
              </Button>
              <Button
                onClick={() => answerQuestion(false)}
                disabled={isLoading}
                className="flex-1"
                variant="outline"
              >
                <XCircle className="mr-2 h-4 w-4" />
                No
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress.percent_complete)}%</span>
              </div>
              <Progress value={progress.percent_complete} className="w-full" />
              <p className="text-sm text-gray-600">
                {progress.answered} of {progress.total} questions answered
              </p>
            </div>

            {renderCurrentSkills()}
          </div>
        )}

        {isCompleted && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <p>Assessment completed!</p>
            </div>
            {renderCurrentSkills()}
            <Button onClick={startAssessment}>Start New Assessment</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
