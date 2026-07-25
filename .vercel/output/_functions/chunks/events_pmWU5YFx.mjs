import { n as __exportAll, t as createComponent } from "./compiler_ZoD8EgYh.mjs";
import { T as createAstro, _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_B7Q_e2SV.mjs";
import { t as $$AdminLayout } from "./AdminLayout_Beuq7qRw.mjs";
import { a as deleteEvent, o as getAllEvents } from "./db_CBEJZ1lV.mjs";
//#region src/pages/admin/events.astro
var events_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Events,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Events = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Events;
	let errorMsg = "";
	let successMsg = "";
	if (Astro.request.method === "POST") try {
		const formData = await Astro.request.formData();
		const action = formData.get("action");
		const idStr = formData.get("id");
		if (action === "delete" && idStr) if (await deleteEvent(parseInt(idStr.toString(), 10))) successMsg = "Event berhasil dihapus!";
		else errorMsg = "Gagal menghapus event. Event tidak ditemukan.";
	} catch (err) {
		errorMsg = "Terjadi kesalahan saat memproses permintaan.";
		console.error(err);
	}
	const eventsDisplay = await getAllEvents();
	const formatPrice = (price) => {
		if (price === 0) return "Gratis";
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0
		}).format(price);
	};
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"title": "Manajemen Event",
		"data-astro-cid-dpnskmyk": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="admin-dashboard" data-astro-cid-dpnskmyk><div class="glow-spot admin-glow" data-astro-cid-dpnskmyk></div><div class="container relative z-1" data-astro-cid-dpnskmyk><div class="admin-header" data-astro-cid-dpnskmyk><div data-astro-cid-dpnskmyk><h1 class="admin-title" data-astro-cid-dpnskmyk>Manajemen Event</h1><p class="admin-subtitle" data-astro-cid-dpnskmyk>Kelola daftar event, tambah event baru, dan edit informasi event.</p></div><div class="admin-header-actions" data-astro-cid-dpnskmyk><a href="/admin/add" class="btn btn-accent" data-astro-cid-dpnskmyk>+ Tambah Event Baru</a></div></div>${successMsg && renderTemplate`<div class="alert alert-success" data-astro-cid-dpnskmyk>${successMsg}</div>`}${errorMsg && renderTemplate`<div class="alert alert-danger" data-astro-cid-dpnskmyk>${errorMsg}</div>`}<div class="table-container glass" data-astro-cid-dpnskmyk><h2 class="table-title" data-astro-cid-dpnskmyk>Daftar Semua Event</h2>${eventsDisplay.length > 0 ? renderTemplate`<div class="table-scroll" data-astro-cid-dpnskmyk><table class="event-table" data-astro-cid-dpnskmyk><thead data-astro-cid-dpnskmyk><tr data-astro-cid-dpnskmyk><th data-astro-cid-dpnskmyk>Banner</th><th data-astro-cid-dpnskmyk>Nama Event</th><th data-astro-cid-dpnskmyk>Kategori</th><th data-astro-cid-dpnskmyk>Tanggal</th><th data-astro-cid-dpnskmyk>Lokasi</th><th data-astro-cid-dpnskmyk>Harga</th><th data-astro-cid-dpnskmyk>Pendaftar</th><th data-astro-cid-dpnskmyk>Status</th><th class="actions-col" data-astro-cid-dpnskmyk>Aksi</th></tr></thead><tbody data-astro-cid-dpnskmyk>${eventsDisplay.map((event) => renderTemplate`<tr data-astro-cid-dpnskmyk><td data-astro-cid-dpnskmyk><img${addAttribute(event.imageUrl, "src")}${addAttribute(event.title, "alt")} class="table-img" data-astro-cid-dpnskmyk></td><td data-astro-cid-dpnskmyk><div class="event-name-cell" data-astro-cid-dpnskmyk><strong data-astro-cid-dpnskmyk>${event.title}</strong><span class="event-id" data-astro-cid-dpnskmyk>ID: #${event.id}</span></div></td><td data-astro-cid-dpnskmyk><span${addAttribute(`badge badge-${event.category.toLowerCase()}`, "class")} data-astro-cid-dpnskmyk>${event.category}</span></td><td data-astro-cid-dpnskmyk>${event.date}</td><td data-astro-cid-dpnskmyk>${event.location}</td><td data-astro-cid-dpnskmyk>${formatPrice(event.price)}</td><td data-astro-cid-dpnskmyk>${event.registered} / ${event.slots}</td><td data-astro-cid-dpnskmyk><span${addAttribute(`status-dot ${event.status === "UPCOMING" ? "upcoming" : "finished"}`, "class")} data-astro-cid-dpnskmyk>${event.status}</span></td><td data-astro-cid-dpnskmyk><div class="action-buttons" data-astro-cid-dpnskmyk><a${addAttribute(`/admin/edit/${event.id}`, "href")} class="btn-table btn-edit" data-astro-cid-dpnskmyk>Edit</a><form method="POST" class="delete-form" onsubmit="return confirm('Apakah Anda yakin ingin menghapus event ini?');" data-astro-cid-dpnskmyk><input type="hidden" name="action" value="delete" data-astro-cid-dpnskmyk><input type="hidden" name="id"${addAttribute(event.id, "value")} data-astro-cid-dpnskmyk><button type="submit" class="btn-table btn-delete" data-astro-cid-dpnskmyk>Hapus</button></form></div></td></tr>`)}</tbody></table></div>` : renderTemplate`<div class="empty-state" data-astro-cid-dpnskmyk><p data-astro-cid-dpnskmyk>Belum ada event yang ditambahkan.</p></div>`}</div></div></section>` })}`;
}, "D:/Kuliah/Fun Run/src/pages/admin/events.astro", void 0);
var $$file = "D:/Kuliah/Fun Run/src/pages/admin/events.astro";
var $$url = "/admin/events";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/events@_@astro
var page = () => events_exports;
//#endregion
export { page };
