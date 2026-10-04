import { BriefEdition, EditionSummary } from '../types/briefing';

export const mockEditions: BriefEdition[] = [
  {
    "id": "edition-2026-09-30",
    "schemaVersion": 1,
    "status": "approved",
    "meta": {
      "title": "Akselerasi pipeline fabrikator EPC, amankan reaktivasi akun Tri Sari, dan kawal rute ekspansi Paiton 2.600 MW.",
      "subtitle": "Edisi hari ini mengintegrasikan 2.265 MT potensi konversi proyek aktif, 3.500 MT pengecualian kontrak berjalan, serta sinyal energi 25 GW Data Center. Masing-masing menuntut keputusan komersial terarah sebelum permintaan menjadi pendapatan terrealisasi.",
      "eyebrow": "Daily Executive Intelligence",
      "editionDate": "30 September 2026",
      "dataAsOf": "29 SEP",
      "state": "Approved edition",
      "sourceLabel": "GYS Multi-Agent Intelligence",
      "sourceNote": "Divalidasi dari rute data C-Level GYS. Mensintesis analitik transaksi, tender proyek, dan intelijen berita pasar.",
      "contributingBots": [
        {
          "botId": "hermes-news-agent",
          "botName": "Hermes News Intelligence",
          "signalsCount": 1
        },
        {
          "botId": "tender-scout-bot",
          "botName": "Tender & Pipeline Scout",
          "signalsCount": 1
        },
        {
          "botId": "pln-grid-monitor",
          "botName": "Energy & Infrastructure Agent",
          "signalsCount": 1
        }
      ]
    },
    "featuredId": "commercial-contractor-shift",
    "signals": [
      {
        "id": "commercial-contractor-shift",
        "category": "Commercial",
        "tone": "blue",
        "status": "Opportunity",
        "source": "Sales order intake",
        "title": "Contract Channel Recomposition: Lonjakan Kontraktor Fabrikator",
        "summary": "Bauran kontrak kuartalan bergeser signifikan ke kanal Fabricator/Contractor: pangsa volume naik 2.0% -> 9.1% dengan tambahan volume 14.314 MT, dipimpin kontraktor EPC proyek strategis.",
        "metric": {
          "value": "Fabr/Cont",
          "unit": "+7.1pt",
          "label": "pangsa volume kontrak tertandatangan dibandingkan periode tahun lalu"
        },
        "evidence": [
          "Distributor tetap menjadi kanal terbesar di 162.783 MT, namun proporsinya turun dari 97.03% menjadi 88.92% seiring pertumbuhan volume.",
          "Tiga penggerak volume utama: PT. TOTAL SOLUSI KONSTRUKSI (+4.546 MT), PT ARTHA MAS GRAHA ANDALAN (+3.718 MT), dan PT. MEINDO ELANG INDAH (+1.169 MT).",
          "Lonjakan ini mencerminkan percepatan serapan baja struktural di sektor industrial plant dan gudang logistik."
        ],
        "managementContext": "Pergeseran ini mengubah alokasi tim sales lapangan. Pertumbuhan terfokus pada kontraktor proyek langsung, bukan lagi sekadar pemenuhan stok distributor.",
        "uncertainty": "Data transaksi belum membuktikan apakah akun-akun kontraktor ini merupakan rute pembelian berulang atau hanya alokasi proyek temporer.",
        "action": {
          "text": "Validasi apakah akun kontraktor fabrikator ini mewakili rute berulang; sesuaikan program account coverage tanpa mengurangi proteksi distributor inti.",
          "owner": "Head of Commercial & Sales",
          "checkpoint": "Review 2 Pekan Q4",
          "priority": "High"
        },
        "dataAsOf": "29 SEP",
        "sources": [
          {
            "label": "GYS Contract Register & Sales Book 2026",
            "url": "https://internal.gys.co.id/sales/contracts",
            "date": "2026-09-29"
          }
        ],
        "visual": {
          "type": "distribution",
          "title": "Channel Signed Volume Split",
          "unit": "MT",
          "total": 183000,
          "note": "Total dihitung dari seluruh volume kontrak aktif tahun 2026.",
          "items": [
            {
              "label": "Distributor",
              "value": 162783
            },
            {
              "label": "Fabricator / Contractor",
              "value": 16641
            },
            {
              "label": "Direct Project / Others",
              "value": 3576
            }
          ]
        },
        "bot": {
          "id": "hermes-news-agent",
          "name": "Hermes News Intelligence",
          "version": "2.1.0",
          "model": "gpt-4o",
          "confidenceScore": 0.95,
          "sourceCategory": "TRANSACTION_AND_NEWS"
        },
        "tags": [
          "Contractor",
          "EPC",
          "Channel-Shift"
        ]
      },
      {
        "id": "pipeline-flow-imbalance",
        "category": "Pipeline",
        "tone": "emerald",
        "status": "Attention",
        "source": "Tender Intake Tracker",
        "title": "Project Flow Imbalance: Laju Masuk Proyek vs Bidding",
        "summary": "Volume proyek baru yang masuk melampaui progresi ke tahap Bidding sebesar 2.265 MT minggu ini: 2.495 MT masuk ke pipeline aktif sementara hanya 230 MT yang maju ke penawaran resmi.",
        "metric": {
          "value": "2,265",
          "unit": "MT",
          "label": "kelebihan volume intake baru di atas progresi Bidding mingguan"
        },
        "evidence": [
          "Hanya 9% dari volume proyek aktif baru yang berhasil maju ke tahap Bidding dalam snapshot mingguan yang sama.",
          "Entri proyek terbesar: Sekolah Rakyat Sumatera Barat 5 Lokasi (750 MT), Sekolah Rakyat Bengkulu 4 Lokasi (600 MT), Sekolah Rakyat Sumsel (450 MT).",
          "Penyumbatan konversi berada pada tahap kalkulasi spesifikasi struktur dan kualifikasi kontraktor pelaksana."
        ],
        "managementContext": "Tumpukan proyek awal yang tidak segera dikualifikasi berisiko kedaluwarsa sebelum tim sales sempat mengajukan penawaran harga kompetitif.",
        "uncertainty": "Belum ada kepastian jadwal lelang resmi dari Kementerian PU untuk paket batch kedua di Sumatera Barat.",
        "action": {
          "text": "Jadikan proyek-proyek sekolah terbesar sebagai antrean konversi terkontrol: tetapkan milestone kualifikasi dan proposal teknis sebelum buku pipeline meluas.",
          "owner": "Project Sales Lead",
          "checkpoint": "Jumat, 16:00 WIB",
          "priority": "High"
        },
        "dataAsOf": "29 SEP",
        "sources": [
          {
            "label": "LPSE & Pipeline CRM Tracker",
            "url": "https://internal.gys.co.id/crm/tenders",
            "date": "2026-09-29"
          }
        ],
        "visual": {
          "type": "comparison",
          "title": "Throughput Aliran Proyek Mingguan",
          "unit": "MT",
          "beforeLabel": "Intake Baru",
          "afterLabel": "Progresi Bidding",
          "note": "Perbandingan laju throughput volume mingguan.",
          "items": [
            {
              "label": "Proyek Pendidikan (Sekolah)",
              "before": 1800,
              "after": 150
            },
            {
              "label": "Infrastruktur & Jembatan",
              "before": 695,
              "after": 80
            }
          ]
        },
        "bot": {
          "id": "tender-scout-bot",
          "name": "Tender & Pipeline Scout",
          "version": "1.4.2",
          "model": "claude-3-5-sonnet",
          "confidenceScore": 0.91,
          "sourceCategory": "TENDER_CRM"
        },
        "tags": [
          "Pipeline",
          "Sekolah-Rakyat",
          "Bottleneck"
        ],
        "extensions": {
          "Pagu Anggaran": "Rp 145 Miliar",
          "Tahap Seleksi": "Prakualifikasi Dokumen Teknis",
          "Wilayah Utama": "Sumatera Barat & Bengkulu",
          "Kebutuhan Baja": "H-Beam & WF Grade BJ-41"
        }
      },
      {
        "id": "market-paiton-route",
        "category": "Market",
        "tone": "amber",
        "status": "Opportunity",
        "source": "Fresh News Intelligence",
        "title": "Ekspansi PLTGU Paiton 2.600 MW & Sinyal Transmisi",
        "summary": "Paiton Energy mengumumkan kesiapan penambahan kapasitas PLTGU 2.600 MW yang membuka rute kebutuhan baja struktural besar untuk pembangkit dan gardu transmisi Jawa-Bali.",
        "metric": {
          "value": "2.600",
          "unit": "MW reported",
          "label": "Tier A · penemuan intelijen berita pasar segar Paiton Energy"
        },
        "evidence": [
          "Berita resmi: Paiton Energy Siap Tambah Kapasitas PLTGU 2.600 MW guna menyokong keandalan beban puncak sistem interkoneksi.",
          "Konteks eksternal ini membutuhkan validasi EPC utama, fabrikator boiler support, dan sub-kontraktor struktur baja domestik.",
          "Potensi serapan baja profil WF/H-Beam dan plate berkisar antara 4.000 hingga 7.500 MT untuk paket sipil dan boiler structure."
        ],
        "managementContext": "Ini merupakan sinyal pasar awal (early market demand). Siapa yang memetakan kontraktor EPC lebih dulu akan mengunci spesifikasi teknis baja domestik.",
        "uncertainty": "Data ini adalah intelijen berita pasar publik, belum merupakan penunjukan kontraktor resmi atau komitmen pemesanan baja struktural GYS.",
        "action": {
          "text": "Petakan rute EPC/kontraktor utama dan fabrikator baja domestik yang ditunjuk Paiton Energy; validasi jadwal paket struktur sebelum mengalokasikan tim lapangan.",
          "owner": "Head of Strategic Market Development",
          "checkpoint": "Rapat Dewan Direksi Q4",
          "priority": "Medium"
        },
        "dataAsOf": "29 SEP",
        "sources": [
          {
            "label": "Listrik Indonesia & Publikasi Industri Energi",
            "url": "https://listrikindonesia.com/news/paiton-2600mw",
            "date": "2026-09-28"
          }
        ],
        "visual": {
          "type": "facts",
          "title": "Highlight Prospek Pasar Tenaga Listrik",
          "note": "Estimasi konsumsi baja berdasarkan tipikal konstruksi PLTGU.",
          "items": [
            {
              "value": "2.600 MW",
              "label": "Kapasitas Pembangkit"
            },
            {
              "value": "~6.000 MT",
              "label": "Estimasi Kebutuhan Baja"
            },
            {
              "value": "2027",
              "label": "Target Operasional Komersial"
            }
          ]
        },
        "bot": {
          "id": "pln-grid-monitor",
          "name": "Energy & Infrastructure Agent",
          "version": "1.8.0",
          "model": "gemini-1.5-pro",
          "confidenceScore": 0.88,
          "sourceCategory": "EXTERNAL_NEWS"
        },
        "tags": [
          "Energy",
          "PLTGU",
          "Paiton",
          "Heavy-Structure"
        ]
      }
    ]
  },
  {
    "id": "edition-2026-09-29",
    "schemaVersion": 1,
    "status": "archived",
    "meta": {
      "title": "Convert the contractor-channel shift, accelerate project flow, and validate Paiton’s power route.",
      "subtitle": "This edition connects 2,265 MT of live project conversion potential, Fabr/Cont +7.1pt of customer contract activity, and a market context around 2.600 MW reported. Each requires a different commercial decision before demand can become realised revenue.",
      "eyebrow": "The management edition",
      "editionDate": "29 September 2026",
      "dataAsOf": "28 SEP",
      "state": "Approved edition",
      "sourceLabel": "GYS sales intelligence",
      "sourceNote": "Grounded in the approved C-Level source. No live connection; the design presents the locked detail pack only."
    },
    "featuredId": "commercial",
    "signals": [
      {
        "id": "commercial",
        "category": "Commercial",
        "tone": "blue",
        "status": "Opportunity",
        "source": "TRANSACTION",
        "title": "Contract Channel Recomposition",
        "summary": "Contract mix shifted toward Fabricator/Contractor: share rose 2.0% → 9.1% while signed volume added 14,314 MT.",
        "metric": {
          "value": "Fabr/Cont",
          "unit": "+7.1pt",
          "label": "share of signed contract volume, fair year-to-date comparison"
        },
        "evidence": [
          "Distributor remains the largest channel at 162,783 MT, but its share declined 97.03% → 88.92% while volume still grew.",
          "Named Fabr/Cont growth drivers: PT. TOTAL SOLUSI KONSTRUKSI (+4,546 MT), PT ARTHA MAS GRAHA ANDALAN (+3,718 MT), PT. MEINDO ELANG INDAH (+1,169 MT).",
          "Unclassified customer type is below 1% of 2026 contract volume; it does not change the directional finding."
        ],
        "managementContext": "The signal matters because it changes where the sales team should spend its next week — not more activity, but activity pointed at the exact place where revenue is won or lost.",
        "uncertainty": "What the data does not yet prove is the cause behind the pattern. The numbers show the shift; the reasons require direct customer conversation.",
        "action": {
          "text": "Confirm whether the named Fabricator/Contractor accounts represent repeatable routes; adjust contractor coverage and account programmes without reducing Distributor protection."
        },
        "dataAsOf": "28 SEP",
        "sources": [
          {
            "label": "Approved C-Level source / TRANSACTION",
            "url": "",
            "date": "28 SEP"
          }
        ],
        "visual": null,
        "bot": {
          "id": "hermes-news-agent",
          "name": "Hermes News Intelligence",
          "version": "2.0.0",
          "model": "gpt-4o",
          "confidenceScore": 0.92,
          "sourceCategory": "ANALYSIS_FEED"
        }
      },
      {
        "id": "pipeline",
        "category": "Pipeline",
        "tone": "emerald",
        "status": "Attention",
        "source": "CRM",
        "title": "Project Flow Imbalance",
        "summary": "Weekly project intake exceeded Bidding progression by 2,265 MT: 2,495 MT entered active pipeline while only 230 MT progressed to Bidding.",
        "metric": {
          "value": "2,265",
          "unit": "MT",
          "label": "weekly intake above Bidding progression"
        },
        "evidence": [
          "Only 9% of weekly new active volume progressed to Bidding in the same weekly snapshot; this is a throughput comparison, not a cohort conversion rate.",
          "Largest new entries: Sekolah Rakyat Sumatera Barat (5 Locations) (Phase III) (750 MT), Sekolah Rakyat Bengkulu (4 Locations) (Phase III) (600 MT), Sekolah Rakyat Sumatera Selatan (3 Locations) (Phase III) (450 MT).",
          "6 projects / 475 MT were recorded as Won this week."
        ],
        "managementContext": "The signal matters because it changes where the sales team should spend its next week — not more activity, but activity pointed at the exact place where revenue is won or lost.",
        "uncertainty": "What the data does not yet prove is the cause behind the pattern. The numbers show the shift; the reasons require direct customer conversation.",
        "action": {
          "text": "Use the largest new projects as a controlled conversion queue: set qualification, proposal, and Bidding milestones before the early-stage book expands further."
        },
        "dataAsOf": "28 SEP",
        "sources": [
          {
            "label": "Approved C-Level source / CRM",
            "url": "",
            "date": "28 SEP"
          }
        ],
        "visual": null,
        "bot": {
          "id": "hermes-news-agent",
          "name": "Hermes News Intelligence",
          "version": "2.0.0",
          "model": "gpt-4o",
          "confidenceScore": 0.92,
          "sourceCategory": "ANALYSIS_FEED"
        }
      },
      {
        "id": "market",
        "category": "Market",
        "tone": "amber",
        "status": "Opportunity",
        "source": "MARKET",
        "title": "Fresh Power / Grid / Transmission — Paiton",
        "summary": "A fresh power / grid / transmission development involving Paiton creates a named domestic route to validate with developers, contractors, and fabricators.",
        "metric": {
          "value": "2.600",
          "unit": "MW reported",
          "label": "Tier A · supplemental fresh-news discovery"
        },
        "evidence": [
          "Original headline: Paiton Energy Siap Tambah Kapasitas PLTGU 2.600 MW - Listrik Indonesia",
          "This is external market context, not a confirmed GYS order, contractor appointment, or structural-steel award."
        ],
        "managementContext": "The signal matters because it changes where the sales team should spend its next week — not more activity, but activity pointed at the exact place where revenue is won or lost.",
        "uncertainty": "What the data does not yet prove is the cause behind the pattern. The numbers show the shift; the reasons require direct customer conversation.",
        "action": {
          "text": "Identify the developer, EPC/contractor, and domestic fabricator route; validate project timing and any steel package directly before allocating coverage."
        },
        "dataAsOf": "28 SEP",
        "sources": [
          {
            "label": "Approved C-Level source / MARKET",
            "url": "",
            "date": "28 SEP"
          }
        ],
        "visual": null,
        "bot": {
          "id": "hermes-news-agent",
          "name": "Hermes News Intelligence",
          "version": "2.0.0",
          "model": "gpt-4o",
          "confidenceScore": 0.92,
          "sourceCategory": "ANALYSIS_FEED"
        }
      }
    ]
  },
  {
    "id": "edition-2026-09-28",
    "schemaVersion": 1,
    "status": "archived",
    "meta": {
      "title": "Convert the open pipeline, protect customer momentum, and validate the next demand signal.",
      "subtitle": "This edition connects 2,800 MT of live project conversion potential, 3,500 MT of customer contract activity, and a market context around 2,600 MW reported capacity. Each requires a different commercial decision before demand can become realised revenue.",
      "eyebrow": "The management edition",
      "editionDate": "28 September 2026",
      "dataAsOf": "26 SEP",
      "state": "Approved edition",
      "sourceLabel": "GYS sales intelligence",
      "sourceNote": "Grounded in the approved C-Level source. No live connection; the design presents the locked detail pack only."
    },
    "featuredId": "commercial",
    "signals": [
      {
        "id": "commercial",
        "category": "Commercial",
        "tone": "blue",
        "status": "Attention",
        "source": "TRANSACTION",
        "title": "Material Contract Execution Exceptions",
        "summary": "5 material 2026 contracts totaling 3,500 MT have no Sales Order after 30+ days, led by PT. KARYAWAJA EKAMULIA.",
        "metric": {
          "value": "3,500",
          "unit": "MT",
          "label": "2026 signed contracts with no Sales Order after 30+ days"
        },
        "evidence": [
          "Oldest listed exception: PT. KARYAWAJA EKAMULIA contract dated 2026-04-02 (179 days).",
          "These are signed contracts without a Sales Order; the data does not identify the commercial cause."
        ],
        "managementContext": "The signal matters because it changes where the sales team should spend its next week — not more activity, but activity pointed at the exact place where revenue is won or lost.",
        "uncertainty": "What the data does not yet prove is the cause behind the pattern. The numbers show the shift; the reasons require direct customer conversation.",
        "action": {
          "text": "Confirm execution status for each named contract: customer release, pricing, credit, specification, or scheduling; close only after the blocker is evidenced."
        },
        "dataAsOf": "26 SEP",
        "sources": [
          {
            "label": "Approved C-Level source / TRANSACTION",
            "url": "",
            "date": "26 SEP"
          }
        ],
        "visual": null,
        "bot": {
          "id": "hermes-news-agent",
          "name": "Hermes News Intelligence",
          "version": "2.0.0",
          "model": "gpt-4o",
          "confidenceScore": 0.92,
          "sourceCategory": "ANALYSIS_FEED"
        }
      },
      {
        "id": "pipeline",
        "category": "Pipeline",
        "tone": "emerald",
        "status": "Opportunity",
        "source": "CRM",
        "title": "Material Bidding Decision Window",
        "summary": "3 material Bidding projects totaling 2,800 MT were updated in the last seven days, led by Simone Batang Factory.",
        "metric": {
          "value": "2,800",
          "unit": "MT",
          "label": "recently updated material Bidding projects"
        },
        "evidence": [
          "Largest project: Simone Batang Factory (1,500 MT), contractor route: PT Han Jin Konstruksi Indonesia, Central Java.",
          "This identifies current Bidding decision windows; it does not prove a stage movement, award, or GYS order."
        ],
        "managementContext": "The signal matters because it changes where the sales team should spend its next week — not more activity, but activity pointed at the exact place where revenue is won or lost.",
        "uncertainty": "What the data does not yet prove is the cause behind the pattern. The numbers show the shift; the reasons require direct customer conversation.",
        "action": {
          "text": "Confirm decision date, quotation status, and contractor route for each named Bidding project; define the next commercial milestone before the current update window expires."
        },
        "dataAsOf": "26 SEP",
        "sources": [
          {
            "label": "Approved C-Level source / CRM",
            "url": "",
            "date": "26 SEP"
          }
        ],
        "visual": null,
        "bot": {
          "id": "hermes-news-agent",
          "name": "Hermes News Intelligence",
          "version": "2.0.0",
          "model": "gpt-4o",
          "confidenceScore": 0.92,
          "sourceCategory": "ANALYSIS_FEED"
        }
      },
      {
        "id": "market",
        "category": "Market",
        "tone": "amber",
        "status": "Opportunity",
        "source": "MARKET",
        "title": "Fresh Power Expansion — Paiton",
        "summary": "Paiton Energy is reported ready to add 2,600 MW of PLTGU capacity, creating a named power-infrastructure route to validate with EPC and domestic fabricators.",
        "metric": {
          "value": "2,600",
          "unit": "MW reported capacity",
          "label": "Paiton Energy PLTGU expansion"
        },
        "evidence": [
          "The reported capacity expansion is a market route to investigate, not a confirmed construction package.",
          "This is external context, not a confirmed GYS order, EPC appointment, or structural-steel award."
        ],
        "managementContext": "The signal matters because it changes where the sales team should spend its next week — not more activity, but activity pointed at the exact place where revenue is won or lost.",
        "uncertainty": "What the data does not yet prove is the cause behind the pattern. The numbers show the shift; the reasons require direct customer conversation.",
        "action": {
          "text": "Identify Paiton Energy’s EPC, contractor, and domestic fabricator route; validate timing and any structural-steel package directly before allocating coverage."
        },
        "dataAsOf": "26 SEP",
        "sources": [
          {
            "label": "Approved C-Level source / MARKET",
            "url": "",
            "date": "26 SEP"
          }
        ],
        "visual": null,
        "bot": {
          "id": "hermes-news-agent",
          "name": "Hermes News Intelligence",
          "version": "2.0.0",
          "model": "gpt-4o",
          "confidenceScore": 0.92,
          "sourceCategory": "ANALYSIS_FEED"
        }
      }
    ]
  },
  {
    "id": "edition-2026-09-24",
    "schemaVersion": 1,
    "status": "archived",
    "meta": {
      "title": "Convert the open pipeline, protect customer momentum, and validate the next demand signal.",
      "subtitle": "This edition connects 23 projects of live project conversion potential, 1,000 MT of customer contract activity, and a market context around 25 GW by 2034. Each requires a different commercial decision before demand can become realised revenue.",
      "eyebrow": "The management edition",
      "editionDate": "24 September 2026",
      "dataAsOf": "23 SEP",
      "state": "Approved edition",
      "sourceLabel": "GYS sales intelligence",
      "sourceNote": "Grounded in the approved C-Level source. No live connection; the design presents the locked detail pack only."
    },
    "featuredId": "pipeline",
    "signals": [
      {
        "id": "pipeline",
        "category": "Pipeline",
        "tone": "emerald",
        "status": "Opportunity",
        "source": "CRM",
        "title": "New Project Intake",
        "summary": "23 new projects entered the pipeline this week (17,530 MT) — largest is Sekolah Rakyat Papua.",
        "metric": {
          "value": "23",
          "unit": "projects",
          "label": "17,530 MT this week"
        },
        "evidence": [
          "44 projects (21,125 MT) entered in the last 30 days, so the week is in line with the monthly trend.",
          "New inflows are the only way the funnel replaces what closes or stalls — tracking them weekly shows whether sourcing is healthy.",
          "These are early-stage, unconfirmed pipeline entries (aspirational demand, not confirmed orders) — their value depends on how quickly each is qualified and visited."
        ],
        "managementContext": "The signal matters because it changes where the sales team should spend its next week — not more activity, but activity pointed at the exact place where revenue is won or lost.",
        "uncertainty": "What the data does not yet prove is the cause behind the pattern. The numbers show the shift; the reasons require direct customer conversation.",
        "action": {
          "text": "Assign owners and qualify the largest new projects within 7 days — a fast first visit is the strongest predictor of conversion."
        },
        "dataAsOf": "23 SEP",
        "sources": [
          {
            "label": "Approved C-Level source / CRM",
            "url": "",
            "date": "23 SEP"
          }
        ],
        "visual": null,
        "bot": {
          "id": "hermes-news-agent",
          "name": "Hermes News Intelligence",
          "version": "2.0.0",
          "model": "gpt-4o",
          "confidenceScore": 0.92,
          "sourceCategory": "ANALYSIS_FEED"
        }
      },
      {
        "id": "commercial",
        "category": "Commercial",
        "tone": "blue",
        "status": "Opportunity",
        "source": "TRANSACTION",
        "title": "Tri Sari Kumpul Reactivation",
        "summary": "CV. Tri Sari Kumpul returned after a 127-day contract gap with a 1,000 MT signed contract, lifting 2026 signed contract volume to 5,500 MT (+67% YoY).",
        "metric": {
          "value": "1,000",
          "unit": "MT",
          "label": "return after 127-day contract gap"
        },
        "evidence": [
          "Contract → Sales Order → Delivery: 544 MT has moved into 4 confirmed sales orders; 70 MT has been delivered so far.",
          "Signed-contract annual volume: 3,300 MT in 2025 → 5,500 MT in 2026 (+67%)."
        ],
        "managementContext": "The signal matters because it changes where the sales team should spend its next week — not more activity, but activity pointed at the exact place where revenue is won or lost.",
        "uncertainty": "What the data does not yet prove is the cause behind the pattern. The numbers show the shift; the reasons require direct customer conversation.",
        "action": {
          "text": "Confirm whether the 1,000 MT return is the start of a renewed buying programme, then secure the balance of the contract into sales orders and delivery scheduling."
        },
        "dataAsOf": "23 SEP",
        "sources": [
          {
            "label": "Approved C-Level source / TRANSACTION",
            "url": "",
            "date": "23 SEP"
          }
        ],
        "visual": null,
        "bot": {
          "id": "hermes-news-agent",
          "name": "Hermes News Intelligence",
          "version": "2.0.0",
          "model": "gpt-4o",
          "confidenceScore": 0.92,
          "sourceCategory": "ANALYSIS_FEED"
        }
      },
      {
        "id": "market",
        "category": "Market",
        "tone": "amber",
        "status": "Opportunity",
        "source": "MARKET",
        "title": "Data Center Power Requirement — Pln",
        "summary": "PLN faces Data Center electricity demand of up to 25 GW by 2034, making power availability a critical condition for the next build-out wave.",
        "metric": {
          "value": "25",
          "unit": "GW by 2034",
          "label": "PLN Data Center electricity outlook"
        },
        "evidence": [
          "Power availability is an enabling condition for Data Center construction; this is external context, not a confirmed GYS order.",
          "The article passed publication-time and relevance checks."
        ],
        "managementContext": "The signal matters because it changes where the sales team should spend its next week — not more activity, but activity pointed at the exact place where revenue is won or lost.",
        "uncertainty": "What the data does not yet prove is the cause behind the pattern. The numbers show the shift; the reasons require direct customer conversation.",
        "action": {
          "text": "Map the PLN capacity outlook to active Data Center projects and identify the developers, contractors, and fabricators positioned to build when power is secured."
        },
        "dataAsOf": "23 SEP",
        "sources": [
          {
            "label": "Approved C-Level source / MARKET",
            "url": "",
            "date": "23 SEP"
          }
        ],
        "visual": null,
        "bot": {
          "id": "hermes-news-agent",
          "name": "Hermes News Intelligence",
          "version": "2.0.0",
          "model": "gpt-4o",
          "confidenceScore": 0.92,
          "sourceCategory": "ANALYSIS_FEED"
        }
      }
    ]
  }
];

export function getAllEditions(): BriefEdition[] {
  return mockEditions;
}

export function getLatestEdition(): BriefEdition {
  return mockEditions[0];
}

export function getEditionById(id: string): BriefEdition | undefined {
  return mockEditions.find(e => e.id === id);
}

export function getEditionsSummaries(): EditionSummary[] {
  return mockEditions.map(e => ({
    id: e.id,
    title: e.meta.title,
    editionDate: e.meta.editionDate,
    dataAsOf: e.meta.dataAsOf,
    signalsCount: e.signals.length,
    status: e.status
  }));
}

export function saveEdition(newEdition: BriefEdition): BriefEdition {
  const existingIdx = mockEditions.findIndex(e => e.id === newEdition.id);
  if (existingIdx >= 0) {
    mockEditions[existingIdx] = newEdition;
  } else {
    mockEditions.unshift(newEdition);
  }
  return newEdition;
}
