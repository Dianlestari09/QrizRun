import { n as __exportAll, t as createComponent } from "./compiler_ZoD8EgYh.mjs";
import { T as createAstro, _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_B7Q_e2SV.mjs";
import { t as renderScript } from "./script_Cu9Q5UeQ.mjs";
import { t as $$AdminLayout } from "./AdminLayout_Beuq7qRw.mjs";
import { m as updateRegistrationStatus, s as getAllRegistrations, u as getRegistrationWithEventById } from "./db_CBEJZ1lV.mjs";
import { t as processBankMutationsCSV } from "./ocr_BZW1cvR1.mjs";
import { createRequire } from "node:module";
import nodemailer from "nodemailer";
import { Buffer } from "node:buffer";
import { createWorker } from "tesseract.js";
//#region src/lib/email.ts
function createTransporter() {
	const emailUser = process.env.EMAIL_USER || "dianpixxelpro@gmail.com";
	const emailPass = process.env.EMAIL_APP_PASSWORD || "ejam zycx zhwi afwk";
	if (!emailUser || !emailPass) {
		console.warn("[EMAIL] EMAIL_USER atau EMAIL_APP_PASSWORD belum dikonfigurasi di .env. Email tidak akan dikirim.");
		return null;
	}
	return nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: emailUser,
			pass: emailPass
		}
	});
}
var FROM_NAME = "Syiar QRIS Run";
var BASE_URL = process.env.PUBLIC_BASE_URL || "http://localhost:4321";
function wrapEmailTemplate(title, bodyHtml) {
	return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    body { margin:0; padding:0; background-color:#0a0f1e; font-family:'Segoe UI',Arial,sans-serif; color:#e2e8f0; }
    .wrapper { max-width:600px; margin:0 auto; padding:32px 16px; }
    .card { background:linear-gradient(135deg,#111827,#1a2234); border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden; }
    .header { background:linear-gradient(135deg,#1d4ed8,#0f766e); padding:32px 40px; text-align:center; }
    .header-logo { font-size:28px; font-weight:900; color:#fff; letter-spacing:-1px; }
    .header-logo span { color:#22d3ee; }
    .header-tagline { font-size:13px; color:rgba(255,255,255,0.7); margin-top:6px; }
    .body { padding:40px; }
    .title { font-size:22px; font-weight:800; color:#f1f5f9; margin:0 0 8px; }
    .subtitle { font-size:14px; color:#94a3b8; margin:0 0 28px; }
    .info-box { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:20px 24px; margin-bottom:24px; }
    .info-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:14px; }
    .info-row:last-child { border-bottom:none; }
    .info-label { color:#94a3b8; }
    .info-value { font-weight:700; color:#e2e8f0; text-align:right; }
    .btn { display:block; width:fit-content; margin:28px auto 0; background:linear-gradient(135deg,#2563eb,#0d9488); color:#fff; text-decoration:none; padding:14px 36px; border-radius:50px; font-size:15px; font-weight:700; text-align:center; }
    .status-badge { display:inline-block; padding:6px 16px; border-radius:50px; font-size:12px; font-weight:700; letter-spacing:0.05em; }
    .status-pending { background:rgba(245,158,11,0.15); color:#fbbf24; border:1px solid rgba(245,158,11,0.3); }
    .status-paid { background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3); }
    .footer { padding:24px 40px; text-align:center; border-top:1px solid rgba(255,255,255,0.06); }
    .footer p { font-size:12px; color:#475569; margin:4px 0; }
    .highlight { color:#22d3ee; font-weight:700; }
    @media only screen and (max-width: 480px) {
      .mobile-block { display: block !important; width: 100% !important; padding: 0 !important; margin-bottom: 15px !important; }
      .mobile-center { text-align: center !important; }
      .qr-td { display: block !important; width: 100% !important; text-align: center !important; padding-right: 0 !important; margin-bottom: 15px !important; }
      .qr-text-td { display: block !important; width: 100% !important; text-align: center !important; }
      .qr-img-wrapper { display: inline-block !important; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="header-logo">⚡ Syiar <span>QRIS Run</span></div>
        <div class="header-tagline">Event Lari Edukasi & Digitalisasi Bank Indonesia</div>
      </div>
      <div class="body">
        ${bodyHtml}
      </div>
      <div class="footer">
        <p>Email ini dikirim otomatis oleh sistem Syiar QRIS Run.</p>
        <p>Jangan balas email ini. Hubungi panitia jika ada pertanyaan.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
async function sendTicketConfirmedEmail(params) {
	const transporter = createTransporter();
	if (!transporter) return false;
	`${BASE_URL}${params.regId}`;
	const ticketCode = `TICKET:QRISRUN-REG-${params.regId}:EMAIL-${params.to}`;
	const qrCodeUrl = `https://quickchart.io/qr?size=200&text=${encodeURIComponent(ticketCode)}&ecLevel=M`;
	let formattedName = params.name;
	let participantListHtml = "";
	try {
		const arr = JSON.parse(params.name);
		if (Array.isArray(arr) && arr.length > 0) {
			formattedName = arr[0].name;
			participantListHtml = `
        <tr>
          <td colspan="2" class="mobile-block" style="padding-bottom: 15px; border-top: 1px dashed #334155; padding-top: 15px; margin-top: 5px;">
            <span style="display: block; font-size: 10px; color: #64748b; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">Daftar Peserta & Jersey</span>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              ${arr.map((p) => `
                <tr>
                  <td style="padding: 4px 0; color: #f8fafc;">${p.name}</td>
                  <td style="padding: 4px 0; color: #22d3ee; text-align: right; font-weight: bold;">Size: ${p.ukuranJersey}</td>
                </tr>
              `).join("")}
            </table>
          </td>
        </tr>
      `;
		}
	} catch (e) {}
	const bodyHtml = `
    <div style="background-color: #0f172a; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      
      <!-- Ticket Header -->
      <div style="background-color: #1e293b; padding: 15px 25px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
        <span style="color: #94a3b8; font-weight: 700; font-size: 14px; letter-spacing: 1px;">🎫 OFFICIAL E-TICKET</span>
        <span style="background-color: rgba(16, 185, 129, 0.1); color: #34d399; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 1px;">CONFIRMED</span>
      </div>

      <!-- Event Title Banner -->
      <div style="background: linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.95)); padding: 40px 25px; text-align: center; border-bottom: 1px dashed #334155;">
        <h1 style="color: #f8fafc; font-size: 24px; font-weight: 800; margin: 0;">${params.eventTitle}</h1>
      </div>

      <!-- Ticket Details -->
      <div style="padding: 25px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td class="mobile-block" style="padding-bottom: 15px; width: 50%;">
              <span style="display: block; font-size: 10px; color: #64748b; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;">Nama Lengkap</span>
              <strong style="color: #f8fafc; font-size: 15px; text-transform: capitalize;">${formattedName}</strong>
            </td>
            <td class="mobile-block" style="padding-bottom: 15px; width: 50%;">
              <span style="display: block; font-size: 10px; color: #64748b; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;">Status Pembayaran</span>
              <strong style="color: #10b981; font-size: 15px;">LUNAS</strong>
            </td>
          </tr>
          ${participantListHtml}
          <tr>
            <td class="mobile-block" style="padding-bottom: 15px;">
              <span style="display: block; font-size: 10px; color: #64748b; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;">Hari & Tanggal</span>
              <strong style="color: #f8fafc; font-size: 14px;">${params.eventDate}</strong>
            </td>
            <td class="mobile-block" style="padding-bottom: 15px;">
              <span style="display: block; font-size: 10px; color: #64748b; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;">Lokasi Acara</span>
              <strong style="color: #f8fafc; font-size: 14px;">${params.eventLocation}</strong>
            </td>
          </tr>
          <tr>
            <td colspan="2" class="mobile-block">
              <span style="display: block; font-size: 10px; color: #64748b; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;">ID Registrasi</span>
              <strong style="color: #94a3b8; font-size: 15px;">#REG-${params.regId}</strong>
            </td>
          </tr>
        </table>

        <!-- QR Code Section -->
        <div style="margin-top: 30px; background-color: #1e293b; border-radius: 12px; padding: 20px; text-align: left;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td class="qr-td" style="width: 140px; vertical-align: middle; padding-right: 20px;">
                <div class="qr-img-wrapper" style="background: white; padding: 10px; border-radius: 8px; display: inline-block;">
                  <img src="${qrCodeUrl}" alt="QR Check-in" style="width: 120px; height: 120px; display: block;" />
                </div>
              </td>
              <td class="qr-text-td" style="vertical-align: middle;">
                <h3 style="color: #f8fafc; margin: 0 0 8px 0; font-size: 16px;">Tunjukkan QR Code ini</h3>
                <p style="color: #94a3b8; margin: 0; font-size: 13px; line-height: 1.5;">Scan tiket ini kepada panitia di lokasi acara untuk proses check-in pendaftaran.</p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `;
	try {
		await transporter.sendMail({
			from: `"${FROM_NAME}" <${process.env.EMAIL_USER || "dianpixxelpro@gmail.com"}>`,
			to: params.to,
			subject: `[Syiar QRIS Run] ✅ Pembayaran Dikonfirmasi — E-Tiket ${params.eventTitle} Siap!`,
			html: wrapEmailTemplate("E-Tiket Siap", bodyHtml)
		});
		console.log(`[EMAIL] Sent ticket confirmation email to ${params.to}`);
		return true;
	} catch (err) {
		console.error("[EMAIL] Failed to send ticket confirmation email:", err);
		return false;
	}
}
//#endregion
//#region src/pages/admin/registrations.astro
var registrations_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Registrations,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Registrations = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Registrations;
	const require = createRequire(import.meta.url);
	const pdfParse = require("pdf-parse");
	let errorMsg = "";
	let successMsg = "";
	if (Astro.request.method === "POST") try {
		const formData = await Astro.request.formData();
		const action = formData.get("action");
		const idStr = formData.get("id");
		if (action === "delete_reg" && idStr) {
			const id = parseInt(idStr.toString(), 10);
			const { deleteRegistration } = await import("./db_CBEJZ1lV.mjs").then((n) => n.i);
			if (await deleteRegistration(id)) successMsg = "Pendaftaran berhasil dihapus. Slot tiket kembali tersedia!";
			else errorMsg = "Gagal menghapus pendaftaran.";
		} else if (action === "confirm" && idStr) {
			const id = parseInt(idStr.toString(), 10);
			const regDetail = await getRegistrationWithEventById(id);
			if (await updateRegistrationStatus(id, "PAID")) {
				successMsg = "Pembayaran berhasil dikonfirmasi secara manual!";
				if (regDetail) await sendTicketConfirmedEmail({
					to: regDetail.email,
					name: regDetail.name,
					eventTitle: regDetail.eventTitle,
					eventDate: regDetail.eventDate,
					eventLocation: regDetail.eventLocation,
					amount: regDetail.amount,
					regId: regDetail.id
				});
			} else errorMsg = "Gagal mengonfirmasi pembayaran.";
		} else if (action === "import_csv") {
			const file = formData.get("csv_file");
			if (file && file.size > 0) {
				let text = "";
				let isImage = false;
				const fileName = file.name.toLowerCase();
				if (fileName.endsWith(".pdf")) try {
					text = (await pdfParse(Buffer.from(await file.arrayBuffer()))).text;
				} catch (pdfErr) {
					errorMsg = "Gagal membaca PDF: " + (pdfErr.message || String(pdfErr));
					throw new Error("SILENT");
				}
				else if (fileName.match(/\.(png|jpe?g)$/i)) {
					isImage = true;
					try {
						const buffer = Buffer.from(await file.arrayBuffer());
						const worker = await createWorker("eng");
						const { data } = await worker.recognize(buffer);
						text = data.text;
						console.log("\n=== HASIL OCR FOTO MUTASI ===");
						console.log(text);
						console.log("=============================\n");
						await worker.terminate();
					} catch (imgErr) {
						errorMsg = "Gagal membaca Foto Mutasi: " + (imgErr.message || String(imgErr));
						throw new Error("SILENT");
					}
				} else if (fileName.match(/\.(xlsx|xls)$/i)) try {
					const buffer = Buffer.from(await file.arrayBuffer());
					const xlsx = require("xlsx");
					const workbook = xlsx.read(buffer, { type: "buffer" });
					for (const sheetName of workbook.SheetNames) {
						const sheet = workbook.Sheets[sheetName];
						const csvString = xlsx.utils.sheet_to_csv(sheet);
						text += csvString + "\n";
					}
				} catch (xlsErr) {
					errorMsg = "Gagal membaca File Excel: " + (xlsErr.message || String(xlsErr));
					throw new Error("SILENT");
				}
				else text = await file.text();
				const pendingOnly = (await getAllRegistrations()).filter((r) => r.status === "PENDING");
				const results = await processBankMutationsCSV(text, pendingOnly, isImage);
				if (results.confirmedCount > 0) {
					successMsg = `Sistem berhasil memverifikasi ${results.confirmedCount} pembayaran secara otomatis dari mutasi!`;
					for (const confId of results.confirmedIds) {
						const regDetail = await getRegistrationWithEventById(confId);
						if (regDetail) await sendTicketConfirmedEmail({
							to: regDetail.email,
							name: regDetail.name,
							eventTitle: regDetail.eventTitle,
							eventDate: regDetail.eventDate,
							eventLocation: regDetail.eventLocation,
							amount: regDetail.amount,
							regId: regDetail.id
						});
					}
				} else errorMsg = "Sistem memproses CSV mutasi, namun tidak ada kecocokan nominal unik dengan tiket PENDING yang ditemukan.";
			} else errorMsg = "Mohon unggah file mutasi CSV yang valid.";
		}
	} catch (err) {
		if (err.message !== "SILENT") {
			errorMsg = "Terjadi kesalahan saat memproses permintaan: " + (err.message || String(err));
			console.error(err);
		}
	}
	const registrationsDisplay = await getAllRegistrations();
	const formatPrice = (price) => {
		if (price === 0) return "Gratis";
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0
		}).format(price);
	};
	const formatDate = (dateStr) => {
		return new Date(dateStr).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});
	};
	const parseName = (nameStr) => {
		try {
			const arr = JSON.parse(nameStr);
			if (Array.isArray(arr) && arr.length > 0) {
				if (arr.length === 1) return arr[0].name;
				return `${arr.map((p) => p.name).join(", ")} (Kolektif: ${arr.length} orang)`;
			}
		} catch (e) {}
		return nameStr;
	};
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"title": "Data Pendaftar",
		"data-astro-cid-xa4toezm": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="admin-dashboard" data-astro-cid-xa4toezm><div class="glow-spot admin-glow" data-astro-cid-xa4toezm></div><div class="container relative z-1" style="max-width: 98%; padding: 0 1rem;" data-astro-cid-xa4toezm><div class="admin-header" data-astro-cid-xa4toezm><div data-astro-cid-xa4toezm><h1 class="admin-title" data-astro-cid-xa4toezm>Pendaftar Masuk</h1><p class="admin-subtitle" data-astro-cid-xa4toezm>Kelola pembayaran, konfirmasi registrasi, dan cek tiket masuk.</p></div></div>${successMsg && renderTemplate`<div class="alert alert-success" data-astro-cid-xa4toezm>${successMsg}</div>`}${errorMsg && renderTemplate`<div class="alert alert-danger" data-astro-cid-xa4toezm>${errorMsg}</div>`}<div class="table-container glass" data-astro-cid-xa4toezm><div class="table-header-flex" data-astro-cid-xa4toezm><h2 class="table-title" data-astro-cid-xa4toezm>Daftar Pendaftar Masuk</h2><div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;" data-astro-cid-xa4toezm><div class="filter-group" style="display: flex; gap: 0.5rem; align-items: center;" data-astro-cid-xa4toezm><label style="font-size: 0.85rem; color: var(--text-muted);" data-astro-cid-xa4toezm>Rentang Tanggal:</label><input type="date" id="filter-date-start" class="form-control" style="padding: 0.3rem 0.5rem; border-radius: 4px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: white;" data-astro-cid-xa4toezm><span style="color: var(--text-muted); font-size: 0.85rem;" data-astro-cid-xa4toezm>-</span><input type="date" id="filter-date-end" class="form-control" style="padding: 0.3rem 0.5rem; border-radius: 4px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: white;" data-astro-cid-xa4toezm><button type="button" id="btn-reset-filter" class="btn btn-outline btn-sm" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" data-astro-cid-xa4toezm>Reset</button></div><button type="button" id="btn-export-csv" class="btn btn-primary btn-small" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.5rem 1rem;" data-astro-cid-xa4toezm>⬇️ Export Data</button></div></div>${registrationsDisplay.length > 0 ? renderTemplate`<div class="table-scroll" data-astro-cid-xa4toezm><table class="event-table" data-astro-cid-xa4toezm><thead data-astro-cid-xa4toezm><tr data-astro-cid-xa4toezm><th data-astro-cid-xa4toezm>Reg ID</th><th data-astro-cid-xa4toezm>Nama Pendaftar</th><th data-astro-cid-xa4toezm>Kontak</th><th data-astro-cid-xa4toezm>Event Terdaftar</th><th data-astro-cid-xa4toezm>Total Bayar</th><th data-astro-cid-xa4toezm>Bukti Transfer</th><th data-astro-cid-xa4toezm>Status</th><th data-astro-cid-xa4toezm>Check-In</th><th data-astro-cid-xa4toezm>Tanggal Daftar</th><th class="actions-col" data-astro-cid-xa4toezm>Aksi</th></tr></thead><tbody data-astro-cid-xa4toezm>${registrationsDisplay.map((reg) => renderTemplate`<tr${addAttribute(reg.id, "data-id")}${addAttribute(reg.name, "data-raw-name")}${addAttribute(reg.email, "data-email")}${addAttribute(reg.phone, "data-phone")}${addAttribute(reg.amount, "data-amount")}${addAttribute(reg.status, "data-status")}${addAttribute(reg.checkedIn ? "SUDAH" : "BELUM", "data-checkin")}${addAttribute(formatDate(reg.createdAt), "data-date")}${addAttribute(reg.paymentProof ? "Ada" : "Tidak", "data-has-proof")} data-astro-cid-xa4toezm><td class="reg-id-cell" data-astro-cid-xa4toezm><strong data-astro-cid-xa4toezm>#REG-${reg.id}</strong></td><td data-astro-cid-xa4toezm><div class="event-name-cell" data-astro-cid-xa4toezm><strong data-astro-cid-xa4toezm>${parseName(reg.name)}</strong><span class="event-id" data-astro-cid-xa4toezm>${reg.email}</span></div></td><td data-astro-cid-xa4toezm>${reg.phone}</td><td data-astro-cid-xa4toezm><div class="event-name-cell" data-astro-cid-xa4toezm><strong data-astro-cid-xa4toezm>${reg.eventTitle}</strong><span class="event-id" data-astro-cid-xa4toezm>Event ID: #${reg.eventId}</span></div></td><td data-astro-cid-xa4toezm>${formatPrice(reg.amount)}</td><td data-astro-cid-xa4toezm>${reg.paymentProof ? renderTemplate`<button type="button" class="btn-table btn-edit view-proof-btn"${addAttribute(reg.paymentProof, "data-proof")} style="background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.5);" data-astro-cid-xa4toezm>Lihat Bukti</button>` : renderTemplate`<span style="color: var(--text-muted); font-size: 0.85rem;" data-astro-cid-xa4toezm>Belum Upload</span>`}</td><td data-astro-cid-xa4toezm><span${addAttribute(`status-badge ${reg.status.toLowerCase()}`, "class")} data-astro-cid-xa4toezm>${reg.status}</span></td><td data-astro-cid-xa4toezm><span${addAttribute(`status-badge ${reg.checkedIn ? "paid" : "pending"}`, "class")} data-astro-cid-xa4toezm>${reg.checkedIn ? "SUDAH" : "BELUM"}</span></td><td class="date-cell" data-astro-cid-xa4toezm>${formatDate(reg.createdAt)}</td><td data-astro-cid-xa4toezm><div class="action-buttons" data-astro-cid-xa4toezm>${reg.status === "PENDING" ? renderTemplate`<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" data-astro-cid-xa4toezm><form method="POST" style="margin: 0;" data-astro-cid-xa4toezm><input type="hidden" name="action" value="confirm" data-astro-cid-xa4toezm><input type="hidden" name="id"${addAttribute(reg.id, "value")} data-astro-cid-xa4toezm><button type="submit" class="btn-table btn-confirm" data-astro-cid-xa4toezm>Konfirmasi Bayar</button></form></div>` : renderTemplate`<a${addAttribute(`/ticket/${reg.id}`, "href")} class="btn-table btn-edit" target="_blank" data-astro-cid-xa4toezm>Lihat Tiket</a>`}</div></td></tr>`)}</tbody></table></div>` : renderTemplate`<div class="empty-table" data-astro-cid-xa4toezm><p data-astro-cid-xa4toezm>Belum ada data pendaftar masuk.</p></div>`}</div><!-- Modal Pratinjau Bukti Pembayaran --><div id="receipt-modal" class="modal-overlay glass" data-astro-cid-xa4toezm><div class="modal-content glass" data-astro-cid-xa4toezm><span class="close-btn" id="close-modal" data-astro-cid-xa4toezm>&times;</span><h3 class="modal-title" data-astro-cid-xa4toezm>Bukti Transfer</h3><div class="modal-body" data-astro-cid-xa4toezm><img id="modal-img" src="" alt="Bukti Transfer" data-astro-cid-xa4toezm></div></div></div></div></section>` })}${renderScript($$result, "D:/Kuliah/Fun Run/src/pages/admin/registrations.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Kuliah/Fun Run/src/pages/admin/registrations.astro", void 0);
var $$file = "D:/Kuliah/Fun Run/src/pages/admin/registrations.astro";
var $$url = "/admin/registrations";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/registrations@_@astro
var page = () => registrations_exports;
//#endregion
export { page };
