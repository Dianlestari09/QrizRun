import { supabase } from './supabase';

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  imageUrl: string;
  status: 'UPCOMING' | 'FINISHED';
  description: string;
  price: number;
  slots: number;
  registered: number;
}

export interface Registration {
  id: number;
  eventId: number;
  name: string;
  email: string;
  phone: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED';
  amount: number;
  paymentMethod: string;
  checkedIn: boolean;
  paymentProof?: string;
  transactionId?: string;
  transactionTime?: string;
  createdAt: string;
}

// Helpers to map DB models to TS Interfaces
function mapEvent(dbEvent: any): Event {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    date: dbEvent.date,
    location: dbEvent.location,
    category: dbEvent.category,
    imageUrl: dbEvent.image_url,
    status: dbEvent.status,
    description: dbEvent.description,
    price: dbEvent.price,
    slots: dbEvent.slots,
    registered: dbEvent.registered,
  };
}

function mapRegistration(dbReg: any): Registration {
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
    paymentProof: dbReg.payment_proof || undefined,
    transactionId: dbReg.transaction_id || undefined,
    transactionTime: dbReg.transaction_time || undefined,
    createdAt: dbReg.created_at,
  };
}

/* --- Queries Event --- */

export async function getAllEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching all events:', error);
    return [];
  }
  return (data || []).map(mapEvent);
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'UPCOMING')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
  return (data || []).map(mapEvent);
}

export async function getFinishedEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'FINISHED')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching finished events:', error);
    return [];
  }
  return (data || []).map(mapEvent);
}

export async function getEventById(id: number): Promise<Event | undefined> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    return undefined;
  }
  return data ? mapEvent(data) : undefined;
}

export async function createEvent(event: Omit<Event, 'id'>): Promise<number | null> {
  const { data, error } = await supabase
    .from('events')
    .insert({
      title: event.title,
      date: event.date,
      location: event.location,
      category: event.category,
      image_url: event.imageUrl,
      status: event.status,
      description: event.description,
      price: event.price,
      slots: event.slots,
      registered: event.registered,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating event:', error);
    return null;
  }
  return data ? data.id : null;
}

export async function updateEvent(id: number, event: Partial<Omit<Event, 'id'>>): Promise<boolean> {
  const updateData: any = {};
  if (event.title !== undefined) updateData.title = event.title;
  if (event.date !== undefined) updateData.date = event.date;
  if (event.location !== undefined) updateData.location = event.location;
  if (event.category !== undefined) updateData.category = event.category;
  if (event.imageUrl !== undefined) updateData.image_url = event.imageUrl;
  if (event.status !== undefined) updateData.status = event.status;
  if (event.description !== undefined) updateData.description = event.description;
  if (event.price !== undefined) updateData.price = event.price;
  if (event.slots !== undefined) updateData.slots = event.slots;
  if (event.registered !== undefined) updateData.registered = event.registered;

  const { error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error(`Error updating event ${id}:`, error);
    return false;
  }
  return true;
}

export async function deleteEvent(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting event ${id}:`, error);
    return false;
  }
  return true;
}

/* --- Queries Registrasi --- */

export async function createRegistration(reg: Omit<Registration, 'id' | 'createdAt'>): Promise<number | null> {
  // 1. Cari registration yang kadaluarsa untuk Daur Ulang ID
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  // Cek yang statusnya sudah EXPIRED
  let { data: expiredRegs } = await supabase
    .from('registrations')
    .select('id')
    .eq('status', 'EXPIRED')
    .order('id', { ascending: true })
    .limit(1);

  // Jika tidak ada EXPIRED, cek yang PENDING tapi usianya lebih dari 1 jam
  if (!expiredRegs || expiredRegs.length === 0) {
    const { data: oldPendingRegs } = await supabase
      .from('registrations')
      .select('id')
      .eq('status', 'PENDING')
      .lt('created_at', oneHourAgo)
      .order('id', { ascending: true })
      .limit(1);
    expiredRegs = oldPendingRegs;
  }

  // Jika ditemukan pendaftar kadaluarsa, lakukan daur ulang (UPDATE)
  if (expiredRegs && expiredRegs.length > 0) {
    const recycledId = expiredRegs[0].id;
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        event_id: reg.eventId,
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        status: reg.status,
        amount: reg.amount,
        payment_method: reg.paymentMethod,
        payment_proof: null,
        transaction_id: null,
        transaction_time: null,
        checked_in: false,
        created_at: new Date().toISOString() // Reset waktu pendaftaran
      })
      .eq('id', recycledId);
      
    if (!updateError) {
      return recycledId; // Berhasil mendaur ulang ID
    }
    // Jika gagal update, abaikan dan lanjut ke INSERT biasa
  }

  // 2. Jika tidak ada ID untuk didaur ulang, buat ID baru (INSERT)
  const { data, error } = await supabase
    .from('registrations')
    .insert({
      event_id: reg.eventId,
      name: reg.name,
      email: reg.email,
      phone: reg.phone,
      status: reg.status,
      amount: reg.amount,
      payment_method: reg.paymentMethod,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating registration:', error);
    return null;
  }
  return data ? data.id : null;
}

export async function getRegistrationById(id: number): Promise<Registration | undefined> {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching registration ${id}:`, error);
    return undefined;
  }
  return data ? mapRegistration(data) : undefined;
}

export async function getAllRegistrations(): Promise<(Registration & { eventTitle: string })[]> {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      events (
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all registrations:', error);
    return [];
  }

  return (data || []).reduce((acc: any[], dbReg: any) => {
    const reg = mapRegistration(dbReg);
    
    // Dynamic Expiration Check
    const limitTime = new Date(reg.createdAt).getTime() + (1 * 60 * 60 * 1000); // 1 jam
    if (reg.status === 'PENDING' && Date.now() > limitTime) {
      reg.status = 'EXPIRED';
    }

    // Filter out EXPIRED so they appear "deleted" in the UI (waiting to be recycled)
    // AND filter out PENDING without payment proof to prevent admin human error
    const isPendingWithoutProof = reg.status === 'PENDING' && !reg.paymentProof;

    if (reg.status !== 'EXPIRED' && !isPendingWithoutProof) {
      acc.push({
        ...reg,
        eventTitle: dbReg.events?.title || 'Unknown Event',
      });
    }
    
    return acc;
  }, []);
}

export async function getRegistrationWithEventById(id: number): Promise<(Registration & { eventTitle: string; eventDate: string; eventLocation: string; eventImageUrl: string }) | undefined> {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      events (
        title,
        date,
        location,
        image_url
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching registration with event details ${id}:`, error);
    return undefined;
  }

  if (!data) return undefined;

  const reg = mapRegistration(data);

  // Check TTL Expiration (1 Jam)
  const limitTime = new Date(reg.createdAt).getTime() + (1 * 60 * 60 * 1000);
  if (reg.status === 'PENDING' && Date.now() > limitTime) {
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ status: 'EXPIRED' })
      .eq('id', id);
    
    if (!updateError) {
      reg.status = 'EXPIRED';
    } else {
      console.error(`Error marking registration ${id} as EXPIRED:`, updateError);
    }
  }

  return {
    ...reg,
    eventTitle: data.events?.title || 'Unknown Event',
    eventDate: data.events?.date || '',
    eventLocation: data.events?.location || '',
    eventImageUrl: data.events?.image_url || '',
  };
}

export async function updateRegistrationStatus(id: number, status: 'PENDING' | 'PAID' | 'EXPIRED'): Promise<boolean> {
  const currentReg = await getRegistrationById(id);
  if (!currentReg) return false;

  // Jika status berubah dari PENDING ke PAID
  if (currentReg.status === 'PENDING' && status === 'PAID') {
    // Jalankan update berurutan (di Supabase kita lakukan step by step karena tidak ada block transaction langsung lewat client)
    const { error: regError } = await supabase
      .from('registrations')
      .update({ status: 'PAID' })
      .eq('id', id);

    if (regError) {
      console.error(`Error updating status for registration ${id}:`, regError);
      return false;
    }

    // Ambil detail event saat ini untuk meningkatkan registered count
    const event = await getEventById(currentReg.eventId);
    if (event) {
      let participantCount = 1;
      try {
        const parsed = JSON.parse(currentReg.name);
        if (Array.isArray(parsed)) {
          participantCount = parsed.length;
        }
      } catch (e) {
        // Fallback to 1 if not JSON
      }

      const { error: eventError } = await supabase
        .from('events')
        .update({ registered: event.registered + participantCount })
        .eq('id', currentReg.eventId);

      if (eventError) {
        console.error(`Error incrementing registered count for event ${currentReg.eventId}:`, eventError);
      }
    }
    return true;
  }

  // Update status biasa (tanpa increment)
  const { error } = await supabase
    .from('registrations')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error(`Error updating status for registration ${id}:`, error);
    return false;
  }
  return true;
}

export async function updateRegistrationAmount(id: number, amount: number): Promise<boolean> {
  const { error } = await supabase
    .from('registrations')
    .update({ amount })
    .eq('id', id);

  if (error) {
    console.error(`Error updating amount for registration ${id}:`, error);
    return false;
  }
  return true;
}

export async function checkInRegistration(id: number): Promise<{ success: boolean; message: string; name?: string; eventTitle?: string }> {
  const reg = await getRegistrationWithEventById(id);
  if (!reg) {
    return { success: false, message: 'Tiket tidak ditemukan di database.' };
  }

  if (reg.status === 'PENDING') {
    return { 
      success: false, 
      message: 'Tiket belum lunas! Silakan selesaikan pembayaran terlebih dahulu.',
      name: reg.name,
      eventTitle: reg.eventTitle
    };
  }

  if (reg.checkedIn) {
    return { 
      success: false, 
      message: 'Tiket sudah pernah digunakan / check-in sebelumnya.',
      name: reg.name,
      eventTitle: reg.eventTitle
    };
  }

  // Update status checked_in = true
  const { error } = await supabase
    .from('registrations')
    .update({ checked_in: true })
    .eq('id', id);

  if (error) {
    console.error(`Error checking in registration ${id}:`, error);
    return { success: false, message: 'Terjadi kesalahan sistem saat memproses check-in.' };
  }

  return {
    success: true,
    message: 'Check-In Berhasil! Selamat mengikuti event.',
    name: reg.name,
    eventTitle: reg.eventTitle
  };
}

export async function uploadPaymentProof(id: number, base64Image: string, transactionId: string, transactionTime: string): Promise<{ success: boolean; message: string }> {
  // 1. Cek duplikasi gambar (jika gambar sama persis)
  const { data: imageDupes } = await supabase
    .from('registrations')
    .select('id')
    .eq('payment_proof', base64Image)
    .not('id', 'eq', id);

  // 2. Cek duplikasi Nomor Transaksi (mencegah gambar diedit nominalnya tapi nomor transaksinya tetap sama)
  const { data: trxDupes } = await supabase
    .from('registrations')
    .select('id')
    .eq('transaction_id', transactionId)
    .not('id', 'eq', id);

  if ((imageDupes && imageDupes.length > 0) || (trxDupes && trxDupes.length > 0)) {
    return {
      success: false,
      message: 'Bukti transfer atau Nomor Transaksi ini sudah pernah digunakan oleh pendaftar lain! Pendaftaran ditolak atas indikasi kecurangan (Duplikasi).'
    };
  }

  // Update bukti transfer dan nomor transaksi
  const { error } = await supabase
    .from('registrations')
    .update({ 
      payment_proof: base64Image,
      transaction_id: transactionId,
      transaction_time: transactionTime
    })
    .eq('id', id);

  if (error) {
    console.error(`Error uploading payment proof for registration ${id}:`, error);
    return { success: false, message: 'Gagal mengunggah bukti transfer ke database.' };
  }
  return { success: true, message: 'Bukti transfer berhasil dikirim!' };
}

export async function deleteRegistration(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('registrations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting registration ${id}:`, error);
    return false;
  }
  return true;
}
