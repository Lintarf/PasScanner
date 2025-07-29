import React, { useEffect } from 'react';
import { IdCardData } from '../types';
import ResultsView from './ResultsView';
import { CancelIcon } from './Icons';

interface ScanDetailModalProps {
  scan: IdCardData;
  onClose: () => void;
}

const ScanDetailModal: React.FC<ScanDetailModalProps> = ({ scan, onClose }) => {
  // Menambahkan event listener untuk tombol Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Membersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Konten Modal */}
      <div className="relative z-10 w-full max-w-md transform transition-all my-4">
        <div className="relative max-h-[90vh] overflow-y-auto md:overflow-visible">
           <ResultsView data={scan} showActions={false} />
            <button
                onClick={onClose}
                className="absolute -top-2 -right-2 p-1.5 bg-gray-700 rounded-full text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close"
            >
                <CancelIcon className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ScanDetailModal;