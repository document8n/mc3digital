import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import debounce from 'lodash/debounce';

interface ProjectNotesProps {
  projectId: string;
  initialContent: string;
}

export function ProjectNotes({ projectId, initialContent }: ProjectNotesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        console.log('Saving notes to database...');
        const { error } = await supabase
          .from('projects')
          .update({ notes: editor.getHTML() })
          .eq('id', projectId);

        if (error) throw error;

        console.log('Notes saved successfully');
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

  return (
    <div className="w-full mt-4">
      <p className="text-sm text-gray-600 mb-2">Notes</p>
      <div className="border rounded-lg p-4 bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}