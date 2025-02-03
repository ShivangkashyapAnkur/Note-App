import { useState } from "react";
import { Input } from "@/components/ui/input";
import { NoteCard } from "@/components/NoteCard";
import { NoteCreator } from "@/components/NoteCreator";
import { Search } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'audio';
  createdAt: Date;
  isFavorite: boolean;
  imageUrl?: string;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateNote = (noteData: { title: string; content: string; type: 'text' | 'audio' }) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      ...noteData,
      createdAt: new Date(),
      isFavorite: false
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <NoteCreator onCreateNote={handleCreateNote} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDeleteNote}
              onUpdate={handleUpdateNote}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;