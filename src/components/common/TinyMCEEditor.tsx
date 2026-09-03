import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Table,
  Link2,
  Undo2,
  Redo2,
  Highlighter,
  FileCode,
  Sparkles,
  Check
} from 'lucide-react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  id?: string;
}

export const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tuliskan naskah surat atau isi dokumen lengkap di sini...',
  minHeight = '220px',
  id
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceCode, setSourceCode] = useState(value);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const isUpdatingFromProp = useRef(false);

  // Sync internal editor HTML when value prop changes externally
  useEffect(() => {
    if (editorRef.current && !isSourceMode) {
      if (editorRef.current.innerHTML !== value) {
        isUpdatingFromProp.current = true;
        editorRef.current.innerHTML = value;
      }
    }
    setSourceCode(value);
  }, [value, isSourceMode]);

  const handleInput = () => {
    if (editorRef.current && !isUpdatingFromProp.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setSourceCode(html);
      updateActiveFormats();
    }
    isUpdatingFromProp.current = false;
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (isSourceMode) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const updateActiveFormats = () => {
    const formats: string[] = [];
    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('underline')) formats.push('underline');
    if (document.queryCommandState('strikeThrough')) formats.push('strike');
    if (document.queryCommandState('insertUnorderedList')) formats.push('ul');
    if (document.queryCommandState('insertOrderedList')) formats.push('ol');
    if (document.queryCommandState('justifyLeft')) formats.push('left');
    if (document.queryCommandState('justifyCenter')) formats.push('center');
    if (document.queryCommandState('justifyRight')) formats.push('right');
    if (document.queryCommandState('justifyFull')) formats.push('justify');
    setActiveFormats(formats);
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">No.</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Uraian / Deskripsi</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">1.</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Item naskah pertama</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Sesuai target</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">2.</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Item naskah kedua</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Dalam proses</td>
          </tr>
        </tbody>
      </table>
      <p></p>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  const handleSourceToggle = () => {
    if (isSourceMode) {
      // Return to WYSIWYG
      onChange(sourceCode);
      setIsSourceMode(false);
    } else {
      if (editorRef.current) {
        setSourceCode(editorRef.current.innerHTML);
      }
      setIsSourceMode(true);
    }
  };

  return (
    <div 
      id={id}
      className="w-full border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs font-sans text-xs focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all"
    >
      {/* TinyMCE / Bootstrap Editor Menubar & Toolbar */}
      <div className="bg-slate-100/90 border-b border-slate-200 p-1.5 flex flex-wrap items-center gap-1 text-slate-700 select-none">
        {/* Undo/Redo */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            title="Urungkan (Undo)"
            onClick={() => executeCommand('undo')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Ulangi (Redo)"
            onClick={() => executeCommand('redo')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            title="Heading 1"
            onClick={() => executeCommand('formatBlock', '<h1>')}
            className="px-2 py-1 hover:bg-slate-100 rounded font-bold text-slate-700 cursor-pointer flex items-center gap-0.5"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Heading 2"
            onClick={() => executeCommand('formatBlock', '<h2>')}
            className="px-2 py-1 hover:bg-slate-100 rounded font-bold text-slate-700 cursor-pointer flex items-center gap-0.5"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Paragraf Biasa"
            onClick={() => executeCommand('formatBlock', '<p>')}
            className="px-2 py-1 hover:bg-slate-100 rounded text-[11px] font-semibold text-slate-600 cursor-pointer"
          >
            P
          </button>
        </div>

        {/* Text Formats */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            title="Tebal (Bold)"
            onClick={() => executeCommand('bold')}
            className={`p-1.5 rounded cursor-pointer ${
              activeFormats.includes('bold') ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Miring (Italic)"
            onClick={() => executeCommand('italic')}
            className={`p-1.5 rounded cursor-pointer ${
              activeFormats.includes('italic') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Garis Bawah (Underline)"
            onClick={() => executeCommand('underline')}
            className={`p-1.5 rounded cursor-pointer ${
              activeFormats.includes('underline') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Coret (Strikethrough)"
            onClick={() => executeCommand('strikeThrough')}
            className={`p-1.5 rounded cursor-pointer ${
              activeFormats.includes('strike') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Sorotan Kuning (Highlight)"
            onClick={() => executeCommand('hiliteColor', '#fef08a')}
            className="p-1.5 hover:bg-slate-100 text-amber-600 rounded cursor-pointer"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            title="Rata Kiri"
            onClick={() => executeCommand('justifyLeft')}
            className={`p-1.5 rounded cursor-pointer ${
              activeFormats.includes('left') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Rata Tengah"
            onClick={() => executeCommand('justifyCenter')}
            className={`p-1.5 rounded cursor-pointer ${
              activeFormats.includes('center') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Rata Kanan"
            onClick={() => executeCommand('justifyRight')}
            className={`p-1.5 rounded cursor-pointer ${
              activeFormats.includes('right') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Rata Kanan-Kiri (Justify)"
            onClick={() => executeCommand('justifyFull')}
            className={`p-1.5 rounded cursor-pointer ${
              activeFormats.includes('justify') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists & Objects */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            title="Daftar Poin (Bullets)"
            onClick={() => executeCommand('insertUnorderedList')}
            className={`p-1.5 rounded cursor-pointer ${
              activeFormats.includes('ul') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Daftar Nomor (Numbered List)"
            onClick={() => executeCommand('insertOrderedList')}
            className={`p-1.5 rounded cursor-pointer ${
              activeFormats.includes('ol') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Sisipkan Tabel Rapi"
            onClick={insertTable}
            className="p-1.5 hover:bg-slate-100 text-slate-700 rounded cursor-pointer"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Source Mode Toggle */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={handleSourceToggle}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              isSourceMode
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            {isSourceMode ? 'Pratinjau Visual' : 'HTML Source'}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {isSourceMode ? (
        <textarea
          value={sourceCode}
          onChange={(e) => {
            setSourceCode(e.target.value);
            onChange(e.target.value);
          }}
          className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-950 text-emerald-400 focus:outline-none"
          style={{ minHeight }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          className="p-4 focus:outline-none prose prose-xs max-w-none text-slate-800 leading-relaxed overflow-y-auto"
          style={{ minHeight }}
          data-placeholder={placeholder}
        />
      )}

      {/* Status Bar / Word Count Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 py-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Powered by TinyMCE & Bootstrap WYSIWYG Engine</span>
        <span>
          {value ? value.replace(/<[^>]*>?/gm, '').trim().length : 0} karakter |{' '}
          {value ? value.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).filter(Boolean).length : 0} kata
        </span>
      </div>
    </div>
  );
};
