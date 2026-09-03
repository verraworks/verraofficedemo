import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export interface Select2Option {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface Select2Props {
  options: Select2Option[];
  value: string | string[];
  onChange: (val: any) => void;
  placeholder?: string;
  isMulti?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Select2: React.FC<Select2Props> = ({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  isMulti = false,
  searchable = true,
  disabled = false,
  className = '',
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen, searchable]);

  const filteredOptions = options.filter(opt => {
    const labelMatch = opt.label.toLowerCase().includes(searchTerm.toLowerCase());
    const sublabelMatch = opt.sublabel ? opt.sublabel.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    return labelMatch || sublabelMatch;
  });

  const isSelected = (val: string) => {
    if (isMulti && Array.isArray(value)) {
      return value.includes(val);
    }
    return value === val;
  };

  const handleSelect = (val: string) => {
    if (isMulti) {
      const current = Array.isArray(value) ? [...value] : [];
      if (current.includes(val)) {
        onChange(current.filter(item => item !== val));
      } else {
        onChange([...current, val]);
      }
    } else {
      onChange(val);
      setIsOpen(false);
    }
  };

  const removeTag = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMulti && Array.isArray(value)) {
      onChange(value.filter(item => item !== val));
    }
  };

  const selectedOptions = options.filter(opt => isSelected(opt.value));

  return (
    <div 
      ref={containerRef} 
      id={id}
      className={`relative w-full text-xs font-sans ${disabled ? 'opacity-60 pointer-events-none' : ''} ${className}`}
    >
      {/* Control Box */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full min-h-[38px] px-3 py-1.5 bg-white rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
          isOpen
            ? 'border-indigo-600 ring-2 ring-indigo-500/10 shadow-xs'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <div className="flex-1 flex flex-wrap items-center gap-1.5 overflow-hidden">
          {isMulti ? (
            selectedOptions.length > 0 ? (
              selectedOptions.map(opt => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/80 text-[11px]"
                >
                  {opt.label}
                  <button
                    type="button"
                    onClick={(e) => removeTag(opt.value, e)}
                    className="hover:text-indigo-900 rounded-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-slate-400">{placeholder}</span>
            )
          ) : selectedOptions.length > 0 ? (
            <div className="flex items-center gap-2 truncate">
              {selectedOptions[0].icon && <span>{selectedOptions[0].icon}</span>}
              <span className="font-semibold text-slate-800 truncate">{selectedOptions[0].label}</span>
              {selectedOptions[0].sublabel && (
                <span className="text-slate-400 text-[11px] truncate">({selectedOptions[0].sublabel})</span>
              )}
            </div>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>

        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {searchable && (
            <div className="p-2 border-b border-slate-100 bg-slate-50/70">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ketik untuk mencari opsi..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="py-4 px-3 text-center text-slate-400 text-xs font-medium">
                Tidak ada data yang cocok
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const active = isSelected(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                      active
                        ? 'bg-indigo-50 text-indigo-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="text-slate-500">{opt.icon}</span>}
                      <div className="truncate">
                        <p className="truncate text-xs">{opt.label}</p>
                        {opt.sublabel && <p className="text-[10px] text-slate-400 truncate">{opt.sublabel}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      {opt.badge && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                          {opt.badge}
                        </span>
                      )}
                      {active && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
