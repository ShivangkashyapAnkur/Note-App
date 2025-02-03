import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Edit, Star, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'audio';
  createdAt: Date;
  isFavorite: boolean;
  imageUrl?: string;
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

export function NoteCard({ note, onDelete, onUpdate }: NoteCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(note.content);
    toast.success("Copied to clipboard!");
  };

  const handleDelete = () => {
    onDelete(note.id);
    toast.success("Note deleted!");
  };

  const handleSave = () => {
    onUpdate(note.id, {
      title: editedTitle,
      content: editedContent,
    });
    setIsEditing(false);
    toast.success("Note updated!");
  };

  const toggleFavorite = () => {
    onUpdate(note.id, {
      isFavorite: !note.isFavorite,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload to your storage service
      // For now, we'll just create an object URL
      const imageUrl = URL.createObjectURL(file);
      onUpdate(note.id, { imageUrl });
      toast.success("Image uploaded!");
    }
  };

  return (
    <>
      <Card className="w-full hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsOpen(true)}>
        <CardHeader className="font-semibold">{note.title}</CardHeader>
        <CardContent className="line-clamp-3">{note.content}</CardContent>
        <CardFooter className="gap-2">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleCopy(); }}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`${isFullscreen ? 'fixed inset-0 w-screen h-screen max-w-none' : ''}`}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="mt-2"
                />
              ) : (
                note.title
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[200px]"
              />
            ) : (
              <p className="whitespace-pre-wrap">{note.content}</p>
            )}
            {note.imageUrl && (
              <img src={note.imageUrl} alt="Note attachment" className="max-w-full h-auto rounded-lg" />
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              {isEditing && (
                <Button onClick={handleSave}>Save</Button>
              )}
              <Button variant="ghost" onClick={toggleFavorite}>
                <Star className={`h-4 w-4 ${note.isFavorite ? "fill-yellow-400" : ""}`} />
              </Button>
              <Button variant="ghost" onClick={() => setIsFullscreen(!isFullscreen)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id={`image-upload-${note.id}`}
              />
              <Button asChild>
                <label htmlFor={`image-upload-${note.id}`}>Upload Image</label>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}