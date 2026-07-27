-- ==========================================
-- SCRIPT SQL SCHEMA & QUERY UNTUK SUPABASE
-- ==========================================
-- Jalankan seluruh script ini di SQL Editor Supabase Anda
-- (Dashboard Supabase -> SQL Editor -> New Query -> Run)

-- 1. HAPUS TABEL JIKA SUDAH ADA (Untuk Reset/Clean Slate)
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;

-- 2. BUAT TABEL EVENTS
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('UPCOMING', 'FINISHED')),
  description TEXT NOT NULL,
  price INT DEFAULT 0,
  slots INT DEFAULT 100,
  registered INT DEFAULT 0
);

-- 3. BUAT TABEL REGISTRATIONS
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'PAID', 'EXPIRED')),
  amount INT NOT NULL,
  payment_method TEXT DEFAULT 'QRIS',
  checked_in BOOLEAN DEFAULT FALSE,
  payment_proof TEXT,
  transaction_id TEXT,
  transaction_time TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. MASUKKAN SEED DATA AWAL (EVENT KATEGORI RUNNING, CYCLING, WALK)
INSERT INTO events (title, date, location, category, image_url, status, description, price, slots, registered)
VALUES 
(
  'Papandayan Chicken Run 2026', 
  '2026-07-18', 
  'KAB. GARUT, JAWA BARAT', 
  'RUNNING', 
  'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=640', 
  'UPCOMING', 
  'Nikmati sensasi berlari di alam pegunungan Papandayan dengan tantangan Chicken Run yang menyenangkan untuk seluruh keluarga.', 
  150000, 
  300, 
  120
),
(
  'd’BestO Family Run 2026', 
  '2026-07-31', 
  'KOTA BANDUNG, JAWA BARAT', 
  'RUNNING', 
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=640', 
  'UPCOMING', 
  'Event lari santai untuk keluarga yang digagas oleh d’BestO dengan berbagai macam hadiah menarik.', 
  75000, 
  500, 
  250
),
(
  'Santika Infinite FunWalk', 
  '2026-08-08', 
  'KAB. GARUT, JAWA BARAT', 
  'WALK', 
  'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?q=80&w=640', 
  'UPCOMING', 
  'Jalan santai bersama Hotel Santika, menempuh rute asri di sekitar kota Garut dengan grand prize menarik di akhir acara.', 
  50000, 
  1000, 
  600
),
(
  'FUNRUNGOWES 2026', 
  '2026-11-07', 
  'KOTA BANDUNG, JAWA BARAT', 
  'CYCLING', 
  'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?q=80&w=640', 
  'UPCOMING', 
  'Gabungan antara event lari santai dan bersepeda gembira menyusuri sudut-sudut estetik kota Bandung.', 
  120000, 
  400, 
  180
);

-- 5. BUAT TABEL ADMINS DAN SEED DATA (3 Admin)
DROP TABLE IF EXISTS admins;
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

INSERT INTO admins (username, password)
VALUES 
('admin1', 'admin123'),
('admin2', 'admin123'),
('admin3', 'admin123');

-- ==========================================
-- QUERY CONTOH (Untuk Referensi Manual)
-- ==========================================

-- A. Ambil semua event mendatang (Upcoming)
-- SELECT * FROM events WHERE status = 'UPCOMING' ORDER BY date ASC;

-- B. Ambil detail registrasi beserta judul event terkait
-- SELECT r.*, e.title as event_title 
-- FROM registrations r
-- JOIN events e ON r.event_id = e.id
-- WHERE r.id = 1;
