//apps/admin/src/components/editor/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Minus,
} from 'lucide-react';
import { useEffect } from 'react';
import {FaYoutube} from 'react-icons/fa6';

import { cn } from '@kobi/ui';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'এখানে লিখুন…',
  disabled = false,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
    ],
    content: value || '',
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  });

  // Sync external value → editor
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', {
        emitUpdate: false,
      });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-[var(--color-admin-border)] rounded-md bg-white overflow-hidden focus-within:border-[var(--color-admin-accent)] transition-colors">
      <Toolbar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} />
    </div>
  );
}

// ---------------- Toolbar ----------------

function Toolbar({
  editor,
  disabled,
}: {
  editor: Editor;
  disabled: boolean;
}) {
  const Btn = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
        active
          ? 'bg-[var(--color-admin-primary)] text-white'
          : 'text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] hover:text-[var(--color-admin-text)]',
      )}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <span className="w-px h-5 bg-[var(--color-admin-border)] mx-1" />
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-[var(--color-admin-border)] bg-[var(--color-admin-bg)]">
      <Btn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="বোল্ড"
      >
        <Bold className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="ইটালিক"
      >
        <Italic className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        title="স্ট্রাইক"
      >
        <Strikethrough className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
        title="কোড"
      >
        <Code className="w-4 h-4" />
      </Btn>

      <Divider />

      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="শিরোনাম ১"
      >
        <Heading1 className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="শিরোনাম ২"
      >
        <Heading2 className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="শিরোনাম ৩"
      >
        <Heading3 className="w-4 h-4" />
      </Btn>

      <Divider />

      <Btn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="বুলেট লিস্ট"
      >
        <List className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="নম্বরযুক্ত লিস্ট"
      >
        <ListOrdered className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="উদ্ধৃতি"
      >
        <Quote className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="বিভাজক"
      >
        <Minus className="w-4 h-4" />
      </Btn>

      <Divider />

      <Btn
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
        title="বাঁয়ে"
      >
        <AlignLeft className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
        title="কেন্দ্রে"
      >
        <AlignCenter className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
        title="ডানে"
      >
        <AlignRight className="w-4 h-4" />
      </Btn>

      <Divider />

      <Btn
        onClick={() => {
          const url = window.prompt('URL দিন:');
          if (!url) return;
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
        }}
        active={editor.isActive('link')}
        title="লিংক"
      >
        <LinkIcon className="w-4 h-4" />
      </Btn>

      <Btn
        onClick={() => {
          const url = window.prompt('ছবির URL দিন:');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        title="ছবি"
      >
        <ImageIcon className="w-4 h-4" />
      </Btn>

      <Btn
        onClick={() => {
          const url = window.prompt('YouTube ভিডিও URL দিন:');
          if (url) editor.commands.setYoutubeVideo({ src: url });
        }}
        title="YouTube"
      >
        <FaYoutube className="w-4 h-4" />
      </Btn>

      <Divider />

      <Btn
        onClick={() => editor.chain().focus().undo().run()}
        title="আনডু"
      >
        <Undo className="w-4 h-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().redo().run()}
        title="রিডু"
      >
        <Redo className="w-4 h-4" />
      </Btn>
    </div>
  );
}