import { n as __exportAll, t as createComponent } from "./compiler_ZoD8EgYh.mjs";
import { T as createAstro, _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_B7Q_e2SV.mjs";
import { t as renderScript } from "./script_Cu9Q5UeQ.mjs";
import { t as $$AdminLayout } from "./AdminLayout_Beuq7qRw.mjs";
import { t as checkInRegistration } from "./db_CBEJZ1lV.mjs";
//#region src/pages/admin/checkin.astro
var checkin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Checkin,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Checkin = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Checkin;
	let resultMsg = "";
	let statusType = "";
	let checkedInUser = {
		name: "",
		eventTitle: "",
		id: 0
	};
	if (Astro.request.method === "POST") try {
		const rawTicketId = (await Astro.request.formData()).get("ticketId")?.toString() || "";
		let regId = parseInt(rawTicketId, 10);
		if (rawTicketId.startsWith("TICKET:QRISRUN-REG-")) {
			const regIdPart = rawTicketId.split(":")[1].replace("QRISRUN-REG-", "");
			regId = parseInt(regIdPart, 10);
		}
		if (isNaN(regId)) {
			resultMsg = "Format Kode Tiket / ID Registrasi tidak valid!";
			statusType = "error";
		} else {
			const checkinResult = await checkInRegistration(regId);
			resultMsg = checkinResult.message;
			if (checkinResult.success) {
				statusType = "success";
				checkedInUser = {
					name: checkinResult.name || "",
					eventTitle: checkinResult.eventTitle || "",
					id: regId
				};
			} else {
				statusType = checkinResult.message.includes("belum lunas") ? "warning" : "error";
				checkedInUser = {
					name: checkinResult.name || "",
					eventTitle: checkinResult.eventTitle || "",
					id: regId
				};
			}
		}
	} catch (err) {
		resultMsg = "Terjadi kesalahan sistem saat memproses check-in.";
		statusType = "error";
		console.error(err);
	}
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"title": "Scanner Check-In Tiket",
		"data-astro-cid-nb6poqdm": true
	}, { "default": ($$result) => renderTemplate`<script src="https://unpkg.com/html5-qrcode" defer><\/script>${maybeRenderHead($$result)}<section class="checkin-section" data-astro-cid-nb6poqdm><div class="glow-spot checkin-glow" data-astro-cid-nb6poqdm></div><div class="container relative z-1 max-width-md" data-astro-cid-nb6poqdm><div class="checkin-header" data-astro-cid-nb6poqdm><a href="/admin" class="back-link" data-astro-cid-nb6poqdm>&larr; Kembali ke Dashboard</a><h1 class="checkin-title" data-astro-cid-nb6poqdm>Check-In Tiket</h1><p class="checkin-subtitle" data-astro-cid-nb6poqdm>Scan QR Code E-Tiket peserta atau masukkan ID registrasi untuk check-in masuk</p></div><!-- Hasil Status Check-In -->${statusType && renderTemplate`<div${addAttribute(`checkin-result-alert alert-${statusType}`, "class")} data-astro-cid-nb6poqdm><div class="alert-icon" data-astro-cid-nb6poqdm>${statusType === "success" && "✓"}${statusType === "error" && "✗"}${statusType === "warning" && "⚠"}</div><div class="alert-body" data-astro-cid-nb6poqdm><h3 data-astro-cid-nb6poqdm>${resultMsg}</h3>${checkedInUser.name && renderTemplate`<div class="user-info" data-astro-cid-nb6poqdm>ID Pendaftar: <strong data-astro-cid-nb6poqdm>#REG-${checkedInUser.id}</strong> <br data-astro-cid-nb6poqdm><div style="margin: 0.5rem 0;" data-astro-cid-nb6poqdm>Nama:<ul style="margin-top: 0.2rem; padding-left: 1.5rem;" data-astro-cid-nb6poqdm>${(() => {
		try {
			const parsed = JSON.parse(checkedInUser.name);
			if (Array.isArray(parsed) && parsed.length > 0) return parsed.map((p) => renderTemplate`<li data-astro-cid-nb6poqdm><strong data-astro-cid-nb6poqdm>${p.name}</strong> <span style="color:var(--accent); font-size:0.9rem;" data-astro-cid-nb6poqdm>(Jersey: ${p.ukuranJersey})</span></li>`);
		} catch (e) {}
		return renderTemplate`<li data-astro-cid-nb6poqdm><strong data-astro-cid-nb6poqdm>${checkedInUser.name}</strong></li>`;
	})()}</ul></div>Event: <strong data-astro-cid-nb6poqdm>${checkedInUser.eventTitle}</strong></div>`}</div></div>`}<div class="checkin-grid" data-astro-cid-nb6poqdm><!-- Kamera QR Scanner --><div class="scanner-card glass" data-astro-cid-nb6poqdm><h3 data-astro-cid-nb6poqdm>📷 Kamera Scan QR Code</h3><p class="desc" data-astro-cid-nb6poqdm>Izinkan akses kamera HP/Laptop Anda untuk men-scan E-Tiket</p><div class="camera-viewport-wrapper" data-astro-cid-nb6poqdm><div id="reader" data-astro-cid-nb6poqdm></div></div><div class="scanner-controls" data-astro-cid-nb6poqdm><button id="start-scan-btn" class="btn btn-primary btn-full" data-astro-cid-nb6poqdm>Aktifkan Kamera</button><button id="stop-scan-btn" class="btn btn-outline btn-full hidden" data-astro-cid-nb6poqdm>Matikan Kamera</button></div></div><!-- Manual Input --><div class="manual-card glass" data-astro-cid-nb6poqdm><h3 data-astro-cid-nb6poqdm>✍️ Check-In Manual</h3><p class="desc" data-astro-cid-nb6poqdm>Gunakan ini jika kamera bermasalah atau untuk input manual</p><form method="POST" class="manual-form" id="manual-checkin-form" data-astro-cid-nb6poqdm><div class="form-group" data-astro-cid-nb6poqdm><label for="ticketId" data-astro-cid-nb6poqdm>ID Registrasi / Kode Tiket</label><input type="text" id="ticketId" name="ticketId" placeholder="Contoh: 1 atau TICKET:QRISRUN-REG-1..." required data-astro-cid-nb6poqdm></div><button type="submit" class="btn btn-accent btn-full" data-astro-cid-nb6poqdm>Validasi Masuk</button></form></div></div></div></section><form id="qr-submit-form" method="POST" class="hidden" data-astro-cid-nb6poqdm><input type="hidden" id="qr-ticket-id-input" name="ticketId" data-astro-cid-nb6poqdm></form>` })}${renderScript($$result, "D:/Kuliah/Fun Run/src/pages/admin/checkin.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Kuliah/Fun Run/src/pages/admin/checkin.astro", void 0);
var $$file = "D:/Kuliah/Fun Run/src/pages/admin/checkin.astro";
var $$url = "/admin/checkin";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/checkin@_@astro
var page = () => checkin_exports;
//#endregion
export { page };
