# Project Brief: AIKO Command Center Dashboard

## 🎯 MVP Goal
Melakukan migrasi dari file HTML statis monolitik buatan Hermes Agent menjadi Dashboard Executive Intelligence yang dinamis, fleksibel, terhubung ke database, dan siap mendukung multi-bot.

---

## 🚀 Fitur & Prioritas

### 1. Dashboard Eksekutif (🔥 High Priority - Fokus MVP)
- **Katalog & Pemilih Berita/Edisi**:
  - Menyajikan berita & sinyal analitis terkini dari database NoSQL.
  - Dropdown pemilih riwayat edisi (arsip harian/mingguan).
- **Multi-Bot Origin Tagging**:
  - Identitas bot pembuat sinyal tertera jelas di setiap kartu (misal: Hermes News Agent, Transaction Bot).
- **Executive Decision Workspace**:
  - Focus view dengan drill-down analisa mendalam.
  - Komponen visualisasi interaktif bawaan (distribution bar, comparison before/after, key facts).
  - Decision Queue (daftar antrean langkah aksi C-Level).
  - Evidence Library (pustaka bukti berbutir dengan sitasi sumber berita).
- **Fitur C-Level Meeting**:
  - Fullscreen Presentation Mode (slide deck otomatis untuk rapat manajemen).
  - Dark Mode / Light Mode switcher.
- **Ingestion Pipeline**:
  - API endpoint `/api/ingest` agar Hermes Agent bisa langsung mem-push data berita baru.

---

### 2. Chatbot Q&A Data (⏳ Low Priority - Fase 2)
- **Context-Aware Executive Chat**:
  - AI Assistant di sisi kanan/drawer dashboard yang memahami data edisi yang sedang dibuka.
  - Menjawab pertanyaan kritis C-Level berbasis data (grounded Q&A).
  - Menyertakan sitasi referensi berita terkait.

---

### 3. Page Admin (⏳ Low Priority - Fase 3)
- **Environment & AI Model Settings**:
  - Input & kelola API Key LLM secara aman.
  - Selector model AI (OpenAI / Azure OpenAI / Anthropic / Gemini).
- **Bot Registry & Monitoring**:
  - Daftar bot aktif dan riwayat/log pengiriman data analisa (status sukses/gagal, timestamp).
- **Manual Import / Override Tool**:
  - Form upload file JSON atau paste HTML langsung dari browser sebagai fail-safe cadangan.
