import { n as __exportAll, t as createComponent } from "./compiler_ZoD8EgYh.mjs";
import { d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_B7Q_e2SV.mjs";
import { t as $$AdminLayout } from "./AdminLayout_Beuq7qRw.mjs";
import { o as getAllEvents, s as getAllRegistrations } from "./db_CBEJZ1lV.mjs";
//#region src/pages/admin/index.astro
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const events = await getAllEvents();
	const registrations = await getAllRegistrations();
	const totalEvents = events.length;
	const upcomingEventsCount = events.filter((e) => e.status === "UPCOMING").length;
	const totalRegistered = registrations.length;
	const totalRevenue = registrations.filter((r) => r.status === "PAID").reduce((sum, r) => sum + r.amount, 0);
	const formatPrice = (price) => {
		if (price === 0) return "Gratis";
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0
		}).format(price);
	};
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"title": "Dashboard Admin",
		"data-astro-cid-nsou3le4": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="admin-dashboard" data-astro-cid-nsou3le4><div class="glow-spot admin-glow" data-astro-cid-nsou3le4></div><div class="container relative z-1" data-astro-cid-nsou3le4><div class="admin-header" data-astro-cid-nsou3le4><div data-astro-cid-nsou3le4><h1 class="admin-title" data-astro-cid-nsou3le4>Dashboard Admin</h1><p class="admin-subtitle" data-astro-cid-nsou3le4>Ikhtisar data sistem pendaftaran event Syiar QRIS Run</p></div></div><!-- Kartu Statistik --><div class="stats-grid" data-astro-cid-nsou3le4><div class="stat-box glass" data-astro-cid-nsou3le4><div class="stat-icon" data-astro-cid-nsou3le4>total</div><div class="stat-info" data-astro-cid-nsou3le4><span class="label" data-astro-cid-nsou3le4>Total Event</span><span class="value" data-astro-cid-nsou3le4>${totalEvents}</span></div></div><div class="stat-box glass" data-astro-cid-nsou3le4><div class="stat-icon upcoming" data-astro-cid-nsou3le4>up</div><div class="stat-info" data-astro-cid-nsou3le4><span class="label" data-astro-cid-nsou3le4>Event Mendatang</span><span class="value" data-astro-cid-nsou3le4>${upcomingEventsCount}</span></div></div><div class="stat-box glass" data-astro-cid-nsou3le4><div class="stat-icon registrants" data-astro-cid-nsou3le4>users</div><div class="stat-info" data-astro-cid-nsou3le4><span class="label" data-astro-cid-nsou3le4>Total Pendaftar</span><span class="value" data-astro-cid-nsou3le4>${totalRegistered}</span></div></div><div class="stat-box glass" data-astro-cid-nsou3le4><div class="stat-icon revenue" data-astro-cid-nsou3le4>rp</div><div class="stat-info" data-astro-cid-nsou3le4><span class="label" data-astro-cid-nsou3le4>Total Pendapatan</span><span class="value" data-astro-cid-nsou3le4>${formatPrice(totalRevenue)}</span></div></div></div><div class="dashboard-welcome glass" data-astro-cid-nsou3le4><h2 data-astro-cid-nsou3le4>Selamat Datang di Admin Panel</h2><p data-astro-cid-nsou3le4>Gunakan menu navigasi di sebelah kiri untuk mengelola <strong data-astro-cid-nsou3le4>Event</strong>, memeriksa <strong data-astro-cid-nsou3le4>Pendaftar Masuk</strong>, atau melakukan <strong data-astro-cid-nsou3le4>Check-In Tiket</strong> saat hari H pelaksanaan event.</p></div></div></section>` })}`;
}, "D:/Kuliah/Fun Run/src/pages/admin/index.astro", void 0);
var $$file = "D:/Kuliah/Fun Run/src/pages/admin/index.astro";
var $$url = "/admin";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/index@_@astro
var page = () => admin_exports;
//#endregion
export { page };
