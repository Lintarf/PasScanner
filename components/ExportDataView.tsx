import React, { useState, useEffect } from 'react';
import { IdCardData } from '../types';
import { getAllStoredDates, getScanDataByDate, exportAllData } from '../services/storageService';
import { DownloadIcon, CalendarIcon } from './Icons';
import DateRangePicker from './DateRangePicker';

interface ExportDataViewProps {
  onGoToDashboard: () => void;
}

const ExportDataView: React.FC<ExportDataViewProps> = ({ onGoToDashboard }) => {
  const [storedDates, setStoredDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [scanData, setScanData] = useState<IdCardData[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Load stored dates on component mount
  useEffect(() => {
    const dates = getAllStoredDates();
    setStoredDates(dates);
    
    // Set default selected date to today if available
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, []);

  // Load scan data when selected date changes
  useEffect(() => {
    if (selectedDate) {
      const data = getScanDataByDate(selectedDate);
      setScanData(data);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleExportAll = () => {
    try {
      const jsonData = exportAllData();
      downloadJson(jsonData, 'pas-scanner-all-data.json');
    } catch (error) {
      console.error('Error exporting all data:', error);
      alert('Gagal mengekspor data');
    }
  };

  const handleExportSelected = () => {
    if (!selectedDate) return;
    
    try {
      const data = getScanDataByDate(selectedDate);
      const jsonData = JSON.stringify(data, null, 2);
      downloadJson(jsonData, `pas-scanner-data-${selectedDate}.json`);
    } catch (error) {
      console.error('Error exporting selected data:', error);
      alert('Gagal mengekspor data');
    }
  };

  const downloadJson = (jsonData: string, filename: string) => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDateApply = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setIsDatePickerOpen(false);
    // Filter data based on date range could be implemented here
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h1 className="text-lg sm:text-xl font-bold text-white">Data Tersimpan</h1>
        <button
          onClick={onGoToDashboard}
          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
        >
          Kembali ke Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Panel Tanggal */}
        <div className="bg-gray-800 rounded-lg p-2 sm:p-3 border border-gray-700">
          <h2 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">Tanggal Tersimpan</h2>
          {storedDates.length > 0 ? (
            <div className="space-y-1 max-h-40 sm:max-h-80 overflow-y-auto">
              {storedDates.map(date => (
                <button
                  key={date}
                  onClick={() => handleDateSelect(date)}
                  className={`w-full text-left px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${selectedDate === date ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                >
                  {date}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-3 text-xs sm:text-sm">Tidak ada data tersimpan</p>
          )}
        </div>

        {/* Panel Data */}
        <div className="bg-gray-800 rounded-lg p-2 sm:p-3 border border-gray-700 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 mb-2 sm:mb-3">
            <h2 className="text-sm sm:text-base font-bold text-white">
              {selectedDate ? `Data Tanggal ${selectedDate}` : 'Pilih Tanggal'}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={handleExportSelected}
                disabled={!selectedDate}
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md flex items-center text-xs gap-1 ${!selectedDate ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
              >
                <DownloadIcon className="w-3 h-3" />
                <span>Ekspor Tanggal Ini</span>
              </button>
              <button
                onClick={handleExportAll}
                disabled={storedDates.length === 0}
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md flex items-center text-xs gap-1 ${storedDates.length === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'}`}
              >
                <DownloadIcon className="w-3 h-3" />
                <span>Ekspor Semua</span>
              </button>
            </div>
          </div>

          {selectedDate ? (
            scanData.length > 0 ? (
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-xs text-left text-gray-300 table-fixed">
                  <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                    <tr>
                      <th className="px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-tl-lg w-1/4">Nama</th>
                      <th className="px-1.5 py-1 sm:px-2 sm:py-1.5 w-1/5 hidden sm:table-cell">ID</th>
                      <th className="px-1.5 py-1 sm:px-2 sm:py-1.5 w-1/4">Perusahaan</th>
                      <th className="px-1.5 py-1 sm:px-2 sm:py-1.5 w-1/4 hidden md:table-cell">Area Akses</th>
                      <th className="px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-tr-lg w-1/4">Kedaluwarsa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanData.map((scan, index) => (
                      <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="px-1.5 py-1.5 sm:px-2 sm:py-2 truncate">{scan.name}</td>
                        <td className="px-1.5 py-1.5 sm:px-2 sm:py-2 font-mono text-xs truncate hidden sm:table-cell">{scan.idNumber}</td>
                        <td className="px-1.5 py-1.5 sm:px-2 sm:py-2 truncate">{scan.company}</td>
                        <td className="px-1.5 py-1.5 sm:px-2 sm:py-2 truncate hidden md:table-cell">{scan.accessAreas.join(', ')}</td>
                        <td className="px-1.5 py-1.5 sm:px-2 sm:py-2 truncate">{scan.expiryDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4 sm:py-6 text-xs sm:text-sm">Tidak ada data untuk tanggal ini</p>
            )
          ) : (
            <p className="text-gray-400 text-center py-4 sm:py-6 text-xs sm:text-sm">Pilih tanggal untuk melihat data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportDataView;