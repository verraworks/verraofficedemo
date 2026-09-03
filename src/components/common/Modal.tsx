import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface BootstrapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'fullscreen';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'fullscreen';
  actions?: React.ReactNode;
  backdrop?: 'static' | 'default' | boolean;
  centered?: boolean;
  scrollable?: boolean;
  headerIcon?: React.ReactNode;
  headerBadge?: string;
}

export const Modal: React.FC<BootstrapModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size,
  maxWidth,
  actions,
  backdrop = true,
  centered = true,
  scrollable = true,
  headerIcon,
  headerBadge
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const isStatic = (backdrop as string | boolean) === 'static';
        if (!isStatic) {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, backdrop]);

  if (!isOpen) return null;

  const actualSize = size || maxWidth || '2xl';

  const sizeClasses: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    fullscreen: 'max-w-full m-0 min-h-screen rounded-none'
  };

  const handleBackdropClick = () => {
    const isStatic = (backdrop as string | boolean) === 'static';
    if (!isStatic && backdrop !== false) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto no-print transition-all" role="dialog" aria-modal="true">
      {/* Bootstrap Modal Backdrop with Blur */}
      <div 
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Modal Dialog Container */}
      <div className={`flex min-h-full ${centered ? 'items-center' : 'items-start pt-12'} justify-center p-4 text-center sm:p-6`}>
        <div 
          className={`relative w-full ${sizeClasses[actualSize] || 'max-w-2xl'} transform rounded-2xl bg-white text-left shadow-2xl transition-all border border-slate-200 overflow-hidden my-6 duration-200 animate-in fade-in zoom-in-95`}
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              {headerIcon && <div className="text-indigo-600">{headerIcon}</div>}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-none">{title}</h3>
                  {headerBadge && (
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                      {headerBadge}
                    </span>
                  )}
                </div>
                {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
              </div>
            </div>
            
            <button
              id="btn-modal-close"
              type="button"
              onClick={onClose}
              className="btn-close rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className={`px-6 py-5 ${scrollable ? 'max-h-[calc(85vh-130px)] overflow-y-auto' : ''}`}>
            {children}
          </div>

          {/* Modal Footer */}
          {actions && (
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-3.5 bg-slate-50/80">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
