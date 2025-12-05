import { User, Briefcase } from 'lucide-react';

export function ModeSwitcher({ mode, onToggle }) {
  return (
    <div className="mode-switcher">
      <button
        onClick={onToggle}
        className={`mode-button ${mode}`}
        aria-label={`Switch to ${mode === 'boss' ? 'employee' : 'boss'} mode`}
      >
        {mode === 'boss' ? (
          <>
            <Briefcase size={20} />
            <span>Boss Mode</span>
          </>
        ) : (
          <>
            <User size={20} />
            <span>Employee Mode</span>
          </>
        )}
      </button>
    </div>
  );
}


