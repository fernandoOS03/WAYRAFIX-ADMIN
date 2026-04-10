import { useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={clsx(
          "relative bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] border border-white/50 w-full mx-4 flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-300",
          maxWidth
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-8 pb-4">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all bg-gray-50/50 border border-transparent shadow-sm hover:shadow"
          >
            <X size={20} strokeWidth={2.5}/>
          </button>
        </div>
        
        {/* Body */}
        <div className="px-8 pb-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
