import { n as __exportAll, t as createComponent } from "./compiler_ZoD8EgYh.mjs";
import { T as createAstro, _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_B7Q_e2SV.mjs";
import { t as renderScript } from "./script_Cu9Q5UeQ.mjs";
import { c as getEventById, p as updateRegistrationAmount, r as createRegistration } from "./db_CBEJZ1lV.mjs";
import { t as $$Layout } from "./Layout_DzANYLig.mjs";
//#region src/pages/events/[id].astro
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
	if (isNaN(eventId)) return Astro.redirect("/");
	const event = await getEventById(eventId);
	if (!event) return Astro.redirect("/");
	let errorMsg = "";
	if (Astro.request.method === "POST") try {
		const formData = await Astro.request.formData();
		const email = formData.get("email")?.toString() || "";
		const phone = formData.get("phone")?.toString() || "";
		const participants = [];
		let i = 1;
		while (formData.has(`name_${i}`)) {
			participants.push({
				name: formData.get(`name_${i}`)?.toString() || "",
				jenisKelamin: formData.get(`jenisKelamin_${i}`)?.toString() || "",
				jenisId: formData.get(`jenisId_${i}`)?.toString() || "",
				nomorId: formData.get(`nomorId_${i}`)?.toString() || "",
				ukuranJersey: formData.get(`ukuranJersey_${i}`)?.toString() || ""
			});
			i++;
		}
		if (participants.length === 0 || !email || !phone) errorMsg = "Data peserta, email, dan nomor WhatsApp wajib diisi!";
		else if (event.registered + participants.length > event.slots) errorMsg = "Maaf, sisa kuota pendaftaran tidak mencukupi untuk jumlah peserta ini.";
		else {
			const totalBase = event.price * participants.length;
			const nameField = JSON.stringify(participants);
			const regId = await createRegistration({
				eventId: event.id,
				name: nameField,
				email,
				phone,
				status: "PENDING",
				amount: totalBase,
				paymentMethod: "QRIS",
				checkedIn: false
			});
			if (regId) {
				await updateRegistrationAmount(regId, totalBase + regId);
				return Astro.redirect(`/checkout/${regId}`);
			} else errorMsg = "Gagal memproses pendaftaran. Silakan coba lagi.";
		}
	} catch (err) {
		errorMsg = "Terjadi kesalahan saat memproses pendaftaran.";
		console.error(err);
	}
	const formatPrice = (price) => {
		if (price === 0) return "Gratis";
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0
		}).format(price);
	};
	const isFull = event.registered >= event.slots;
	const isFinished = event.status === "FINISHED";
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": event.title,
		"description": event.description,
		"data-astro-cid-hdr54pc2": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="event-detail-section" data-astro-cid-hdr54pc2><div class="glow-spot event-glow-1" data-astro-cid-hdr54pc2></div><div class="glow-spot event-glow-2" data-astro-cid-hdr54pc2></div><div class="container relative z-1" data-astro-cid-hdr54pc2><!-- <a href="/" class="back-link">&larr; Kembali ke Beranda</a> --><!-- Kolom Info Atas (Full Width) --><div class="info-column" style="margin-bottom: 2rem;" data-astro-cid-hdr54pc2><div class="banner-wrapper glass" data-astro-cid-hdr54pc2><img${addAttribute(event.imageUrl, "src")}${addAttribute(event.title, "alt")} class="detail-banner" data-astro-cid-hdr54pc2><span${addAttribute(`badge badge-${event.category.toLowerCase()} detail-badge`, "class")} data-astro-cid-hdr54pc2>${event.category}</span></div></div><form method="POST" class="reg-form" id="reg-form" data-astro-cid-hdr54pc2><div class="detail-grid" data-astro-cid-hdr54pc2><!-- Kolom Registrasi Kiri --><div class="reg-column" data-astro-cid-hdr54pc2><div class="reg-card glass" data-astro-cid-hdr54pc2><div class="kuota-info" data-astro-cid-hdr54pc2><div class="kuota-label" data-astro-cid-hdr54pc2><span data-astro-cid-hdr54pc2>Kuota Terisi</span><span data-astro-cid-hdr54pc2>${event.registered} / ${event.slots} Slot</span></div><div class="progress-bar" data-astro-cid-hdr54pc2><div class="progress-fill"${addAttribute(`width: ${event.registered / event.slots * 100}%`, "style")} data-astro-cid-hdr54pc2></div></div></div>${isFinished ? renderTemplate`<div class="status-alert alert-danger text-center" data-astro-cid-hdr54pc2><strong data-astro-cid-hdr54pc2>Event Telah Selesai</strong><p data-astro-cid-hdr54pc2>Pendaftaran sudah ditutup untuk event ini.</p></div>` : isFull ? renderTemplate`<div class="status-alert alert-danger text-center" data-astro-cid-hdr54pc2><strong data-astro-cid-hdr54pc2>Kuota Penuh</strong><p data-astro-cid-hdr54pc2>Maaf, slot pendaftaran telah habis terjual.</p></div>` : renderTemplate`<div class="form-wrapper" data-astro-cid-hdr54pc2><h3 data-astro-cid-hdr54pc2>Formulir Pendaftaran</h3>${errorMsg && renderTemplate`<div class="alert alert-danger" data-astro-cid-hdr54pc2>${errorMsg}</div>`}<div class="participant-container" id="participants-container" data-astro-cid-hdr54pc2><!-- Participant 1 --><div class="participant-block" data-index="1" data-astro-cid-hdr54pc2><h4 class="form-section-title" data-astro-cid-hdr54pc2>Data Peserta 1</h4><div class="form-group" data-astro-cid-hdr54pc2><label for="name_1" data-astro-cid-hdr54pc2>Nama Lengkap (Sesuai ID)</label><input type="text" id="name_1" name="name_1" required placeholder="Isi Nama sesuai ID Card Anda" data-astro-cid-hdr54pc2></div><div class="form-row" data-astro-cid-hdr54pc2><div class="form-group half" data-astro-cid-hdr54pc2><label for="jenisKelamin_1" data-astro-cid-hdr54pc2>Jenis Kelamin</label><select id="jenisKelamin_1" name="jenisKelamin_1" required data-astro-cid-hdr54pc2><option value="Pria" data-astro-cid-hdr54pc2>Pria</option><option value="Wanita" data-astro-cid-hdr54pc2>Wanita</option></select></div><div class="form-group half" data-astro-cid-hdr54pc2><label for="jenisId_1" data-astro-cid-hdr54pc2>Jenis ID</label><select id="jenisId_1" name="jenisId_1" required data-astro-cid-hdr54pc2><option value="KTP" data-astro-cid-hdr54pc2>KTP</option><option value="SIM" data-astro-cid-hdr54pc2>SIM</option><option value="Paspor" data-astro-cid-hdr54pc2>Paspor</option><option value="Kartu Pelajar" data-astro-cid-hdr54pc2>Kartu Pelajar</option></select></div></div><div class="form-group" data-astro-cid-hdr54pc2><label for="nomorId_1" data-astro-cid-hdr54pc2>Nomor ID</label><input type="text" id="nomorId_1" name="nomorId_1" required placeholder="Isi dengan Nomor NIK Anda" data-astro-cid-hdr54pc2></div></div></div><div class="add-participant-row mt-3" data-astro-cid-hdr54pc2><button type="button" id="add-participant-btn" class="btn btn-outline btn-sm" data-astro-cid-hdr54pc2>+ Tambah Peserta</button><button type="button" id="remove-participant-btn" class="btn btn-danger btn-sm" style="display: none;" data-astro-cid-hdr54pc2>- Kurangi Peserta</button></div><input type="hidden" id="jumlah_peserta" name="jumlah_peserta" value="1" data-astro-cid-hdr54pc2><hr style="border-color: rgba(255,255,255,0.1); margin: 2rem 0;" data-astro-cid-hdr54pc2><h4 class="form-section-title" data-astro-cid-hdr54pc2>Panduan Ukuran Jersey</h4><div class="jersey-preview-card mt-3" data-astro-cid-hdr54pc2><div class="jersey-preview-grid" data-astro-cid-hdr54pc2><div class="jersey-preview-item" data-astro-cid-hdr54pc2><img src="/jersey-placeholder.webp" alt="Jersey Depan" class="jersey-thumb" data-astro-cid-hdr54pc2><span class="jersey-caption" data-astro-cid-hdr54pc2>Depan Jersey</span></div><div class="jersey-preview-item" data-astro-cid-hdr54pc2><img src="/jersey-back-placeholder.webp" alt="Jersey Belakang" class="jersey-thumb" data-astro-cid-hdr54pc2><span class="jersey-caption" data-astro-cid-hdr54pc2>Belakang Jersey</span></div></div></div><div class="size-chart-compact mt-2 mb-4" data-astro-cid-hdr54pc2><table class="compact-table" data-astro-cid-hdr54pc2><thead data-astro-cid-hdr54pc2><tr data-astro-cid-hdr54pc2><th data-astro-cid-hdr54pc2>Size</th><th data-astro-cid-hdr54pc2>Lebar (cm)</th><th data-astro-cid-hdr54pc2>Panjang (cm)</th></tr></thead><tbody data-astro-cid-hdr54pc2><tr data-astro-cid-hdr54pc2><td data-astro-cid-hdr54pc2>S</td><td data-astro-cid-hdr54pc2>47</td><td data-astro-cid-hdr54pc2>68</td></tr><tr data-astro-cid-hdr54pc2><td data-astro-cid-hdr54pc2>M</td><td data-astro-cid-hdr54pc2>50</td><td data-astro-cid-hdr54pc2>70</td></tr><tr data-astro-cid-hdr54pc2><td data-astro-cid-hdr54pc2>L</td><td data-astro-cid-hdr54pc2>53</td><td data-astro-cid-hdr54pc2>72</td></tr><tr data-astro-cid-hdr54pc2><td data-astro-cid-hdr54pc2>XL</td><td data-astro-cid-hdr54pc2>56</td><td data-astro-cid-hdr54pc2>74</td></tr><tr data-astro-cid-hdr54pc2><td data-astro-cid-hdr54pc2>XXL</td><td data-astro-cid-hdr54pc2>59</td><td data-astro-cid-hdr54pc2>76</td></tr></tbody></table></div><div id="jersey-dropdowns-container" data-astro-cid-hdr54pc2><div class="form-group mt-3 jersey-select-block" data-index="1" data-astro-cid-hdr54pc2><label for="ukuranJersey_1" data-astro-cid-hdr54pc2>Ukuran Jersey Peserta 1</label><select id="ukuranJersey_1" name="ukuranJersey_1" required data-astro-cid-hdr54pc2><option value="S" data-astro-cid-hdr54pc2>S</option><option value="M" data-astro-cid-hdr54pc2>M</option><option value="L" data-astro-cid-hdr54pc2>L</option><option value="XL" data-astro-cid-hdr54pc2>XL</option><option value="XXL" data-astro-cid-hdr54pc2>XXL</option></select></div></div><h4 class="form-section-title mt-4" data-astro-cid-hdr54pc2>Data Kontak (Pemesan)</h4><div class="form-row" data-astro-cid-hdr54pc2><div class="form-group half" data-astro-cid-hdr54pc2><label for="email" data-astro-cid-hdr54pc2>Email Pemesan (Wajib diisi)</label><input type="email" id="email" name="email" required placeholder="Wajib isi Email untuk Konfirmasi" data-astro-cid-hdr54pc2></div><div class="form-group half" data-astro-cid-hdr54pc2><label for="phone" data-astro-cid-hdr54pc2>Nomor WhatsApp</label><input type="tel" id="phone" name="phone" required placeholder="08..." data-astro-cid-hdr54pc2></div></div><div class="terms-group mt-4 pt-3" style="border-top: 1px dashed rgba(255,255,255,0.2);" data-astro-cid-hdr54pc2><label class="checkbox-label" data-astro-cid-hdr54pc2><input type="checkbox" name="terms" required data-astro-cid-hdr54pc2><span data-astro-cid-hdr54pc2>Saya menyetujui <a href="/regulasi" target="_blank" class="terms-link" data-astro-cid-hdr54pc2>syarat dan ketentuan</a>.</span></label></div></div>`}</div></div><!-- Kolom Ringkasan Kanan (Sticky) -->${!isFinished && !isFull && renderTemplate`<div class="summary-column" data-astro-cid-hdr54pc2><div class="reg-card glass" data-astro-cid-hdr54pc2><div class="price-header" style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px dashed rgba(255,255,255,0.2);" data-astro-cid-hdr54pc2><span class="label" data-astro-cid-hdr54pc2>Biaya Pendaftaran</span><span class="value price-tag" data-astro-cid-hdr54pc2>${formatPrice(event.price)}</span></div><h4 class="form-section-title" data-astro-cid-hdr54pc2>Ringkasan Pesanan</h4><div class="category-card selected mt-3" data-astro-cid-hdr54pc2><div class="category-info" data-astro-cid-hdr54pc2><span class="cat-name" data-astro-cid-hdr54pc2>${event.title}</span><span class="cat-type" data-astro-cid-hdr54pc2>Total Peserta: <span id="summary-qty" data-astro-cid-hdr54pc2>1</span> Orang</span><span class="cat-price text-accent" id="summary-price"${addAttribute(event.price, "data-price")} data-astro-cid-hdr54pc2>${formatPrice(event.price)}</span></div><div class="category-badge" data-astro-cid-hdr54pc2><span class="badge-text" data-astro-cid-hdr54pc2>${event.category}</span></div></div><div class="summary-extra" style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-top: 1rem; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 1rem;" data-astro-cid-hdr54pc2><span class="text-secondary" data-astro-cid-hdr54pc2>Fasilitas Jersey</span><span style="color: var(--success); font-weight: 600;" data-astro-cid-hdr54pc2>TERMASUK</span></div><div class="price-breakdown mt-4 p-3" style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 8px;" data-astro-cid-hdr54pc2><h5 style="color: #06b6d4; font-size: 0.95rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;" data-astro-cid-hdr54pc2><span style="font-size: 1.1em;" data-astro-cid-hdr54pc2>ℹ️</span> Rincian Biaya Rp81.000</h5><p style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 0.5rem; line-height: 1.5;" data-astro-cid-hdr54pc2>Angka <strong data-astro-cid-hdr54pc2>81</strong> merupakan simbolis perayaan HUT Kemerdekaan RI ke-81 tahun 2026.</p><ul style="font-size: 0.85rem; color: #cbd5e1; padding-left: 1.2rem; margin-bottom: 0.5rem;" data-astro-cid-hdr54pc2><li data-astro-cid-hdr54pc2><strong data-astro-cid-hdr54pc2>Rp50.000</strong> : Jersey Official Syiar QRIS Run</li><li data-astro-cid-hdr54pc2><strong data-astro-cid-hdr54pc2>Rp31.000</strong> : Disalurkan sepenuhnya untuk Donasi Wakaf Produktif</li></ul><p style="font-size: 0.8rem; color: #94a3b8; font-style: italic; margin: 0; line-height: 1.4; border-top: 1px dashed rgba(6, 182, 212, 0.3); padding-top: 0.5rem;" data-astro-cid-hdr54pc2>*Sistem akan menambahkan beberapa nominal rupiah acak sebagai ID Registrasi pada total bayar Anda. Tambahan nominal tersebut 100% juga akan masuk ke dalam dana wakaf.</p></div><button type="submit" class="btn btn-accent btn-block submit-btn mt-4" data-astro-cid-hdr54pc2>Konfirmasi Pesanan</button></div></div>`}</div></form>${renderScript($$result, "D:/Kuliah/Fun Run/src/pages/events/[id].astro?astro&type=script&index=0&lang.ts")}</div></section>` })}`;
}, "D:/Kuliah/Fun Run/src/pages/events/[id].astro", void 0);
var $$file = "D:/Kuliah/Fun Run/src/pages/events/[id].astro";
var $$url = "/events/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/events/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
