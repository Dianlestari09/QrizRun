import { n as __exportAll, t as createComponent } from "./compiler_ZoD8EgYh.mjs";
import { T as createAstro, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_B7Q_e2SV.mjs";
import { t as $$AdminLayout } from "./AdminLayout_Beuq7qRw.mjs";
import { n as createEvent } from "./db_CBEJZ1lV.mjs";
//#region src/pages/admin/add.astro
var add_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Add,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Add = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Add;
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
		else {
			await createEvent({
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
			});
			return Astro.redirect("/admin");
		}
	} catch (err) {
		errorMsg = "Gagal menambahkan event. Periksa kembali inputan Anda.";
		console.error(err);
	}
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"title": "Tambah Event Baru",
		"data-astro-cid-y52zd7fw": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="admin-form-section" data-astro-cid-y52zd7fw><div class="glow-spot form-glow" data-astro-cid-y52zd7fw></div><div class="container form-container relative z-1" data-astro-cid-y52zd7fw><div class="form-header" data-astro-cid-y52zd7fw><a href="/admin" class="back-link" data-astro-cid-y52zd7fw>&larr; Kembali ke Dashboard</a><h1 class="form-title" data-astro-cid-y52zd7fw>Tambah Event Baru</h1><p class="form-subtitle" data-astro-cid-y52zd7fw>Buat dan umumkan event olahraga baru Anda ke publik</p></div>${errorMsg && renderTemplate`<div class="alert alert-danger" data-astro-cid-y52zd7fw>${errorMsg}</div>`}<form method="POST" class="admin-form glass" data-astro-cid-y52zd7fw><div class="form-grid" data-astro-cid-y52zd7fw><!-- Nama Event --><div class="form-group full-width" data-astro-cid-y52zd7fw><label for="title" data-astro-cid-y52zd7fw>Nama Event</label><input type="text" id="title" name="title" required placeholder="Contoh: Bandung Ultra Trail Run 2026" data-astro-cid-y52zd7fw></div><!-- Kategori --><div class="form-group" data-astro-cid-y52zd7fw><label for="category" data-astro-cid-y52zd7fw>Kategori Olahraga</label><select id="category" name="category" required data-astro-cid-y52zd7fw><option value="RUNNING" data-astro-cid-y52zd7fw>RUNNING (Lari)</option><option value="CYCLING" data-astro-cid-y52zd7fw>CYCLING (Sepeda)</option><option value="POUNDFIT" data-astro-cid-y52zd7fw>POUNDFIT (Senam)</option><option value="WALK" data-astro-cid-y52zd7fw>WALK (Jalan Santai)</option><option value="TRIATHLON" data-astro-cid-y52zd7fw>TRIATHLON</option></select></div><!-- Tanggal Event --><div class="form-group" data-astro-cid-y52zd7fw><label for="date" data-astro-cid-y52zd7fw>Tanggal Pelaksanaan</label><input type="date" id="date" name="date" required data-astro-cid-y52zd7fw></div><!-- Lokasi --><div class="form-group full-width" data-astro-cid-y52zd7fw><label for="location" data-astro-cid-y52zd7fw>Lokasi Event</label><input type="text" id="location" name="location" required placeholder="Contoh: KAB. GARUT, JAWA BARAT" data-astro-cid-y52zd7fw></div><!-- Image URL --><div class="form-group full-width" data-astro-cid-y52zd7fw><label for="imageUrl" data-astro-cid-y52zd7fw>URL Gambar Banner</label><input type="url" id="imageUrl" name="imageUrl" required placeholder="Masukkan URL gambar (Unsplash dll.)" data-astro-cid-y52zd7fw><span class="input-helper" data-astro-cid-y52zd7fw>Rekomendasi gunakan gambar lanskap. Contoh default: https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=640</span></div><!-- Status --><div class="form-group" data-astro-cid-y52zd7fw><label for="status" data-astro-cid-y52zd7fw>Status Event</label><select id="status" name="status" required data-astro-cid-y52zd7fw><option value="UPCOMING" data-astro-cid-y52zd7fw>UPCOMING (Mendatang)</option><option value="FINISHED" data-astro-cid-y52zd7fw>FINISHED (Selesai)</option></select></div><!-- Harga Pendaftaran --><div class="form-group" data-astro-cid-y52zd7fw><label for="price" data-astro-cid-y52zd7fw>Harga Tiket (IDR)</label><input type="number" id="price" name="price" min="0" value="0" required data-astro-cid-y52zd7fw></div><!-- Kuota Pendaftaran (Slots) --><div class="form-group" data-astro-cid-y52zd7fw><label for="slots" data-astro-cid-y52zd7fw>Total Kuota (Slots)</label><input type="number" id="slots" name="slots" min="1" value="100" required data-astro-cid-y52zd7fw></div><!-- Terdaftar (Awal) --><div class="form-group" data-astro-cid-y52zd7fw><label for="registered" data-astro-cid-y52zd7fw>Jumlah Terdaftar Awal</label><input type="number" id="registered" name="registered" min="0" value="0" required data-astro-cid-y52zd7fw></div><!-- Deskripsi --><div class="form-group full-width" data-astro-cid-y52zd7fw><label for="description" data-astro-cid-y52zd7fw>Deskripsi Lengkap</label><textarea id="description" name="description" rows="5" required placeholder="Tuliskan deskripsi lengkap, rute, fasilitas, dan detail event lainnya..." data-astro-cid-y52zd7fw></textarea></div></div><div class="form-actions" data-astro-cid-y52zd7fw><a href="/admin" class="btn btn-outline" data-astro-cid-y52zd7fw>Batal</a><button type="submit" class="btn btn-accent" data-astro-cid-y52zd7fw>Publish Event</button></div></form></div></section>` })}`;
}, "D:/Kuliah/Fun Run/src/pages/admin/add.astro", void 0);
var $$file = "D:/Kuliah/Fun Run/src/pages/admin/add.astro";
var $$url = "/admin/add";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/add@_@astro
var page = () => add_exports;
//#endregion
export { page };
