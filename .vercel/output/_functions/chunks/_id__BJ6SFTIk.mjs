import { n as __exportAll, t as createComponent } from "./compiler_ZoD8EgYh.mjs";
import { T as createAstro, _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_B7Q_e2SV.mjs";
import { t as $$AdminLayout } from "./AdminLayout_Beuq7qRw.mjs";
import { c as getEventById, f as updateEvent } from "./db_CBEJZ1lV.mjs";
//#region src/pages/admin/edit/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Id = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const { id } = Astro.params;
	const eventId = parseInt(id || "", 10);
	if (isNaN(eventId)) return Astro.redirect("/admin");
	const event = await getEventById(eventId);
	if (!event) return Astro.redirect("/admin");
	let errorMsg = "";
	if (Astro.request.method === "POST") try {
		const formData = await Astro.request.formData();
		const title = formData.get("title")?.toString() || "";
		const date = formData.get("date")?.toString() || "";
		const location = formData.get("location")?.toString() || "";
		const category = formData.get("category")?.toString() || "";
		const imageUrl = formData.get("imageUrl")?.toString() || "";
		const status = formData.get("status")?.toString() || "UPCOMING";
		const description = formData.get("description")?.toString() || "";
		const price = parseInt(formData.get("price")?.toString() || "0", 10);
		const slots = parseInt(formData.get("slots")?.toString() || "100", 10);
		const registered = parseInt(formData.get("registered")?.toString() || "0", 10);
		if (!title || !date || !location || !category || !imageUrl || !description) errorMsg = "Semua field wajib diisi!";
		else if (await updateEvent(eventId, {
			title,
			date,
			location,
			category,
			imageUrl,
			status,
			description,
			price,
			slots,
			registered
		})) return Astro.redirect("/admin");
		else errorMsg = "Gagal menyimpan perubahan. Data tidak ditemukan atau tidak ada perubahan.";
	} catch (err) {
		errorMsg = "Gagal menyimpan perubahan event.";
		console.error(err);
	}
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"title": `Edit Event: ${event.title}`,
		"data-astro-cid-uwsqfk6k": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="admin-form-section" data-astro-cid-uwsqfk6k><div class="glow-spot form-glow" data-astro-cid-uwsqfk6k></div><div class="container form-container relative z-1" data-astro-cid-uwsqfk6k><div class="form-header" data-astro-cid-uwsqfk6k><a href="/admin" class="back-link" data-astro-cid-uwsqfk6k>&larr; Kembali ke Dashboard</a><h1 class="form-title" data-astro-cid-uwsqfk6k>Edit Event</h1><p class="form-subtitle" data-astro-cid-uwsqfk6k>Lakukan perubahan informasi untuk event ID #${event.id}</p></div>${errorMsg && renderTemplate`<div class="alert alert-danger" data-astro-cid-uwsqfk6k>${errorMsg}</div>`}<form method="POST" class="admin-form glass" data-astro-cid-uwsqfk6k><div class="form-grid" data-astro-cid-uwsqfk6k><!-- Nama Event --><div class="form-group full-width" data-astro-cid-uwsqfk6k><label for="title" data-astro-cid-uwsqfk6k>Nama Event</label><input type="text" id="title" name="title" required${addAttribute(event.title, "value")} data-astro-cid-uwsqfk6k></div><!-- Kategori --><div class="form-group" data-astro-cid-uwsqfk6k><label for="category" data-astro-cid-uwsqfk6k>Kategori Olahraga</label><select id="category" name="category" required data-astro-cid-uwsqfk6k><option value="RUNNING"${addAttribute(event.category === "RUNNING", "selected")} data-astro-cid-uwsqfk6k>RUNNING (Lari)</option><option value="CYCLING"${addAttribute(event.category === "CYCLING", "selected")} data-astro-cid-uwsqfk6k>CYCLING (Sepeda)</option><option value="POUNDFIT"${addAttribute(event.category === "POUNDFIT", "selected")} data-astro-cid-uwsqfk6k>POUNDFIT (Senam)</option><option value="WALK"${addAttribute(event.category === "WALK", "selected")} data-astro-cid-uwsqfk6k>WALK (Jalan Santai)</option><option value="TRIATHLON"${addAttribute(event.category === "TRIATHLON", "selected")} data-astro-cid-uwsqfk6k>TRIATHLON</option></select></div><!-- Tanggal Event --><div class="form-group" data-astro-cid-uwsqfk6k><label for="date" data-astro-cid-uwsqfk6k>Tanggal Pelaksanaan</label><input type="date" id="date" name="date" required${addAttribute(event.date, "value")} data-astro-cid-uwsqfk6k></div><!-- Lokasi --><div class="form-group full-width" data-astro-cid-uwsqfk6k><label for="location" data-astro-cid-uwsqfk6k>Lokasi Event</label><input type="text" id="location" name="location" required${addAttribute(event.location, "value")} data-astro-cid-uwsqfk6k></div><!-- Image URL --><div class="form-group full-width" data-astro-cid-uwsqfk6k><label for="imageUrl" data-astro-cid-uwsqfk6k>URL Gambar Banner</label><input type="url" id="imageUrl" name="imageUrl" required${addAttribute(event.imageUrl, "value")} data-astro-cid-uwsqfk6k></div><!-- Status --><div class="form-group" data-astro-cid-uwsqfk6k><label for="status" data-astro-cid-uwsqfk6k>Status Event</label><select id="status" name="status" required data-astro-cid-uwsqfk6k><option value="UPCOMING"${addAttribute(event.status === "UPCOMING", "selected")} data-astro-cid-uwsqfk6k>UPCOMING (Mendatang)</option><option value="FINISHED"${addAttribute(event.status === "FINISHED", "selected")} data-astro-cid-uwsqfk6k>FINISHED (Selesai)</option></select></div><!-- Harga Pendaftaran --><div class="form-group" data-astro-cid-uwsqfk6k><label for="price" data-astro-cid-uwsqfk6k>Harga Tiket (IDR)</label><input type="number" id="price" name="price" min="0"${addAttribute(event.price, "value")} required data-astro-cid-uwsqfk6k></div><!-- Kuota Pendaftaran (Slots) --><div class="form-group" data-astro-cid-uwsqfk6k><label for="slots" data-astro-cid-uwsqfk6k>Total Kuota (Slots)</label><input type="number" id="slots" name="slots" min="1"${addAttribute(event.slots, "value")} required data-astro-cid-uwsqfk6k></div><!-- Terdaftar --><div class="form-group" data-astro-cid-uwsqfk6k><label for="registered" data-astro-cid-uwsqfk6k>Jumlah Terdaftar</label><input type="number" id="registered" name="registered" min="0"${addAttribute(event.registered, "value")} required data-astro-cid-uwsqfk6k></div><!-- Deskripsi --><div class="form-group full-width" data-astro-cid-uwsqfk6k><label for="description" data-astro-cid-uwsqfk6k>Deskripsi Lengkap</label><textarea id="description" name="description" rows="5" required data-astro-cid-uwsqfk6k>${event.description}</textarea></div></div><div class="form-actions" data-astro-cid-uwsqfk6k><a href="/admin" class="btn btn-outline" data-astro-cid-uwsqfk6k>Batal</a><button type="submit" class="btn btn-accent" data-astro-cid-uwsqfk6k>Simpan Perubahan</button></div></form></div></section>` })}`;
}, "D:/Kuliah/Fun Run/src/pages/admin/edit/[id].astro", void 0);
var $$file = "D:/Kuliah/Fun Run/src/pages/admin/edit/[id].astro";
var $$url = "/admin/edit/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/edit/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
