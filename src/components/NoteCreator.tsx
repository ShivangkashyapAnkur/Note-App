import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square } from "lucide-react";
import { toast } from "sonner";

interface NoteCreatorProps {
  onCreateNote: (note: { title: string; content: string; type: 'text' | 'audio' }) => void;
}

export function NoteCreator({ onCreateNote }: NoteCreatorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // Set up speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(" ");
        setContent(transcript);
      };
      
      recognitionRef.current.start();
      setIsRecording(true);
      toast.success("Recording started!");

      // Stop after 1 minute
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 60000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    toast.success("Recording stopped!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }
    onCreateNote({
      title,
      content,
      type: isRecording ? 'audio' : 'text'
    });
    setTitle("");
    setContent("");
    toast.success("Note created!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl mx-auto p-4">
      <Input
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />
      <Textarea
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex justify-between">
        <Button type="submit">Create Note</Button>
        <Button
          type="button"
          variant="outline"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <Square className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>
    </form>
  );
}