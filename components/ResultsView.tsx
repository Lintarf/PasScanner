import React from 'react';
import { IdCardData } from '../types';
import { ScanIcon, UserIcon, DashboardIcon, UploadIcon } from './Icons';

interface ResultsViewProps {
  data: IdCardData;
  onRescan?: () => void;
  onGoToDashboard?: () => void;
  rescanButtonText?: string;
  rescanButtonIcon?: React.ReactNode;
  showActions?: boolean;
}

const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; isMono?: boolean; }> = ({ label, value, isMono = false }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
    <p className={`text-sm sm:text-base text-white break-words ${isMono ? 'font-mono' : 'font-medium'}`}>{value}</p>
  </div>
);

const ResultsView: React.FC<ResultsViewProps> = ({ data, onRescan, onGoToDashboard, rescanButtonText, rescanButtonIcon, showActions = true }) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <div className="w-full bg-gray-800 rounded-xl shadow-xl border border-gray-700">
        {/* Card Header */}
        <div className="bg-red-700 p-3">
          <h2 className="text-lg font-bold text-white text-center tracking-wide">{data.issuingAuthority}</h2>
        </div>
        <div className="bg-gray-900 p-1.5">
            <h3 className="text-xs font-semibold text-gray-200 text-center">{data.location}</h3>
        </div>

        {/* Card Body */}
        <div className="p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-xs font-bold text-gray-400">EXPIRY DATE</p>
                <p className="text-sm sm:text-base font-bold text-white font-mono tracking-wider">{data.expiryDate}</p>
            </div>

            {/* Responsive grid for photo and details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3 items-center sm:items-start">
              
              {/* Photo */}
              <div className="sm:col-span-1 flex justify-center">
                <div className="w-28 h-36 sm:w-full sm:h-auto sm:aspect-[3/4] bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-16 h-16 text-gray-500" />
                </div>
              </div>

              {/* Details */}
              <div className="sm:col-span-2 flex flex-col space-y-3 w-full text-center sm:text-left">
                  <InfoRow label="Name" value={data.name} />
                  <InfoRow label="Position" value={data.position} />
                  <InfoRow label="Company" value={data.company} />
              </div>
            </div>

            <div className="mt-4 border-t border-gray-700 pt-4 space-y-3">
              {/* Access Areas */}
              <div>
                <p className="text-center sm:text-left text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Access Areas</p>
                <div className="flex flex-row flex-wrap justify-center sm:justify-start gap-1.5">
                    {data.accessAreas?.length > 0 ? data.accessAreas.map(area => (
                        <span key={area} className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900/50 border border-gray-600 rounded-lg flex items-center justify-center text-base sm:text-lg font-bold text-white tracking-widest">{area}</span>
                    )) : <p className="text-gray-400 text-xs italic">No access areas</p>}
                </div>
              </div>
              
              {/* ID Number */}
              <div className="text-center sm:text-left pt-1.5">
                   <InfoRow label="ID Number" value={data.idNumber} isMono={true}/>
              </div>
            </div>

            {/* Scan Context Info */}
            <div className="mt-3 border-t border-gray-700 pt-3 space-y-2">
                <InfoRow label="Scan Area" value={data.scanArea} />
                <InfoRow label="Scan Time" value={new Date(data.scanTimestamp).toLocaleString('id-ID', {
                    day: '2-digit', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                })} />
            </div>
        </div>
      </div>

      {showActions && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
                onClick={onGoToDashboard}
                className="inline-flex items-center justify-center gap-x-1.5 px-4 py-2 border border-gray-600 text-sm font-medium rounded-full shadow-sm text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transform hover:scale-105 transition-transform duration-200"
              >
                <DashboardIcon className="w-4 h-4" />
                Back to Dashboard
            </button>
            <button
              onClick={onRescan}
              className="inline-flex items-center justify-center gap-x-1.5 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 transform hover:scale-105 transition-transform duration-200"
            >
              {rescanButtonIcon || (rescanButtonText?.includes("Upload") ? <UploadIcon className="w-4 h-4" /> : <ScanIcon className="w-4 h-4" />)}
              {rescanButtonText || 'Scan Another Card'}
            </button>
          </div>
      )}
    </div>
  );
};

export default ResultsView;