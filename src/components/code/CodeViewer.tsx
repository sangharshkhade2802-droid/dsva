import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  Copy, 
  Check, 
  Download, 
  Code2, 
  FileCode, 
  Info,
  Maximize2,
  Minimize2,
  Lock,
  Unlock
} from 'lucide-react';
import { CCodeMetadata } from '../../engine/cSourceRegistry';

interface CodeViewerProps {
  codeMetadata: CCodeMetadata;
  activeLine?: number;
  height?: string;
  onCodeChange?: (newCode: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  codeMetadata,
  activeLine,
  height = '420px',
  onCodeChange,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  
  const [copied, setCopied] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExplanations, setShowExplanations] = useState(true);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define custom VS Code dark theme for C code
    monaco.editor.defineTheme('dsva-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'type', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#1e293b55',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#10b981',
      },
    });

    monaco.editor.setTheme('dsva-dark');
  };

  // Synchronize line highlighting with algorithm execution step!
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (activeLine && activeLine > 0) {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: new monaco.Range(activeLine, 1, activeLine, 1),
          options: {
            isWholeLine: true,
            className: 'bg-emerald-500/20 border-l-4 border-emerald-400 font-bold',
            glyphMarginClassName: 'myGlyphMarginClass',
          },
        },
      ]);
      editor.revealLineInCenterIfOutsideViewport(activeLine);
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }
  }, [activeLine]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeMetadata.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeMetadata.code], { type: 'text/x-csrc' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${codeMetadata.id}.c`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden glass-panel ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}>
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-semibold text-slate-200">
            {codeMetadata.id}.c
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
            C11 Standard
          </span>
          {activeLine && activeLine > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono animate-pulse">
              Executing Line {activeLine}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          {/* Read-only / Editable toggle */}
          <button
            onClick={() => setIsEditable(!isEditable)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              isEditable 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isEditable ? 'Switch to read-only' : 'Enable in-line edits'}
          >
            {isEditable ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isEditable ? 'Editable' : 'Read-Only'}</span>
          </button>

          {/* Key explanations toggle */}
          {codeMetadata.keySectionExplanations && codeMetadata.keySectionExplanations.length > 0 && (
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                showExplanations ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Toggle Code Section Breakdown"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title="Copy C source"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title="Download .c file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-[300px]">
        <Editor
          height={isFullscreen ? 'calc(100vh - 120px)' : height}
          language="c"
          value={codeMetadata.code}
          onChange={(newVal) => onCodeChange?.(newVal || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            readOnly: !isEditable,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            automaticLayout: true,
            tabSize: 4,
            bracketPairColorization: { enabled: true },
            glyphMargin: false,
          }}
        />
      </div>

      {/* Code Section Explanations Footer Drawer */}
      {showExplanations && codeMetadata.keySectionExplanations && (
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 text-xs">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5" />
            <span>Key Architectural Sections in C</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {codeMetadata.keySectionExplanations.map((sec, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200">{sec.title}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Lines {sec.lines}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{sec.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
