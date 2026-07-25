import { n as __exportAll, t as createComponent } from "./compiler_ZoD8EgYh.mjs";
import { d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_B7Q_e2SV.mjs";
import { t as $$Layout } from "./Layout_DzANYLig.mjs";
import { t as $$CTA } from "./CTA_D7MJyTlM.mjs";
import { t as $$Rute$1 } from "./Rute_oilRzov5.mjs";
//#region src/pages/rute.astro
var rute_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Rute,
	file: () => $$file,
	url: () => $$url
});
var $$Rute = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Rute Lomba - Syiar QRIS Run 2026",
		"data-astro-cid-ipwmtkok": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="page-hero" data-astro-cid-ipwmtkok><div class="hero-bg-overlay" data-astro-cid-ipwmtkok></div><div class="container hero-content" data-astro-cid-ipwmtkok><h1 class="page-title" data-astro-cid-ipwmtkok>Rute Lomba</h1><p class="page-subtitle" data-astro-cid-ipwmtkok>Jelajahi jalur lari yang menyegarkan di Kediri Town Square. Nikmati pemandangan asri, lintasan yang aman, dan pengalaman lari yang tak terlupakan di setiap kilometernya.</p><div class="breadcrumb" data-astro-cid-ipwmtkok><a href="/" class="breadcrumb-link" data-astro-cid-ipwmtkok>Home</a><span class="breadcrumb-separator" data-astro-cid-ipwmtkok>›</span><span class="breadcrumb-current" data-astro-cid-ipwmtkok>Rute Lomba</span></div></div></section>${renderComponent($$result, "RuteComponent", $$Rute$1, { "data-astro-cid-ipwmtkok": true })}${renderComponent($$result, "CTA", $$CTA, { "data-astro-cid-ipwmtkok": true })}` })}`;
}, "D:/Kuliah/Fun Run/src/pages/rute.astro", void 0);
var $$file = "D:/Kuliah/Fun Run/src/pages/rute.astro";
var $$url = "/rute";
//#endregion
//#region \0virtual:astro:page:src/pages/rute@_@astro
var page = () => rute_exports;
//#endregion
export { page };
