import { IdCardData } from '../types';

// Prefix untuk localStorage keys
const STORAGE_PREFIX = 'pas_scanner_data_';

/**
 * Mendapatkan key localStorage berdasarkan tanggal
 * @returns Key dengan format pas_scanner_data_YYYY-MM-DD
 */
function getDateBasedKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${STORAGE_PREFIX}${year}-${month}-${day}`;
}

/**
 * Menyimpan data hasil pemindaian ke localStorage berdasarkan tanggal
 * @param scanData Data hasil pemindaian
 */
export async function saveScanData(scanData: IdCardData): Promise<void> {
  try {
    const key = getDateBasedKey();
    
    // Cek apakah data sudah ada di localStorage
    let existingData: IdCardData[] = [];
    const storedData = localStorage.getItem(key);
    
    if (storedData) {
      existingData = JSON.parse(storedData);
    } else {
      console.log(`Creating new storage for today: ${key}`);
    }
    
    // Tambahkan data baru ke array
    existingData.push(scanData);
    
    // Simpan kembali ke localStorage
    localStorage.setItem(key, JSON.stringify(existingData));
    console.log(`Scan data saved to localStorage with key: ${key}`);
    
    // Perbarui daftar tanggal yang tersimpan
    updateStoredDatesList(key);
    
    return;
  } catch (error) {
    console.error('Error saving scan data:', error);
    throw new Error('Failed to save scan data');
  }
}

/**
 * Memperbarui daftar tanggal yang tersimpan
 * @param newKey Key baru yang akan ditambahkan ke daftar
 */
function updateStoredDatesList(newKey: string): void {
  try {
    const datesListKey = `${STORAGE_PREFIX}dates_list`;
    let datesList: string[] = [];
    
    const storedList = localStorage.getItem(datesListKey);
    if (storedList) {
      datesList = JSON.parse(storedList);
    }
    
    // Ekstrak tanggal dari key (format: pas_scanner_data_YYYY-MM-DD)
    const date = newKey.replace(STORAGE_PREFIX, '');
    
    // Tambahkan ke daftar jika belum ada
    if (!datesList.includes(date)) {
      datesList.push(date);
      // Urutkan berdasarkan tanggal (terbaru dulu)
      datesList.sort().reverse();
      localStorage.setItem(datesListKey, JSON.stringify(datesList));
    }
  } catch (error) {
    console.error('Error updating dates list:', error);
  }
}

/**
 * Mendapatkan semua data pemindaian untuk tanggal tertentu
 * @param date Tanggal dalam format YYYY-MM-DD (opsional, default: hari ini)
 * @returns Array data pemindaian
 */
export function getScanDataByDate(date?: string): IdCardData[] {
  try {
    let key;
    if (date) {
      key = `${STORAGE_PREFIX}${date}`;
    } else {
      key = getDateBasedKey();
    }
    
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    // Data tidak ditemukan, kembalikan array kosong
    return [];
  } catch (error) {
    console.error('Error reading scan data:', error);
    return [];
  }
}

/**
 * Mendapatkan daftar semua tanggal yang memiliki data pemindaian
 * @returns Array tanggal (format YYYY-MM-DD)
 */
export function getAllStoredDates(): string[] {
  try {
    const datesListKey = `${STORAGE_PREFIX}dates_list`;
    const storedList = localStorage.getItem(datesListKey);
    
    if (storedList) {
      return JSON.parse(storedList);
    }
    
    return [];
  } catch (error) {
    console.error('Error listing stored dates:', error);
    return [];
  }
}

/**
 * Mengekspor semua data pemindaian sebagai file JSON
 * @returns String JSON yang berisi semua data pemindaian
 */
export function exportAllData(): string {
  try {
    const allData: { [date: string]: IdCardData[] } = {};
    const dates = getAllStoredDates();
    
    dates.forEach(date => {
      const key = `${STORAGE_PREFIX}${date}`;
      const storedData = localStorage.getItem(key);
      
      if (storedData) {
        allData[date] = JSON.parse(storedData);
      }
    });
    
    return JSON.stringify(allData, null, 2);
  } catch (error) {
    console.error('Error exporting all data:', error);
    throw new Error('Failed to export all data');
  }
}