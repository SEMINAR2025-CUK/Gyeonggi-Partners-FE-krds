/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2, 
  Undo, 
  Redo,
  Code,
  Quote
} from 'lucide-react';
import { Button } from '@krds-ui/core';
import { TextInput } from '@krds-ui/core'
import { ProposalPayload } from '../types/discussion';

interface ProposalEditorProps {
  roomId: number;
  initialTitle?: string;
  initialContent?: string;
  onSave: (payload: ProposalPayload) => Promise<void>;
  onCancel: () => void;
}

export const ProposalEditor = ({
  roomId,
  initialTitle = '',
  initialContent = '',
  onSave,
  onCancel,
}: ProposalEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: '제안서 내용을 작성해주세요...',
      }),
      CharacterCount,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  const handleSave = async () => {
    if (!editor || !title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const content = editor.getHTML();
    if (!content || content === '<p></p>') {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        roomId,
        title: title.trim(),
        content,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <TextInput
          id={title}
          title={title}
          onChange={(e) => setTitle(e.target.value)}
          helpText="제안서 제목을 입력하세요"
          className="text-xl border-0 shadow-none focus-visible:ring-0 px-0"
        />
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap bg-gray-50">
        <Button
          variant="tertiary"
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          title="굵게 (Ctrl+B)"
          children={<Bold size={18} />}
        >
        </Button>

        <Button
          variant="tertiary"
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          title="기울임 (Ctrl+I)"
          children={<Italic size={18} />}
        >
        </Button>

        <Button
          variant="tertiary"
          size="small"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'bg-gray-200' : ''}
          title="인라인 코드"
          children ={<Code size={18} />}
        >
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="tertiary"
          size="small"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
          title="제목 2"
          children ={<Heading2 size={18} />}
        >
        </Button>

        <Button
          variant="tertiary"
          size="small"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          title="글머리 기호 목록"
          children ={<List size={18} />}
        >
        </Button>

        <Button
          variant="tertiary"
          size="small"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          title="번호 매기기 목록"
          children ={<ListOrdered size={18} />}
        >
        </Button>

        <Button
          variant="tertiary"
          size="small"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
          title="인용구"
          children ={<Quote size={18} />}
        >
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="tertiary"
          size="small"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="실행 취소 (Ctrl+Z)"
          children ={<Undo size={18} />}
        >
        </Button>

        <Button
          variant="tertiary"
          size="small"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="다시 실행 (Ctrl+Shift+Z)"
          children ={<Redo size={18} />}
        >
        </Button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
        <div className="text-sm text-gray-500">
          {(editor.storage.characterCount as any)?.characters?.() || 0} 글자
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isSaving}
            children="취소"
          >
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            children={isSaving ? '저장 중...' : '저장'}
          >
          </Button>
        </div>
      </div>
    </div>
  );
};
