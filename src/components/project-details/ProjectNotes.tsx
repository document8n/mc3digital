import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Bold, Italic, Heading1, List, Link, Code, Strikethrough } from "lucide-react";
import debounce from 'lodash/debounce';
import { useState } from 'react';

interface ProjectNotesProps {
  projectId: string;
  initialContent: string;
}

export function ProjectNotes({ projectId, initialContent }: ProjectNotesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSynced, setIsSynced] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[3em] max-h-[12em] overflow-y-auto w-full',
      },
    },
    onUpdate: debounce(async ({ editor }) => {
      try {
        setIsSynced(false);
        console.log('Saving notes to database...');
        const { error } = await supabase
          .from('projects')
          .update({ notes: editor.getHTML() })
          .eq('id', projectId);

        if (error) throw error;

        console.log('Notes saved successfully');
        setIsSynced(true);
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      } catch (error: any) {
        console.error('Error updating notes:', error);
        toast({
          title: "Error",
          description: "Failed to save notes",
          variant: "destructive",
        });
      }
    }, 1000),
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full mt-4">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-sm text-gray-600">Notes</p>
        {isSynced && <Check className="w-4 h-4 text-black" />}
      </div>
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="border-b px-4 py-2 flex items-center gap-1 bg-gray-50">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
            }`}
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor.isActive('bold') ? 'bg-gray-200' : ''
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor.isActive('italic') ? 'bg-gray-200' : ''
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor.isActive('strike') ? 'bg-gray-200' : ''
            }`}
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1 rounded hover:bg-gray-200 ${
              editor.isActive('code') ? 'bg-gray-200' : ''
            }`}
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}