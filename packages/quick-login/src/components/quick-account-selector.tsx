'use client';

import { useEffect, useState } from 'react';
import type { QuickAccountSelectorProps } from '../types';
import { QuickAccountSheet } from './quick-account-sheet';

export function QuickAccountSelector({
  onAccountSelect,
  accounts,
  forceShow = false,
  position = 'top-right',
  sheetSide = 'right',
}: QuickAccountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const shouldShow = isDevelopment || forceShow;

  useEffect(() => {
    setIsMac(/Mac|iPhone/.test(navigator.userAgent));
  }, []);

  // Keyboard shortcut: Ctrl+Shift+L (or Cmd+Shift+L on Mac)
  useEffect(() => {
    if (!shouldShow) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shouldShow]);

  if (!shouldShow) {
    return null;
  }

  const positionClasses = {
    'top-right': 'right-4 top-4',
    'top-left': 'left-4 top-4',
    'bottom-right': 'right-4 bottom-4',
    'bottom-left': 'left-4 bottom-4',
  };

  const shortcutHint = isMac ? '⌘⇧L' : 'Ctrl+Shift+L';

  return (
    <>
      <div className={`fixed z-50 ${positionClasses[position]}`}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-colors hover:bg-black/80 flex items-center gap-2"
          aria-label="Ouvrir la selection de comptes de test"
        >
          <span>Comptes de test</span>
          <kbd className="text-[10px] text-white/50 font-mono">{shortcutHint}</kbd>
        </button>
      </div>

      <QuickAccountSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        accounts={accounts}
        onAccountSelect={onAccountSelect}
        side={sheetSide}
      />
    </>
  );
}
