import { m as updateRegistrationStatus } from "./db_CBEJZ1lV.mjs";
import { createWorker } from "tesseract.js";
//#region src/lib/ocr.ts
/**
* Memvalidasi struk bukti pembayaran menggunakan OCR (Optical Character Recognition)
* 
* @param base64Image String gambar bukti transfer dalam format Base64
* @param amount Nominal unik yang harus dibayarkan (misal: 150003)
*/
async function validateReceiptOCR(base64Image, amount) {
	try {
		const worker = await createWorker("eng");
		const { data: { text } } = await worker.recognize(base64Image);
		await worker.terminate();
		const upperText = text.toUpperCase();
		const hasRecipient = upperText.includes("EVENT ORGANIZER JAGAD PRE") || upperText.includes("QRIS RUN") || upperText.includes("GO-JEK") || upperText.includes("GOPAY");
		const cleanTextDigits = upperText.replace(/[^0-9]/g, "");
		const cleanAmount = Math.round(amount).toString();
		const formattedDot = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(amount).replace(/[^0-9.]/g, "");
		const formattedComma = formattedDot.replace(/\./g, ",");
		const hasAmount = cleanTextDigits.includes(cleanAmount) || upperText.includes(cleanAmount) || upperText.includes(formattedDot) || upperText.includes(formattedComma);
		const hasTransactionRef = upperText.includes("BERHASIL") || upperText.includes("SUKSES") || upperText.includes("SUCCESS") || upperText.includes("REF") || upperText.includes("REFERENSI") || upperText.includes("TRANSAKSI") || upperText.includes("TRX");
		if (!hasRecipient) return {
			success: false,
			message: "Validasi OCR Gagal: Nama penerima (\"Event Organizer Jagad Pre\" / \"Syiar QRIS Run\") tidak terdeteksi pada struk bukti pembayaran Anda! <strong>Pastikan bukti yang dikirim benar!</strong>",
			recognizedText: text
		};
		if (!hasAmount) return {
			success: false,
			message: `Validasi OCR Gagal: Nominal transfer senilai ${formattedDot} tidak terdeteksi pada struk bukti pembayaran Anda! Mohon pastikan nominal yang ditransfer sesuai.`,
			recognizedText: text
		};
		if (!hasTransactionRef) return {
			success: false,
			message: "Validasi OCR Gagal: Teks nomor transaksi / referensi / status keberhasilan tidak terdeteksi pada struk Anda!",
			recognizedText: text
		};
		let extractedTime = (/* @__PURE__ */ new Date()).toISOString();
		const dateRegex = /(\d{1,2})[\s\/\-]*(JAN|FEB|MAR|APR|MEI|MAY|JUN|JUL|AGU|AUG|SEP|OKT|OCT|NOV|DES|DEC|[0-1]?\d)[\s\/\-]*(\d{2,4})/i;
		const timeRegex = /(\d{2}):(\d{2})(?::\d{2})?/i;
		const dateMatch = upperText.match(dateRegex);
		const timeMatch = upperText.match(timeRegex);
		if (dateMatch) try {
			const day = dateMatch[1];
			let monthStr = dateMatch[2];
			const yearStr = dateMatch[3];
			const year = yearStr.length === 2 ? `20${yearStr}` : yearStr;
			const month = {
				"JAN": "01",
				"FEB": "02",
				"MAR": "03",
				"APR": "04",
				"MEI": "05",
				"MAY": "05",
				"JUN": "06",
				"JUL": "07",
				"AGU": "08",
				"AUG": "08",
				"SEP": "09",
				"OKT": "10",
				"OCT": "10",
				"NOV": "11",
				"DES": "12",
				"DEC": "12"
			}[monthStr] || monthStr.padStart(2, "0");
			let timeStr = "00:00:00";
			if (timeMatch) timeStr = `${timeMatch[1]}:${timeMatch[2]}:00`;
			const isoString = `${year}-${month}-${day.padStart(2, "0")}T${timeStr}Z`;
			const parsedDate = new Date(isoString);
			if (!isNaN(parsedDate.getTime())) extractedTime = parsedDate.toISOString();
		} catch (e) {}
		return {
			success: true,
			message: "Validasi OCR Sukses! Struk bukti transfer valid.",
			recognizedText: text,
			extractedTime
		};
	} catch (err) {
		console.error("Error saat menjalankan verifikasi OCR struk pembayaran:", err);
		return {
			success: true,
			message: "Verifikasi OCR dilewati karena kendala teknis pembacaan berkas gambar.",
			recognizedText: "",
			extractedTime: (/* @__PURE__ */ new Date()).toISOString()
		};
	}
}
/**
* Memproses CSV Mutasi Bank untuk konfirmasi pembayaran otomatis.
* Mencocokkan nominal unik di mutasi dengan nominal tagihan peserta.
*/
async function processBankMutationsCSV(csvText, pendingRegs, isImage = false) {
	let confirmedCount = 0;
	const confirmedIds = [];
	const lines = csvText.split(/\r?\n/);
	const getMonthName = (monthIdx, short = false) => {
		return short ? [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"Mei",
			"Jun",
			"Jul",
			"Agu",
			"Sep",
			"Okt",
			"Nov",
			"Des"
		][monthIdx] : [
			"Januari",
			"Februari",
			"Maret",
			"April",
			"Mei",
			"Juni",
			"Juli",
			"Agustus",
			"September",
			"Oktober",
			"November",
			"Desember"
		][monthIdx];
	};
	for (const reg of pendingRegs) {
		const totalPay = reg.amount + reg.id % 1e3;
		const formattedDot = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(totalPay).replace(/[^0-9.]/g, "");
		const formattedComma = formattedDot.replace(/\./g, ",");
		const dateVars = [];
		const timeVars = [];
		if (reg.transactionTime) {
			const d = new Date(reg.transactionTime);
			if (!isNaN(d.getTime())) {
				const dd = String(d.getUTCDate()).padStart(2, "0");
				const d_noPad = String(d.getUTCDate());
				const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
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
				const hh = String(d.getUTCHours()).padStart(2, "0");
				const min = String(d.getUTCMinutes()).padStart(2, "0");
				if (hh !== "00" || min !== "00") for (let offset = -30; offset <= 30; offset++) {
					const nd = new Date(d.getTime() + offset * 6e4);
					const ohh = String(nd.getUTCHours()).padStart(2, "0");
					const omin = String(nd.getUTCMinutes()).padStart(2, "0");
					timeVars.push(`${ohh}:${omin}`);
					timeVars.push(`${ohh}.${omin}`);
					timeVars.push(`${ohh} ${omin}`);
				}
			}
		}
		let isMatch = false;
		if (isImage) {
			const upperText = csvText.toUpperCase();
			if (upperText.includes(totalPay.toString()) || upperText.includes(formattedDot) || upperText.includes(formattedComma)) if (dateVars.length > 0) {
				const hasDate = dateVars.some((dv) => upperText.includes(dv.toUpperCase()));
				const hasTime = timeVars.length === 0 ? true : timeVars.some((tv) => upperText.includes(tv));
				if (hasDate && hasTime) isMatch = true;
			} else isMatch = true;
		} else for (const line of lines) if (line.includes(totalPay.toString()) || line.includes(formattedDot) || line.includes(formattedComma)) if (dateVars.length > 0) {
			const upperLine = line.toUpperCase();
			const hasDate = dateVars.some((dv) => upperLine.includes(dv.toUpperCase()));
			const hasTime = timeVars.length === 0 ? true : timeVars.some((tv) => upperLine.includes(tv));
			if (hasDate && hasTime) {
				isMatch = true;
				break;
			}
		} else {
			isMatch = true;
			break;
		}
		if (isMatch) {
			if (await updateRegistrationStatus(reg.id, "PAID")) {
				confirmedCount++;
				confirmedIds.push(reg.id);
			}
		}
	}
	return {
		confirmedCount,
		confirmedIds
	};
}
//#endregion
export { validateReceiptOCR as n, processBankMutationsCSV as t };
