import { n as __exportAll, t as createComponent } from "./compiler_ZoD8EgYh.mjs";
import { C as unescapeHTML, T as createAstro, _ as addAttribute, a as Fragment, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_B7Q_e2SV.mjs";
import { t as renderScript } from "./script_Cu9Q5UeQ.mjs";
import { h as uploadPaymentProof, u as getRegistrationWithEventById } from "./db_CBEJZ1lV.mjs";
import { n as validateReceiptOCR } from "./ocr_CfjYQ2zK.mjs";
import { t as $$Layout } from "./Layout_DzANYLig.mjs";
//#region src/lib/qris.ts
/**
* Helper untuk menghitung CRC-16-CCITT (Polynomial: 0x1021, Initial: 0xFFFF)
* yang digunakan untuk memvalidasi standar QRIS EMVCo.
*/
function calculateCRC16(data) {
	let crc = 65535;
	for (let i = 0; i < data.length; i++) {
		const code = data.charCodeAt(i);
		crc ^= code << 8;
		for (let j = 0; j < 8; j++) if ((crc & 32768) !== 0) crc = (crc << 1 ^ 4129) & 65535;
		else crc = crc << 1 & 65535;
	}
	return crc.toString(16).toUpperCase().padStart(4, "0");
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
function generateDynamicQRIS(staticPayload, amount) {
	let payload = staticPayload.trim();
	if (payload.includes("6304")) payload = payload.substring(0, payload.indexOf("6304"));
	if (payload.startsWith("000201")) {
		if (payload.includes("010211")) payload = payload.replace("010211", "010212");
	}
	const amountStr = Math.round(amount).toString();
	const amountTag = `54${amountStr.length.toString().padStart(2, "0")}${amountStr}`;
	const tag53Index = payload.indexOf("5303360");
	if (tag53Index !== -1) {
		const after53 = tag53Index + 7;
		if (payload.substring(after53, after53 + 2) === "54") {
			const lenStr = payload.substring(after53 + 2, after53 + 4);
			const oldTag54Length = 4 + parseInt(lenStr, 10);
			payload = payload.substring(0, after53) + amountTag + payload.substring(after53 + oldTag54Length);
		} else payload = payload.substring(0, after53) + amountTag + payload.substring(after53);
	} else {
		const tag58Index = payload.indexOf("5802");
		if (tag58Index !== -1) payload = payload.substring(0, tag58Index) + amountTag + payload.substring(tag58Index);
		else {
			const tag59Index = payload.indexOf("59");
			if (tag59Index !== -1) payload = payload.substring(0, tag59Index) + amountTag + payload.substring(tag59Index);
			else payload += amountTag;
		}
	}
	payload += "6304";
	const newCrc = calculateCRC16(payload);
	return payload + newCrc;
}
//#endregion
//#region src/pages/checkout/[regId].astro
var _regId__exports = /* @__PURE__ */ __exportAll({
	default: () => $$RegId,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$RegId = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$RegId;
	const { regId } = Astro2.params;
	const id = parseInt(regId || "", 10);
	if (isNaN(id)) return Astro2.redirect("/");
	const registration = await getRegistrationWithEventById(id);
	if (!registration) return Astro2.redirect("/");
	const isPaid = registration.status === "PAID";
	const totalPay = registration.amount;
	const limitTime = new Date(registration.createdAt).getTime() + 1800 * 1e3;
	const isExpired = registration.status === "EXPIRED" || registration.status === "PENDING" && Date.now() > limitTime;
	let successMsg = "";
	let errorMsg = "";
	let primaryName = registration.name;
	let participantCount = 1;
	try {
		const parsed = JSON.parse(registration.name);
		if (Array.isArray(parsed) && parsed.length > 0) {
			primaryName = parsed[0].name;
			participantCount = parsed.length;
		}
	} catch (e) {}
	if (Astro2.url.searchParams.get("uploaded") === "1") successMsg = "Bukti pembayaran berhasil dikirim! Pesanan Anda sedang menunggu konfirmasi dari Admin. Anda akan mendapat E-Tiket via email setelah pembayaran dikonfirmasi.";
	if (Astro2.request.method === "POST") try {
		if (isExpired) errorMsg = "Pendaftaran Anda sudah kadaluarsa (melebihi batas waktu 30 menit)! Jika terlanjur transfer, silakan konfirmasi via WhatsApp.";
		else {
			const receiptFile = (await Astro2.request.formData()).get("receipt");
			if (receiptFile && receiptFile.size > 0) if (receiptFile.size > 2 * 1024 * 1024) errorMsg = "Ukuran berkas terlalu besar! Maksimal 2MB.";
			else {
				const buffer = Buffer.from(await receiptFile.arrayBuffer());
				const base64Image = `data:${receiptFile.type};base64,${buffer.toString("base64")}`;
				const ocrResult = await validateReceiptOCR(base64Image, totalPay);
				if (!ocrResult.success) errorMsg = ocrResult.message;
				else {
					const finalTime = ocrResult.extractedTime || (/* @__PURE__ */ new Date()).toISOString();
					const uploadResult = await uploadPaymentProof(registration.id, base64Image, finalTime);
					if (uploadResult.success) return Astro2.redirect(`${Astro2.url.pathname}?uploaded=1`);
					else errorMsg = uploadResult.message;
				}
			}
			else errorMsg = "Mohon pilih file bukti transfer terlebih dahulu.";
		}
	} catch (err) {
		errorMsg = "Terjadi kesalahan saat memproses unggahan bukti.";
		console.error(err);
	}
	const formatPrice = (price) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0
		}).format(price);
	};
	const staticQrisPayload = "00020101021126580013ID.CO.BRI.WWW01189360000200425688260208425688260303UMI51440014ID.CO.QRIS.WWW0215ID10264700158540303UMI5204866153033605802ID5925EVENT ORGANIZER JAGAD PRE6007NGANJUK61056439162070703A016304A721";
	let dynamicQrisUrl = "";
	try {
		`${encodeURIComponent(staticQrisPayload)}`;
		const dynamicPayload = generateDynamicQRIS(staticQrisPayload, totalPay);
		dynamicQrisUrl = `https://quickchart.io/qr?size=280&text=${encodeURIComponent(dynamicPayload)}&ecLevel=H`;
	} catch (err) {
		console.error("Error generating QRIS payload:", err);
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Pembayaran Tiket",
		"data-astro-cid-v5gsmgzr": true
	}, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<section class="checkout-section" data-astro-cid-v5gsmgzr><div class="glow-spot checkout-glow" data-astro-cid-v5gsmgzr></div><div class="container relative z-1 max-width-md" data-astro-cid-v5gsmgzr>${registration.status === "PENDING" && registration.paymentProof && renderTemplate`${renderScript($$result2, "D:/Kuliah/Fun Run/src/pages/checkout/[regId].astro?astro&type=script&index=0&lang.ts")}`}<a${addAttribute(`/events/${registration.eventId}`, "href")} class="back-link" data-astro-cid-v5gsmgzr>&larr; Kembali</a><h1 class="checkout-title" data-astro-cid-v5gsmgzr>Pembayaran</h1>${isPaid ? renderTemplate`<div class="paid-confirmation glass" data-astro-cid-v5gsmgzr><div class="paid-icon" data-astro-cid-v5gsmgzr>🎉</div><h2 class="paid-title" data-astro-cid-v5gsmgzr>Pembayaran Terkonfirmasi!</h2><p class="paid-subtitle" data-astro-cid-v5gsmgzr>Pendaftaran Anda untuk <strong data-astro-cid-v5gsmgzr>${registration.eventTitle}</strong> telah dikonfirmasi oleh admin.</p><div class="paid-email-notice" data-astro-cid-v5gsmgzr><span class="notice-icon" data-astro-cid-v5gsmgzr>📧</span><div data-astro-cid-v5gsmgzr><strong data-astro-cid-v5gsmgzr>Cek email Anda!</strong><p data-astro-cid-v5gsmgzr>E-Tiket telah dikirim ke <strong data-astro-cid-v5gsmgzr>${registration.email}</strong>. Buka email tersebut untuk melihat dan menyimpan tiket Anda. Periksa juga folder <em data-astro-cid-v5gsmgzr>Spam/Promosi</em> jika tidak ada di inbox.</p></div></div><div class="paid-actions" data-astro-cid-v5gsmgzr><a href="/" class="btn btn-primary" style="padding: 0.75rem 2rem; font-size: 1rem; border-radius: 50px;" data-astro-cid-v5gsmgzr>Kembali ke Beranda</a></div></div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`<!-- Metode Pembayaran Dihapus (Hanya QRIS) --><!-- Detail Pembayaran & Box Kiri -->${!isPaid && !isExpired && registration.status === "PENDING" && !registration.paymentProof && renderTemplate`<div class="countdown-banner glass" data-astro-cid-v5gsmgzr><span class="icon" data-astro-cid-v5gsmgzr>⏳</span>Sisa waktu pembayaran: <strong id="countdown-timer" data-astro-cid-v5gsmgzr>Menghitung...</strong><div id="limit-time-data"${addAttribute(limitTime, "data-time")} style="display:none;" data-astro-cid-v5gsmgzr></div></div>`}<div class="checkout-details glass" data-astro-cid-v5gsmgzr><div class="qris-payment-box" id="panel-qris" data-astro-cid-v5gsmgzr><div class="qris-logo-header" data-astro-cid-v5gsmgzr><span class="logo-txt" data-astro-cid-v5gsmgzr>QRIS</span><span class="sub-txt" data-astro-cid-v5gsmgzr>GPN</span></div><div class="qr-code-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 1rem;" data-astro-cid-v5gsmgzr><img${addAttribute(dynamicQrisUrl, "src")} alt="QRIS QR Code" class="qris-img" id="qris-img" data-astro-cid-v5gsmgzr><button type="button" class="btn" style="width: 100%; background: #0f172a; color: #ffffff; border: none; font-size: 0.9rem; padding: 0.6rem; border-radius: 8px;" onclick="downloadQR()" data-astro-cid-v5gsmgzr>📥 Unduh QRIS</button></div><div class="nominal-tag" data-astro-cid-v5gsmgzr><span class="lbl" data-astro-cid-v5gsmgzr>TOTAL BAYAR (OTOMATIS TERISI)</span><strong class="val" data-astro-cid-v5gsmgzr>${formatPrice(totalPay)}</strong></div><p class="scan-instructions" data-astro-cid-v5gsmgzr>Scan QR ini menggunakan aplikasi <strong data-astro-cid-v5gsmgzr>bank manapun</strong> atau <strong data-astro-cid-v5gsmgzr>e-wallet</strong>. Nominal <strong data-astro-cid-v5gsmgzr>${formatPrice(totalPay)}</strong> otomatis terisi. Setelah bayar, unggah screenshot bukti di sebelah kanan.</p><div class="qris-warning" style="margin-top: 1rem; padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; font-size: 0.8rem; text-align: left; color: #fca5a5;" data-astro-cid-v5gsmgzr>⚠️ <strong data-astro-cid-v5gsmgzr>Penting:</strong> Jika Anda mengunduh QRIS ini, pastikan Anda mentransfer sebelum batas waktu habis. Pembayaran yang dilakukan setelah waktu habis konfirmasi ke admin via WhatsApp.</div></div><!-- Sisi Kanan: Form Upload Bukti --><div class="payment-summary" data-astro-cid-v5gsmgzr><div class="summary-row" data-astro-cid-v5gsmgzr><span class="label" data-astro-cid-v5gsmgzr>Pemesan Utama</span><span class="val font-semibold" data-astro-cid-v5gsmgzr>${primaryName}${participantCount > 1 && renderTemplate`<span class="badge badge-reguler" style="font-size:0.7rem; padding: 0.1rem 0.4rem; margin-left: 0.5rem;" data-astro-cid-v5gsmgzr>Kolektif (${participantCount} Orang)</span>`}</span></div><div class="summary-row" data-astro-cid-v5gsmgzr><span class="label" data-astro-cid-v5gsmgzr>Email</span><span class="val text-muted" data-astro-cid-v5gsmgzr>${registration.email}</span></div><div class="summary-row" data-astro-cid-v5gsmgzr><span class="label" data-astro-cid-v5gsmgzr>Tiket: ${registration.eventTitle}</span><span class="val" data-astro-cid-v5gsmgzr>${formatPrice(registration.amount)}</span></div><div class="summary-total" data-astro-cid-v5gsmgzr><span class="total-label" data-astro-cid-v5gsmgzr>Total Bayar</span><span class="total-val" data-astro-cid-v5gsmgzr>${formatPrice(totalPay)}</span></div><div class="upload-area" data-astro-cid-v5gsmgzr>${errorMsg && renderTemplate`<div class="alert alert-danger" data-astro-cid-v5gsmgzr>${unescapeHTML(errorMsg)}</div>`}${successMsg && renderTemplate`<div class="alert alert-success" data-astro-cid-v5gsmgzr>${successMsg}</div>`}${isExpired ? renderTemplate`<div class="waiting-box expired glass" data-astro-cid-v5gsmgzr><div class="waiting-icon" data-astro-cid-v5gsmgzr>❌</div><h3 data-astro-cid-v5gsmgzr>Pendaftaran Kadaluarsa</h3><p data-astro-cid-v5gsmgzr>Batas waktu pembayaran 30 menit telah habis. Pendaftaran otomatis dibatalkan. Jika terlanjur transfer, silakan konfirmasi via WhatsApp.</p><a href="/" class="btn btn-primary btn-full" data-astro-cid-v5gsmgzr>Kembali ke Beranda</a></div>` : registration.paymentProof ? renderTemplate`<div class="waiting-box glass" data-astro-cid-v5gsmgzr><div class="waiting-icon" data-astro-cid-v5gsmgzr>⌛</div><h3 data-astro-cid-v5gsmgzr>Bukti Transfer Terkirim</h3><p data-astro-cid-v5gsmgzr>Status pendaftaran Anda sedang dalam proses verifikasi manual oleh Admin. Halaman ini akan diperbarui otomatis jika pembayaran Anda terkonfirmasi.</p><div class="preview-receipt" data-astro-cid-v5gsmgzr><span class="helper" data-astro-cid-v5gsmgzr>Pratinjau Bukti:</span><img${addAttribute(registration.paymentProof, "src")} alt="Bukti Pembayaran" class="receipt-preview-img" data-astro-cid-v5gsmgzr></div></div>` : renderTemplate`<form method="POST" enctype="multipart/form-data" class="upload-form" data-astro-cid-v5gsmgzr><span class="upload-title" data-astro-cid-v5gsmgzr>Unggah Bukti Pembayaran</span><label for="receipt" class="custom-file-upload" data-astro-cid-v5gsmgzr><span class="icon" data-astro-cid-v5gsmgzr>📁</span><span class="text" id="file-name-text" data-astro-cid-v5gsmgzr>Pilih Foto Bukti Transfer</span><input type="file" id="receipt" name="receipt" accept="image/*" required data-astro-cid-v5gsmgzr></label><button type="submit" class="btn btn-accent btn-full payment-btn" id="upload-btn" data-astro-cid-v5gsmgzr>Kirim Bukti Transfer</button></form>`}</div><span class="safe-note" data-astro-cid-v5gsmgzr>🔒 Transaksi aman. Tiket Anda akan terbit setelah admin memverifikasi bukti transfer masuk.</span></div></div>` })}`}</div></section>` })}${renderScript($$result, "D:/Kuliah/Fun Run/src/pages/checkout/[regId].astro?astro&type=script&index=1&lang.ts")}`;
}, "D:/Kuliah/Fun Run/src/pages/checkout/[regId].astro", void 0);
var $$file = "D:/Kuliah/Fun Run/src/pages/checkout/[regId].astro";
var $$url = "/checkout/[regId]";
//#endregion
//#region \0virtual:astro:page:src/pages/checkout/[regId]@_@astro
var page = () => _regId__exports;
//#endregion
export { page };
