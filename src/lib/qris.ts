/**
 * Helper untuk menghitung CRC-16-CCITT (Polynomial: 0x1021, Initial: 0xFFFF)
 * yang digunakan untuk memvalidasi standar QRIS EMVCo.
 */
function calculateCRC16(data: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    const code = data.charCodeAt(i);
    crc ^= (code << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  const hex = crc.toString(16).toUpperCase();
  return hex.padStart(4, '0');
}

/**
 * Generator QRIS Dinamis (Bisnis QRIS - Interoperable)
 *
 * Mengambil payload QRIS Statis, lalu:
 * 1. Mengubah tag 01 (Point of Initiation) dari "11" (statis) ke "12" (dinamis)
 * 2. Menyisipkan tag 54 (Transaction Amount) dengan nominal bayar unik
 * 3. Menghitung ulang CRC-16-CCITT checksum
 *
 * @param staticPayload String payload QRIS Statis dari ShopeePay Bisnis / QRIS Bisnis apapun
 * @param amount Nominal pembayaran dalam Rupiah (misal: 75003)
 */
export function generateDynamicQRIS(staticPayload: string, amount: number): string {
  let payload = staticPayload.trim();

  // 1. Hapus CRC lama di akhir string (tag 6304XXXX)
  if (payload.includes('6304')) {
    payload = payload.substring(0, payload.indexOf('6304'));
  }

  // 2. Ubah Point of Initiation Method dari "11" (statis) ke "12" (dinamis)
  //    Tag 01 selalu di posisi 6: "010211" → "010212"
  if (payload.startsWith('000201')) {
    if (payload.includes('010211')) {
      payload = payload.replace('010211', '010212');
    }
    // Jika sudah "010212" (sudah dinamis), biarkan saja
  }

  // 3. Format nominal bayar ke standar tag 54 (Transaction Amount)
  //    Contoh: Rp 75003 → tag "54057 5003" → "540575003"
  const amountStr = Math.round(amount).toString();
  const amountLen = amountStr.length.toString().padStart(2, '0');
  const amountTag = `54${amountLen}${amountStr}`;

  // 4. Sisipkan Tag 54 (Amount). Tag 54 biasanya berada tepat setelah Tag 53 (Currency - 5303360).
  const tag53 = '5303360';
  const tag53Index = payload.indexOf(tag53);

  if (tag53Index !== -1) {
    const after53 = tag53Index + tag53.length;
    // Cek apakah Tag 54 sudah ada tepat setelah Tag 53
    if (payload.substring(after53, after53 + 2) === '54') {
      const lenStr = payload.substring(after53 + 2, after53 + 4);
      const len = parseInt(lenStr, 10);
      const oldTag54Length = 4 + len; // 2 digit tag + 2 digit length + value length
      // Replace existing Tag 54
      payload = payload.substring(0, after53) + amountTag + payload.substring(after53 + oldTag54Length);
    } else {
      // Insert new Tag 54 right after Tag 53
      payload = payload.substring(0, after53) + amountTag + payload.substring(after53);
    }
  } else {
    // Fallback: sisipkan sebelum tag 58 (Country Code, selalu ada: "5802ID")
    const tag58Index = payload.indexOf('5802');
    if (tag58Index !== -1) {
      payload = payload.substring(0, tag58Index) + amountTag + payload.substring(tag58Index);
    } else {
      // Fallback: append sebelum tag 59 (Merchant Name)
      const tag59Index = payload.indexOf('59');
      if (tag59Index !== -1) {
        payload = payload.substring(0, tag59Index) + amountTag + payload.substring(tag59Index);
      } else {
        payload += amountTag;
      }
    }
  }

  // 5. Tambahkan tag CRC penutup (Tag 63, Panjang 04)
  payload += '6304';

  // 6. Hitung checksum CRC-16 baru
  const newCrc = calculateCRC16(payload);

  return payload + newCrc;
}
