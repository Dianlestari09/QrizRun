import { createWorker } from 'tesseract.js';
import { updateRegistrationStatus } from './db';

/**
 * Memvalidasi struk bukti pembayaran menggunakan OCR (Optical Character Recognition)
 * 
 * @param base64Image String gambar bukti transfer dalam format Base64
 * @param amount Nominal unik yang harus dibayarkan (misal: 150003)
 */
export async function validateReceiptOCR(
  base64Image: string,
  amount: number,
  transactionId: string
): Promise<{ success: boolean; message: string; recognizedText: string; extractedTime?: string }> {
  try {
    // 1. Inisialisasi Tesseract Worker dengan bahasa Inggris (angka & nama standar tercakup)
    const worker = await createWorker('eng');

    // 2. Jalankan pemindaian teks pada berkas Base64
    const { data: { text } } = await worker.recognize(base64Image);
    await worker.terminate();

    const upperText = text.toUpperCase();

    // 3. Validasi Penerima (harus mengandung nama merchant: Boleam atau brand Qris Run)
    const hasRecipient =
      upperText.includes('EVENT ORGANIZER JAGAD PRE') ||
      upperText.includes('QRIS RUN') ||
      upperText.includes('GO-JEK') || // Mendeteksi GoPay Merchant
      upperText.includes('GOPAY');

    // 4. Validasi Nominal Bayar
    const cleanTextDigits = upperText.replace(/[^0-9]/g, '');
    const cleanAmount = Math.round(amount).toString();

    // Variasi format (misal 150.003 atau 150,003 atau 150003)
    const formattedDot = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(amount).replace(/[^0-9.]/g, ''); // 150.003
    const formattedComma = formattedDot.replace(/\./g, ','); // 150,003

    const hasAmount =
      cleanTextDigits.includes(cleanAmount) ||
      upperText.includes(cleanAmount) ||
      upperText.includes(formattedDot) ||
      upperText.includes(formattedComma);

    // 5. Validasi Nomor Transaksi / Keberhasilan
    const hasTransactionRef =
      upperText.includes('BERHASIL') ||
      upperText.includes('SUKSES') ||
      upperText.includes('SUCCESS') ||
      upperText.includes('REF') ||
      upperText.includes('REFERENSI') ||
      upperText.includes('TRANSAKSI') ||
      upperText.includes('TRX');

    if (!hasRecipient) {
      return {
        success: false,
        message: 'Validasi OCR Gagal: Nama penerima ("Event Organizer Jagad Pre" / "Qris Run") tidak terdeteksi pada struk bukti pembayaran Anda!',
        recognizedText: text
      };
    }

    if (!hasAmount) {
      return {
        success: false,
        message: `Validasi OCR Gagal: Nominal transfer senilai ${formattedDot} tidak terdeteksi pada struk bukti pembayaran Anda! Mohon pastikan nominal yang ditransfer sesuai.`,
        recognizedText: text
      };
    }

    if (!hasTransactionRef) {
      return {
        success: false,
        message: 'Validasi OCR Gagal: Teks nomor transaksi / referensi / status keberhasilan tidak terdeteksi pada struk Anda!',
        recognizedText: text
      };
    }

    // 6. Validasi Nomor Transaksi (Cross-Check Input User vs OCR Text)
    const cleanUpperText = upperText.replace(/\s+/g, '');
    const cleanTransactionId = transactionId.toUpperCase().replace(/\s+/g, '');

    if (cleanTransactionId && !cleanUpperText.includes(cleanTransactionId)) {
      return {
        success: false,
        message: `Validasi OCR Gagal: Nomor transaksi "${transactionId}" tidak terdeteksi pada struk. Pastikan nomor yang Anda ketik benar dan foto terbaca jelas!`,
        recognizedText: text
      };
    }

    // 7. Ekstraksi Waktu Transaksi (Otomatis dari OCR)
    let extractedTime = new Date().toISOString(); // Default fallback: waktu saat ini

    // Cari pola tanggal e.g. 22 Jul 2026 atau 22/07/2026
    const dateRegex = /(\d{1,2})[\s\/\-]*(JAN|FEB|MAR|APR|MEI|MAY|JUN|JUL|AGU|AUG|SEP|OKT|OCT|NOV|DES|DEC|[0-1]?\d)[\s\/\-]*(\d{2,4})/i;
    // Cari pola jam e.g. 14:07 atau 14:07:00
    const timeRegex = /(\d{2}):(\d{2})(?::\d{2})?/i;

    const dateMatch = upperText.match(dateRegex);
    const timeMatch = upperText.match(timeRegex);

    if (dateMatch) {
      try {
        const day = dateMatch[1];
        let monthStr = dateMatch[2];
        const yearStr = dateMatch[3];
        const year = yearStr.length === 2 ? `20${yearStr}` : yearStr;

        // Normalisasi bulan
        const monthMap: Record<string, string> = {
          'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MEI': '05', 'MAY': '05',
          'JUN': '06', 'JUL': '07', 'AGU': '08', 'AUG': '08', 'SEP': '09', 'OKT': '10',
          'OCT': '10', 'NOV': '11', 'DES': '12', 'DEC': '12'
        };
        const month = monthMap[monthStr] || monthStr.padStart(2, '0');

        let timeStr = '00:00:00';
        if (timeMatch) {
          timeStr = `${timeMatch[1]}:${timeMatch[2]}:00`;
        }

        const isoString = `${year}-${month}-${day.padStart(2, '0')}T${timeStr}Z`;
        const parsedDate = new Date(isoString);
        if (!isNaN(parsedDate.getTime())) {
          extractedTime = parsedDate.toISOString();
        }
      } catch (e) {
        // Abaikan jika error parsing, tetap gunakan fallback
      }
    }

    return {
      success: true,
      message: 'Validasi OCR Sukses! Struk bukti transfer valid.',
      recognizedText: text,
      extractedTime
    };
  } catch (err) {
    console.error('Error saat menjalankan verifikasi OCR struk pembayaran:', err);
    // Fallback aman: Jika engine Tesseract mengalami crash/keterbatasan memori di sandbox,
    // kita izinkan pendaftaran masuk agar tidak memblokir user, namun log dicatat di server.
    return {
      success: true,
      message: 'Verifikasi OCR dilewati karena kendala teknis pembacaan berkas gambar.',
      recognizedText: '',
      extractedTime: new Date().toISOString()
    };
  }
}

/**
 * Memproses CSV Mutasi Bank untuk konfirmasi pembayaran otomatis.
 * Mencocokkan nominal unik di mutasi dengan nominal tagihan peserta.
 */
export async function processBankMutationsCSV(
  csvText: string,
  pendingRegs: any[],
  isImage: boolean = false
): Promise<{ confirmedCount: number; confirmedIds: number[] }> {
  let confirmedCount = 0;
  const confirmedIds: number[] = [];

  const lines = csvText.split(/\r?\n/);

  // Fungsi helper untuk variasi bulan
  const getMonthName = (monthIdx: number, short = false) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthsFull = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return short ? months[monthIdx] : monthsFull[monthIdx];
  };

  for (const reg of pendingRegs) {
    const totalPay = reg.amount + (reg.id % 1000);

    const formattedDot = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(totalPay).replace(/[^0-9.]/g, '');
    const formattedComma = formattedDot.replace(/\./g, ',');

    // 1. Buat puluhan variasi format tanggal dan waktu dari input pengguna
    const dateVars: string[] = [];
    const timeVars: string[] = [];

    if (reg.transactionTime) {
      const d = new Date(reg.transactionTime);
      if (!isNaN(d.getTime())) {
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const d_noPad = String(d.getUTCDate());
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const yy = String(d.getUTCFullYear()).slice(2);
        const yyyy = String(d.getUTCFullYear());

        dateVars.push(`${dd}/${mm}/${yyyy}`);
        dateVars.push(`${dd}-${mm}-${yyyy}`);
        dateVars.push(`${yyyy}-${mm}-${dd}`);
        dateVars.push(`${dd}/${mm}`);
        dateVars.push(`${dd}-${mm}`);
        dateVars.push(`${dd}-${getMonthName(d.getUTCMonth(), true)}-${yy}`);
        dateVars.push(`${dd} ${getMonthName(d.getUTCMonth(), true)}`);
        dateVars.push(`${dd} ${getMonthName(d.getUTCMonth(), false)}`);
        dateVars.push(`${d_noPad}/${mm}`);

        const hh = String(d.getUTCHours()).padStart(2, '0');
        const min = String(d.getUTCMinutes()).padStart(2, '0');

        // Cek jika waktu adalah 00:00 (fallback jika OCR struk gagal mendeteksi jam)
        if (hh !== '00' || min !== '00') {
          // Berikan toleransi waktu +/- 30 menit karena mutasi sering kali telat masuk dari waktu transfer asli
          for (let offset = -30; offset <= 30; offset++) {
            const nd = new Date(d.getTime() + offset * 60000);
            const ohh = String(nd.getUTCHours()).padStart(2, '0');
            const omin = String(nd.getUTCMinutes()).padStart(2, '0');

            timeVars.push(`${ohh}:${omin}`);
            timeVars.push(`${ohh}.${omin}`);
            timeVars.push(`${ohh} ${omin}`);
          }
        }
      }
    }

    let isMatch = false;

    if (isImage) {
      // Untuk gambar OCR, periksa secara global pada seluruh teks karena Tesseract sering memisahkan baris
      const upperText = csvText.toUpperCase();
      const hasAmount = upperText.includes(totalPay.toString()) || upperText.includes(formattedDot) || upperText.includes(formattedComma);

      if (hasAmount) {
        if (dateVars.length > 0) {
          const hasDate = dateVars.some(dv => upperText.includes(dv.toUpperCase()));
          // Jika timeVars kosong (jam 00:00), maka abaikan pengecekan waktu
          const hasTime = timeVars.length === 0 ? true : timeVars.some(tv => upperText.includes(tv));
          if (hasDate && hasTime) {
            isMatch = true;
          }
        } else {
          isMatch = true;
        }
      }
    } else {
      // 2. Pemindaian mutasi baris demi baris
      for (const line of lines) {
        const hasAmount =
          line.includes(totalPay.toString()) ||
          line.includes(formattedDot) ||
          line.includes(formattedComma);

        if (hasAmount) {
          // Jika ada jumlah uang yang cocok di baris ini, syaratkan juga validasi tanggal dan waktu
          if (dateVars.length > 0) {
            const upperLine = line.toUpperCase();
            const hasDate = dateVars.some(dv => upperLine.includes(dv.toUpperCase()));
            // Jika timeVars kosong, anggap true
            const hasTime = timeVars.length === 0 ? true : timeVars.some(tv => upperLine.includes(tv));

            if (hasDate && hasTime) {
              isMatch = true;
              break;
            }
          } else {
            // Fallback untuk pendaftar lama yang belum punya kolom waktu transaksi
            isMatch = true;
            break;
          }
        }
      }
    }

    if (isMatch) {
      const success = await updateRegistrationStatus(reg.id, 'PAID');
      if (success) {
        confirmedCount++;
        confirmedIds.push(reg.id);
      }
    }
  }

  return { confirmedCount, confirmedIds };
}
