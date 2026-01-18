import { Command, Zap, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function KeyboardShortcutsHelp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setShow(true);
      }
      if (e.key === 'Escape') {
        setShow(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-4 right-4 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all hover:scale-110 z-50"
        title="Keyboard Shortcuts (Shift + ?)"
      >
        <Command className="w-5 h-5" />
      </button>
    );
  }

  const shortcuts = [
    { keys: ['Ctrl', 'K'], action: 'Open Command Center' },
    { keys: ['Ctrl', 'D'], action: 'Open Dashboard' },
    { keys: ['Ctrl', 'S'], action: 'Open Scheduler' },
    { keys: ['Ctrl', 'B'], action: 'Open Basecamp' },
    { keys: ['Ctrl', 'E'], action: 'Open Employees' },
    { keys: ['Ctrl', 'P'], action: 'Print Current Page' },
    { keys: ['Ctrl', ','], action: 'Open Settings' },
    { keys: ['Shift', '?'], action: 'Show Keyboard Shortcuts' },
    { keys: ['Esc'], action: 'Close Modals/Go Back' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
        onClick={() => setShow(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900 to-purple-900 border-2 border-purple-500/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-purple-500/30 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={() => setShow(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-3">
            {shortcuts.map((shortcut, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-purple-200">{shortcut.action}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, i) => (
                    <span key={i}>
                      <kbd className="px-3 py-1 bg-slate-800 border-2 border-purple-500/30 rounded-lg text-white font-mono text-sm">
                        {key}
                      </kbd>
                      {i < shortcut.keys.length - 1 && (
                        <span className="mx-1 text-purple-400">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-purple-500/30 bg-slate-900/50 text-center">
            <p className="text-sm text-purple-300">
              Press <kbd className="px-2 py-1 bg-slate-800 border border-purple-500/30 rounded text-white font-mono text-xs">Esc</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
