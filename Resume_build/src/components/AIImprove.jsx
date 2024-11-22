import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function AIImprove({ content, contentType, onImprove }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const url = `${import.meta.env.VITE_AUTH_BACKEND_URL}` || "http://localhost:8000";

  const handleImprove = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to improve",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
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

      const response = await fetch(`${url}/api/ai/improve-content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content_type: contentType,
          original_text: content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to improve content');
      }

      const data = await response.json();
      
      // Call the parent component's callback with improved content
      onImprove(data.corrected_text);

      // Show suggestions if available
      if (data.suggestions && data.suggestions.length > 0) {
        toast({
          title: "Suggestions for improvement",
          description: (
            <ul className="list-disc pl-4">
              {data.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          ),
          duration: 10000 // Show for 10 seconds
        });
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to improve content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleImprove}
      disabled={isLoading || !content.trim()}
      className="ml-2"
    >
      <Wand2 className="w-4 h-4 mr-1" />
      {isLoading ? "Improving..." : "Improve with AI"}
    </Button>
  );
}
