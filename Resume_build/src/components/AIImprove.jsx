import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wand2, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function AIImprove({ content, contentType, onImprove }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [improvedContent, setImprovedContent] = useState("");
  const [prompt, setPrompt] = useState("");
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
          original_text: content,
          context: prompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to improve content');
      }

      const data = await response.json();
      setImprovedContent(data.corrected_text);
      setShowDialog(true);

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

  const handleAccept = () => {
    onImprove(improvedContent);
    setShowDialog(false);
    setPrompt("");
    toast({
      title: "Success",
      description: "Content updated successfully!",
    });
  };

  const handleReject = () => {
    setShowDialog(false);
    setPrompt("");
    toast({
      title: "Cancelled",
      description: "No changes were made.",
    });
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Enter instructions for AI improvement..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleImprove}
          disabled={isLoading || !content.trim()}
        >
          <Wand2 className="w-4 h-4 mr-1" />
          {isLoading ? "Improving..." : "Improve"}
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Suggested Improvement</DialogTitle>
            <DialogDescription>
              Review the suggested changes below. Click Accept to apply them or Cancel to keep the original.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">Original Content:</h4>
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">{content}</p>
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium">Improved Content:</h4>
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">{improvedContent}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleReject}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleAccept}>
              <Check className="w-4 h-4 mr-1" />
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
