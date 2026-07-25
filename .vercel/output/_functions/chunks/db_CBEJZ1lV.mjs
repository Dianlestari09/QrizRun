import { n as __exportAll } from "./compiler_ZoD8EgYh.mjs";
import { createClient } from "@supabase/supabase-js";
var supabase = createClient("https://tbhdksaokbfpvhhgwblr.supabase.co", "sb_publishable_neMC3ypLNyqPPjnoxtBb6Q_sxDvAlDh");
//#endregion
//#region src/lib/db.ts
var db_exports = /* @__PURE__ */ __exportAll({
	checkInRegistration: () => checkInRegistration,
	createEvent: () => createEvent,
	createRegistration: () => createRegistration,
	deleteEvent: () => deleteEvent,
	deleteRegistration: () => deleteRegistration,
	getAllEvents: () => getAllEvents,
	getAllRegistrations: () => getAllRegistrations,
	getEventById: () => getEventById,
	getFinishedEvents: () => getFinishedEvents,
	getRegistrationById: () => getRegistrationById,
	getRegistrationWithEventById: () => getRegistrationWithEventById,
	getUpcomingEvents: () => getUpcomingEvents,
	updateEvent: () => updateEvent,
	updateRegistrationAmount: () => updateRegistrationAmount,
	updateRegistrationStatus: () => updateRegistrationStatus,
	uploadPaymentProof: () => uploadPaymentProof
});
function mapEvent(dbEvent) {
	return {
		id: dbEvent.id,
		title: dbEvent.title ? dbEvent.title.replace(/Fun Run/gi, "Syiar QRIS Run") : "",
		date: dbEvent.date,
		location: "Kediri Town Square, Jawa Timur",
		category: dbEvent.category,
		imageUrl: dbEvent.image_url,
		status: dbEvent.status,
		description: dbEvent.description,
		price: dbEvent.price,
		slots: dbEvent.slots,
		registered: dbEvent.registered
	};
}
function mapRegistration(dbReg) {
	return {
		id: dbReg.id,
		eventId: dbReg.event_id,
		name: dbReg.name,
		email: dbReg.email,
		phone: dbReg.phone,
		status: dbReg.status,
		amount: dbReg.amount,
		paymentMethod: dbReg.payment_method,
		checkedIn: dbReg.checked_in || false,
		paymentProof: dbReg.payment_proof || void 0,
		transactionId: dbReg.transaction_id || void 0,
		transactionTime: dbReg.transaction_time || void 0,
		createdAt: dbReg.created_at
	};
}
async function getAllEvents() {
	const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true });
	if (error) {
		console.error("Error fetching all events:", error);
		return [];
	}
	return (data || []).map(mapEvent);
}
async function getUpcomingEvents() {
	const { data, error } = await supabase.from("events").select("*").eq("status", "UPCOMING").order("date", { ascending: true });
	if (error) {
		console.error("Error fetching upcoming events:", error);
		return [];
	}
	return (data || []).map(mapEvent);
}
async function getFinishedEvents() {
	const { data, error } = await supabase.from("events").select("*").eq("status", "FINISHED").order("date", { ascending: false });
	if (error) {
		console.error("Error fetching finished events:", error);
		return [];
	}
	return (data || []).map(mapEvent);
}
async function getEventById(id) {
	const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
	if (error) {
		console.error(`Error fetching event with ID ${id}:`, error);
		return;
	}
	return data ? mapEvent(data) : void 0;
}
async function createEvent(event) {
	const { data, error } = await supabase.from("events").insert({
		title: event.title,
		date: event.date,
		location: event.location,
		category: event.category,
		image_url: event.imageUrl,
		status: event.status,
		description: event.description,
		price: event.price,
		slots: event.slots,
		registered: event.registered
	}).select("id").single();
	if (error) {
		console.error("Error creating event:", error);
		return null;
	}
	return data ? data.id : null;
}
async function updateEvent(id, event) {
	const updateData = {};
	if (event.title !== void 0) updateData.title = event.title;
	if (event.date !== void 0) updateData.date = event.date;
	if (event.location !== void 0) updateData.location = event.location;
	if (event.category !== void 0) updateData.category = event.category;
	if (event.imageUrl !== void 0) updateData.image_url = event.imageUrl;
	if (event.status !== void 0) updateData.status = event.status;
	if (event.description !== void 0) updateData.description = event.description;
	if (event.price !== void 0) updateData.price = event.price;
	if (event.slots !== void 0) updateData.slots = event.slots;
	if (event.registered !== void 0) updateData.registered = event.registered;
	const { error } = await supabase.from("events").update(updateData).eq("id", id);
	if (error) {
		console.error(`Error updating event ${id}:`, error);
		return false;
	}
	return true;
}
async function deleteEvent(id) {
	const { error } = await supabase.from("events").delete().eq("id", id);
	if (error) {
		console.error(`Error deleting event ${id}:`, error);
		return false;
	}
	return true;
}
async function createRegistration(reg) {
	const { data, error } = await supabase.from("registrations").insert({
		event_id: reg.eventId,
		name: reg.name,
		email: reg.email,
		phone: reg.phone,
		status: reg.status,
		amount: reg.amount,
		payment_method: reg.paymentMethod
	}).select("id").single();
	if (error) {
		console.error("Error creating registration:", error);
		return null;
	}
	return data ? data.id : null;
}
async function getRegistrationById(id) {
	const { data, error } = await supabase.from("registrations").select("*").eq("id", id).single();
	if (error) {
		console.error(`Error fetching registration ${id}:`, error);
		return;
	}
	return data ? mapRegistration(data) : void 0;
}
async function getAllRegistrations() {
	const { data, error } = await supabase.from("registrations").select(`
      *,
      events (
        title
      )
    `).order("created_at", { ascending: false });
	if (error) {
		console.error("Error fetching all registrations:", error);
		return [];
	}
	return (data || []).reduce((acc, dbReg) => {
		const reg = mapRegistration(dbReg);
		const limitTime = new Date(reg.createdAt).getTime() + 1800 * 1e3;
		if (reg.status === "PENDING" && Date.now() > limitTime) reg.status = "EXPIRED";
		const isPendingWithoutProof = reg.status === "PENDING" && !reg.paymentProof;
		if (reg.status !== "EXPIRED" && !isPendingWithoutProof) acc.push({
			...reg,
			eventTitle: (dbReg.events?.title || "Unknown Event").replace(/Fun Run/gi, "Syiar QRIS Run")
		});
		return acc;
	}, []);
}
async function getRegistrationWithEventById(id) {
	const { data, error } = await supabase.from("registrations").select(`
      *,
      events (
        title,
        date,
        location,
        image_url
      )
    `).eq("id", id).single();
	if (error) {
		console.error(`Error fetching registration with event details ${id}:`, error);
		return;
	}
	if (!data) return void 0;
	const reg = mapRegistration(data);
	const limitTime = new Date(reg.createdAt).getTime() + 1800 * 1e3;
	if (reg.status === "PENDING" && Date.now() > limitTime) {
		const { error: updateError } = await supabase.from("registrations").update({ status: "EXPIRED" }).eq("id", id);
		if (!updateError) reg.status = "EXPIRED";
		else console.error(`Error marking registration ${id} as EXPIRED:`, updateError);
	}
	return {
		...reg,
		eventTitle: (data.events?.title || "Unknown Event").replace(/Fun Run/gi, "Syiar QRIS Run"),
		eventDate: data.events?.date || "",
		eventLocation: "Kediri Town Square, Jawa Timur",
		eventImageUrl: data.events?.image_url || ""
	};
}
async function updateRegistrationStatus(id, status) {
	const currentReg = await getRegistrationById(id);
	if (!currentReg) return false;
	if (currentReg.status === "PENDING" && status === "PAID") {
		const { error: regError } = await supabase.from("registrations").update({ status: "PAID" }).eq("id", id);
		if (regError) {
			console.error(`Error updating status for registration ${id}:`, regError);
			return false;
		}
		const event = await getEventById(currentReg.eventId);
		if (event) {
			let participantCount = 1;
			try {
				const parsed = JSON.parse(currentReg.name);
				if (Array.isArray(parsed)) participantCount = parsed.length;
			} catch (e) {}
			const { error: eventError } = await supabase.from("events").update({ registered: event.registered + participantCount }).eq("id", currentReg.eventId);
			if (eventError) console.error(`Error incrementing registered count for event ${currentReg.eventId}:`, eventError);
		}
		return true;
	}
	const { error } = await supabase.from("registrations").update({ status }).eq("id", id);
	if (error) {
		console.error(`Error updating status for registration ${id}:`, error);
		return false;
	}
	return true;
}
async function updateRegistrationAmount(id, amount) {
	const { error } = await supabase.from("registrations").update({ amount }).eq("id", id);
	if (error) {
		console.error(`Error updating amount for registration ${id}:`, error);
		return false;
	}
	return true;
}
async function checkInRegistration(id) {
	const reg = await getRegistrationWithEventById(id);
	if (!reg) return {
		success: false,
		message: "Tiket tidak ditemukan di database."
	};
	if (reg.status === "PENDING") return {
		success: false,
		message: "Tiket belum lunas! Silakan selesaikan pembayaran terlebih dahulu.",
		name: reg.name,
		eventTitle: reg.eventTitle
	};
	if (reg.checkedIn) return {
		success: false,
		message: "Tiket sudah pernah digunakan / check-in sebelumnya.",
		name: reg.name,
		eventTitle: reg.eventTitle
	};
	const { error } = await supabase.from("registrations").update({ checked_in: true }).eq("id", id);
	if (error) {
		console.error(`Error checking in registration ${id}:`, error);
		return {
			success: false,
			message: "Terjadi kesalahan sistem saat memproses check-in."
		};
	}
	return {
		success: true,
		message: "Check-In Berhasil! Selamat mengikuti event.",
		name: reg.name,
		eventTitle: reg.eventTitle
	};
}
async function uploadPaymentProof(id, base64Image, transactionTime) {
	const { data: imageDupes } = await supabase.from("registrations").select("id").eq("payment_proof", base64Image).not("id", "eq", id);
	if (imageDupes && imageDupes.length > 0) return {
		success: false,
		message: "Bukti transfer ini sudah pernah digunakan oleh pendaftar lain! Pendaftaran ditolak atas indikasi kecurangan (Duplikasi)."
	};
	const { error } = await supabase.from("registrations").update({
		payment_proof: base64Image,
		transaction_time: transactionTime
	}).eq("id", id);
	if (error) {
		console.error(`Error uploading payment proof for registration ${id}:`, error);
		return {
			success: false,
			message: "Gagal mengunggah bukti transfer ke database."
		};
	}
	return {
		success: true,
		message: "Bukti transfer berhasil dikirim!"
	};
}
async function deleteRegistration(id) {
	const { error } = await supabase.from("registrations").delete().eq("id", id);
	if (error) {
		console.error(`Error deleting registration ${id}:`, error);
		return false;
	}
	return true;
}
//#endregion
export { deleteEvent as a, getEventById as c, getUpcomingEvents as d, updateEvent as f, uploadPaymentProof as h, db_exports as i, getFinishedEvents as l, updateRegistrationStatus as m, createEvent as n, getAllEvents as o, updateRegistrationAmount as p, createRegistration as r, getAllRegistrations as s, checkInRegistration as t, getRegistrationWithEventById as u };
