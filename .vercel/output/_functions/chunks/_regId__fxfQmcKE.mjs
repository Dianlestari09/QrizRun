import { n as __exportAll, t as createComponent } from "./compiler_ZoD8EgYh.mjs";
import { T as createAstro, _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_B7Q_e2SV.mjs";
import { u as getRegistrationWithEventById } from "./db_CBEJZ1lV.mjs";
import { t as $$Layout } from "./Layout_DzANYLig.mjs";
//#region src/pages/ticket/[regId].astro
var _regId__exports = /* @__PURE__ */ __exportAll({
	default: () => $$RegId,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$RegId = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$RegId;
	const { regId } = Astro.params;
	const id = parseInt(regId || "", 10);
	if (isNaN(id)) return Astro.redirect("/");
	const registration = await getRegistrationWithEventById(id);
	if (!registration) return Astro.redirect("/");
	if (registration.status === "PENDING") return Astro.redirect(`/checkout/${registration.id}`);
	const formatDate = (dateStr) => {
		return new Date(dateStr).toLocaleDateString("id-ID", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		});
	};
	const ticketCode = `TICKET:QRISRUN-REG-${registration.id}:EMAIL-${registration.email}`;
	const qrCodeUrl = `https://quickchart.io/qr?size=150&text=${encodeURIComponent(ticketCode)}&ecLevel=M`;
	let primaryName = registration.name;
	let participants = [];
	try {
		const parsed = JSON.parse(registration.name);
		if (Array.isArray(parsed) && parsed.length > 0) {
			primaryName = parsed[0].name;
			participants = parsed;
		}
	} catch (e) {}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "E-Tiket Event Olahraga",
		"data-astro-cid-qy56h66r": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="ticket-section" data-astro-cid-qy56h66r><div class="glow-spot ticket-glow-1" data-astro-cid-qy56h66r></div><div class="glow-spot ticket-glow-2" data-astro-cid-qy56h66r></div><div class="container relative z-1 max-width-sm" data-astro-cid-qy56h66r><div class="success-message" data-astro-cid-qy56h66r><span class="check-icon" data-astro-cid-qy56h66r>✓</span><h2 data-astro-cid-qy56h66r>Pembayaran Berhasil!</h2><p data-astro-cid-qy56h66r>E-Tiket Anda telah aktif dan diterbitkan secara resmi.</p></div><!-- Ticket Card --><div class="ticket-card glass" data-astro-cid-qy56h66r><div class="ticket-header" data-astro-cid-qy56h66r><div class="logo" data-astro-cid-qy56h66r><span class="logo-icon" data-astro-cid-qy56h66r>⚡</span><span class="logo-text" data-astro-cid-qy56h66r>EVEN<span data-astro-cid-qy56h66r>TRACK</span></span></div><span class="ticket-badge" data-astro-cid-qy56h66r>E-TICKET OFFICIAL</span></div><div class="ticket-image-header" data-astro-cid-qy56h66r><img${addAttribute(registration.eventImageUrl, "src")}${addAttribute(registration.eventTitle, "alt")} class="ticket-img" data-astro-cid-qy56h66r><div class="overlay" data-astro-cid-qy56h66r></div><h1 class="ticket-event-title" data-astro-cid-qy56h66r>${registration.eventTitle}</h1></div><div class="ticket-body" data-astro-cid-qy56h66r><div class="ticket-info-grid" data-astro-cid-qy56h66r><div class="info-group" data-astro-cid-qy56h66r><span class="label" data-astro-cid-qy56h66r>Nama Pemesan</span><span class="val" data-astro-cid-qy56h66r>${primaryName}</span></div><div class="info-group" data-astro-cid-qy56h66r><span class="label" data-astro-cid-qy56h66r>Nomor WhatsApp</span><span class="val" data-astro-cid-qy56h66r>${registration.phone}</span></div><div class="info-group" data-astro-cid-qy56h66r><span class="label" data-astro-cid-qy56h66r>Hari & Tanggal</span><span class="val" data-astro-cid-qy56h66r>${formatDate(registration.eventDate)}</span></div><div class="info-group" data-astro-cid-qy56h66r><span class="label" data-astro-cid-qy56h66r>Lokasi Acara</span><span class="val" data-astro-cid-qy56h66r>${registration.eventLocation}</span></div><div class="info-group" data-astro-cid-qy56h66r><span class="label" data-astro-cid-qy56h66r>ID Registrasi</span><span class="val" data-astro-cid-qy56h66r>#REG-${registration.id}</span></div><div class="info-group" data-astro-cid-qy56h66r><span class="label" data-astro-cid-qy56h66r>Status Pembayaran</span><span class="val status-paid" data-astro-cid-qy56h66r>LUNAS</span></div></div>${participants.length > 0 && renderTemplate`<div class="participants-list" data-astro-cid-qy56h66r><h4 style="font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--text-secondary);" data-astro-cid-qy56h66r>Daftar Peserta Kolektif (${participants.length} Orang)</h4><table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 0.9rem;" data-astro-cid-qy56h66r><thead data-astro-cid-qy56h66r><tr style="border-bottom: 1px solid rgba(255,255,255,0.1);" data-astro-cid-qy56h66r><th style="padding: 0.5rem 0;" data-astro-cid-qy56h66r>Nama Lengkap</th><th style="padding: 0.5rem 0;" data-astro-cid-qy56h66r>Jersey</th></tr></thead><tbody data-astro-cid-qy56h66r>${participants.map((p) => renderTemplate`<tr style="border-bottom: 1px dashed rgba(255,255,255,0.05);" data-astro-cid-qy56h66r><td style="padding: 0.5rem 0; font-weight: 600;" data-astro-cid-qy56h66r>${p.name}</td><td style="padding: 0.5rem 0; color: var(--accent); font-weight: bold;" data-astro-cid-qy56h66r>${p.ukuranJersey}</td></tr>`)}</tbody></table></div>`}<div class="ticket-qr-section" data-astro-cid-qy56h66r><div class="qr-box" data-astro-cid-qy56h66r><img${addAttribute(qrCodeUrl, "src")} alt="Ticket QR Code" data-astro-cid-qy56h66r></div><div class="qr-instructions" data-astro-cid-qy56h66r><strong data-astro-cid-qy56h66r>Tunjukkan QR Code ini</strong><p data-astro-cid-qy56h66r>Scan tiket ini kepada panitia di lokasi acara untuk proses check-in pendaftaran.</p></div></div></div><div class="ticket-footer-strip" data-astro-cid-qy56h66r><span data-astro-cid-qy56h66r>Harap simpan halaman ini atau ambil tangkapan layar (screenshot).</span></div></div><div class="ticket-actions" data-astro-cid-qy56h66r><button onclick="window.print()" class="btn btn-outline" data-astro-cid-qy56h66r>🖨️ Cetak E-Tiket</button><a href="/" class="btn btn-accent" data-astro-cid-qy56h66r>Kembali ke Beranda</a></div></div></section>` })}`;
}, "D:/Kuliah/Fun Run/src/pages/ticket/[regId].astro", void 0);
var $$file = "D:/Kuliah/Fun Run/src/pages/ticket/[regId].astro";
var $$url = "/ticket/[regId]";
//#endregion
//#region \0virtual:astro:page:src/pages/ticket/[regId]@_@astro
var page = () => _regId__exports;
//#endregion
export { page };
