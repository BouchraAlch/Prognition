"use client";

import type { Editor } from "@tiptap/react";

interface Props {
  editor: Editor | null;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
        text-sm transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-black
        disabled:cursor-not-allowed disabled:opacity-40
        ${
          active
            ? "bg-black text-white shadow-sm"
            : "text-black/75 hover:bg-gray-100 hover:text-black"
        }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="my-1 h-px w-6 bg-gray-300" />;
}

// Standard color palette
const COLORS = [
  // Basic colors
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#008000", // Green
  "#FFA500", // Orange
  "#800080", // Purple

  // Additional colors
  "#FFC0CB", // Pink
  "#A52A2A", // Brown
  "#808080", // Gray
  "#00FFFF", // Cyan
  "#00FF00", // Lime
  "#800000", // Maroon
  "#000080", // Navy
  "#808000", // Olive
];

const FONT_SIZES = ["12px", "14px", "16px", "18px", "24px", "32px"];

export function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>

      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>

      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <u>U</u>
      </ToolbarButton>

      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <s>S</s>
      </ToolbarButton>

      <Divider />

      {[1, 2, 3].map((level) => (
        <ToolbarButton
          key={level}
          label={`Heading ${level}`}
          active={editor.isActive("heading", { level })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: level as 1 | 2 | 3 })
              .run()
          }
        >
          <span className="text-xs font-bold">H{level}</span>
        </ToolbarButton>
      ))}

      <Divider />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </ToolbarButton>

      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <span className="text-xs">1.</span>
      </ToolbarButton>

      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        "
      </ToolbarButton>

      <ToolbarButton
        label="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <span className="text-xs">{"</>"}</span>
      </ToolbarButton>

      <Divider />

      <select
        aria-label="Font size"
        title="Font size"
        defaultValue=""
        onChange={(e) => {
          const size = e.target.value;
          if (size) editor.chain().focus().setFontSize(size).run();
          e.target.value = "";
        }}
        className="w-10 rounded-lg border border-gray-300 bg-white
          px-0.5 py-1 text-[11px] font-semibold text-black/75 outline-none
          focus:border-black focus:ring-2 focus:ring-black/20"
      >
        <option value="">Aa</option>
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size.replace("px", "")}
          </option>
        ))}
      </select>

      <Divider />

      {/* Text color palette */}
      <div className="flex flex-col items-center gap-2 py-1">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Set text color ${color}`}
            title={`Text color ${color}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setColor(color).run()}
            className="h-4 w-4 rounded-full border border-gray-300
              ring-1 ring-black/10 transition-transform
              hover:scale-125 focus:outline-none focus-visible:ring-2
              focus-visible:ring-black"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}