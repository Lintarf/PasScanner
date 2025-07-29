import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import DashboardHomeView from './components/DashboardHomeView';
import ScannerView from './components/ScannerView';
import ManualScanView from './components/ManualScanView';
import ExportDataView from './components/ExportDataView';
import { IdCardData } from './types';
import ScanDetailModal from './components/ScanDetailModal';
import { useNotification } from './contexts/NotificationContext';
import { saveScanData } from './services/storageService';

export type Page = 'dashboard' | 'scanner' | 'manual-scan' | 'export-data';

const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [scanHistory, setScanHistory] = useState<IdCardData[]>([]);
  const [selectedScan, setSelectedScan] = useState<IdCardData | null>(null);
  const { addNotification } = useNotification();


  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const handleScanSuccess = (data: IdCardData) => {
    addNotification('Scan successful!', 'success');
    setScanHistory(prevHistory => [data, ...prevHistory]);
    // Langsung tampilkan detail dari scan yang baru berhasil
    setSelectedScan(data);
    
    // Simpan data ke localStorage
    try {
      saveScanData(data)
        .then(() => {
          console.log('Data berhasil disimpan ke localStorage');
          addNotification('Data berhasil disimpan', 'success');
        })
        .catch(error => {
          console.error('Gagal menyimpan data:', error);
          addNotification(`Gagal menyimpan data: ${error.message}`, 'error');
        });
    } catch (error) {
      console.error('Gagal menyimpan data:', error);
      if (error instanceof Error) {
        addNotification(`Gagal menyimpan data: ${error.message}`, 'error');
      } else {
        addNotification('Gagal menyimpan data', 'error');
      }
    }
  };

  const handleSelectScan = (scan: IdCardData) => {
    setSelectedScan(scan);
  };
  
  const handleCloseModal = () => {
    setSelectedScan(null);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHomeView onStartScan={() => navigateTo('scanner')} scanHistory={scanHistory} />;
      case 'scanner':
        return <ScannerView onGoToDashboard={() => navigateTo('dashboard')} onScanSuccess={handleScanSuccess} scanHistory={scanHistory} onScanSelect={handleSelectScan} />;
      case 'manual-scan':
        return <ManualScanView onGoToDashboard={() => navigateTo('dashboard')} onScanSuccess={handleScanSuccess} scanHistory={scanHistory} onScanSelect={handleSelectScan} />;
      case 'export-data':
        return <ExportDataView onGoToDashboard={() => navigateTo('dashboard')} />;
      default:
        return <DashboardHomeView onStartScan={() => navigateTo('scanner')} scanHistory={scanHistory} />;
    }
  };

  return (
    <>
      <DashboardLayout currentPage={currentPage} navigateTo={navigateTo}>
        {renderContent()}
      </DashboardLayout>
      {selectedScan && <ScanDetailModal scan={selectedScan} onClose={handleCloseModal} />}
    </>
  );
};


const App: React.FC = () => {
  return <MainApp />;
};

export default App;