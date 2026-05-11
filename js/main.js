// ===== NAVIGASI HALAMAN =====
const pages  = ['dash', 'tugas', 'eval'];
const titles = { dash: 'Dashboard', tugas: 'Manajemen Tugas', eval: 'Evaluasi Capaian Program' };

function goPage(p) {
  pages.forEach(x => {
    document.getElementById('page-' + x).classList.toggle('active', x === p);
    const n = document.getElementById('nav-' + x);
    if (x === p) {
      n.classList.add('active');
      n.style.background = 'linear-gradient(135deg,#16a34a,#0d9488)';
      n.style.color = '#fff';
    } else {
      n.classList.remove('active');
      n.style.background = '';
      n.style.color = '';
    }
  });
  document.getElementById('page-title').textContent = titles[p];
  if (p === 'eval') {
    // Render grafik default (KIA) saat masuk ke page evaluasi
    renderChart(progData.kia.months, progData.kia.color);
  }
}

// ===== FILTER CHIPS =====
document.querySelectorAll('.filter-chip').forEach(btn => {
  btn.addEventListener('click', function () {
    this.closest('.filter-bar').querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ===== DATA PROGRAM EVALUASI (STATE UTAMA) =====
// Menggunakan 'let' agar objek data ini bisa di-update (mutable) secara dinamis
let progData = {
  kia: {
    title: 'KIA (Kesehatan Ibu & Anak)',
    color: '#16a34a', dot: '#16a34a',
    months: [65, 70, 75, 82, 92],
    target: 360, actual: 331, pct: 92, status: 'On Track',
    rows: [
      ['Kunjungan K1',       80, 78, 97, 'ok'],
      ['Kunjungan K4',       75, 70, 93, 'ok'],
      ['Persalinan Nakes',   70, 65, 93, 'ok'],
      ['Kunjungan Neonatal', 65, 62, 95, 'ok'],
      ['KB Aktif',           70, 56, 80, 'warn'],
    ]
  },
  imun: {
    title: 'Imunisasi Dasar',
    color: '#2563eb', dot: '#2563eb',
    months: [55, 62, 70, 78, 85],
    target: 420, actual: 357, pct: 85, status: 'On Track',
    rows: [
      ['DPT-HB-Hib',     90, 80, 89, 'ok'],
      ['Polio Oral',      85, 75, 88, 'ok'],
      ['Campak-Rubela',   80, 62, 78, 'warn'],
      ['BCG',             85, 80, 94, 'ok'],
      ['IPV',             80, 60, 75, 'warn'],
    ]
  },
  gizi: {
    title: 'Gizi Masyarakat',
    color: '#ea580c', dot: '#ea580c',
    months: [40, 52, 58, 65, 71],
    target: 280, actual: 199, pct: 71, status: 'Butuh Perhatian',
    rows: [
      ['Balita ditimbang',       80,  58, 73, 'warn'],
      ['Vit A Balita',           90,  68, 76, 'warn'],
      ['Ibu Hamil Fe',           75,  55, 73, 'warn'],
      ['Stunting',               40,  28, 70, 'warn'],
      ['Gizi Buruk Ditangani',  100,  90, 90, 'ok'],
    ]
  },
  ptm: {
    title: 'PTM (Penyakit Tidak Menular)',
    color: '#7c3aed', dot: '#7c3aed',
    months: [30, 40, 48, 56, 64],
    target: 500, actual: 320, pct: 64, status: 'Butuh Perhatian',
    rows: [
      ['Skrining Hipertensi', 150, 110, 73, 'warn'],
      ['Skrining DM',         120,  75, 63, 'warn'],
      ['Skrining Obesitas',   100,  70, 70, 'warn'],
      ['Konseling PTM',        80,  45, 56, 'bad'],
      ['Terkontrol',           50,  20, 40, 'bad'],
    ]
  },
  tb: {
    title: 'TB & Paru',
    color: '#dc2626', dot: '#dc2626',
    months: [20, 28, 35, 42, 48],
    target: 150, actual: 72, pct: 48, status: 'Kritis',
    rows: [
      ['Suspek TB diperiksa', 60, 30, 50, 'bad'],
      ['Pasien TB diobati',   50, 25, 50, 'bad'],
      ['Angka Kesembuhan',    80, 72, 90, 'ok'],
      ['Kontak Serumah',     100, 45, 45, 'bad'],
      ['PMO Tersedia',        75, 50, 67, 'warn'],
    ]
  },
  kesling: {
    title: 'Kesehatan Lingkungan',
    color: '#0d9488', dot: '#0d9488',
    months: [60, 68, 75, 82, 88],
    target: 200, actual: 176, pct: 88, status: 'On Track',
    rows: [
      ['Rumah Sehat',             70,  65, 93, 'ok'],
      ['Jamban Sehat',            80,  72, 90, 'ok'],
      ['SPAL Sehat',              50,  39, 78, 'warn'],
      ['TTU Memenuhi Syarat',    100,  80, 80, 'ok'],
      ['Depot Air Minum OK',     100, 100,100, 'ok'],
    ]
  },
};

// ===== PILIH PROGRAM EVALUASI =====
function selectProg(el) {
  document.querySelectorAll('.prog-card').forEach(c => {
    c.classList.remove('selected');
    c.style.borderColor = 'transparent';
  });
  el.classList.add('selected');
  el.style.borderColor = 'currentColor';

  const key = el.id.replace('pc-', '');
  const d = progData[key];

  if (!d) return;

  document.getElementById('detail-title').textContent = 'Detail Capaian — ' + d.title;
  document.getElementById('chart-title').textContent  = 'Tren Capaian Jan–Mei 2025';
  document.getElementById('detail-dot').style.background = d.dot;
  document.getElementById('chart-dot').style.background  = d.dot;
  document.getElementById('sum-target').textContent = d.target;
  document.getElementById('sum-actual').textContent = d.actual;
  document.getElementById('sum-pct').textContent    = d.pct + '%';

  const sc = document.getElementById('sum-status');
  sc.textContent = d.status;
  sc.style.color = d.pct >= 80 ? '#16a34a' : d.pct >= 60 ? '#d97706' : '#dc2626';

  const tbody = document.getElementById('detail-tbody');
  tbody.innerHTML = d.rows.map(r => {
    let pill;
    if (r[4] === 'ok') {
      pill = `<span class="status-pill" style="background:var(--green-l);color:var(--green-d)"><i class="ti ti-check" style="font-size:10px"></i> Tercapai</span>`;
    } else if (r[4] === 'warn') {
      pill = `<span class="status-pill" style="background:var(--amber-l);color:var(--amber-d)"><i class="ti ti-alert-triangle" style="font-size:10px"></i> Menuju</span>`;
    } else {
      pill = `<span class="status-pill" style="background:var(--red-l);color:var(--red-d)"><i class="ti ti-x" style="font-size:10px"></i> Perlu Aksi</span>`;
    }
    return `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}%</td><td>${pill}</td></tr>`;
  }).join('');

  renderChart(d.months, d.color);
}

// ===== RENDER BAR CHART =====
function renderChart(vals, color) {
  const labels    = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'];
  const max       = Math.max(...vals);
  const container = document.getElementById('mini-chart');
  if (!container) return;
  
  container.innerHTML = vals.map((v, i) => `
    <div class="bar-wrap">
      <div class="bar-val">${v}%</div>
      <div class="bar" style="height:${Math.round((v / max) * 60)}px;background:${color};opacity:${0.4 + 0.6 * (v / max)}"></div>
      <div class="bar-label">${labels[i]}</div>
    </div>`).join('');
}

// ===== LOGIKA MODAL INPUT TUGAS & LAPORAN =====

// 1. Membuka Modal
function openTaskModal() {
  const modal = document.getElementById('task-modal');
  if (modal) modal.style.display = 'flex';
}

// 2. Menutup Modal
function closeTaskModal() {
  const modal = document.getElementById('task-modal');
  if (modal) modal.style.display = 'none';
  const form = document.getElementById('task-form');
  if (form) form.reset();
}

// 3. Menyimpan & Menyingkronkan Data Laporan Baru ke Seluruh Halaman
function saveTask(event) {
  event.preventDefault();

  // Ambil value input dari form
  const taskName = document.getElementById('task-name').value;
  const programKey = document.getElementById('task-program').value;
  const targetVal = parseInt(document.getElementById('report-target').value) || 0;
  const actualVal = parseInt(document.getElementById('report-actual').value) || 0;
  const taskPic = document.getElementById('task-pic').value;

  // Hitung persentase capaian tugas baru
  const pct = targetVal > 0 ? Math.round((actualVal / targetVal) * 100) : 0;
  const initials = taskPic.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

  // ==========================================
  // SINKRONISASI 1: TAMBAH KARTU KE KANBAN "SELESAI"
  // ==========================================
  const targetColumn = document.querySelector('#page-tugas .kanban-col:last-child'); // Kolom 'Selesai'
  if (targetColumn) {
    const newTaskHTML = `
      <div class="task-card">
        <div class="prio-bar"><div style="width:100%;height:3px;background:var(--green);border-radius:3px"></div></div>
        <div class="task-card-title">${taskName}</div>
        <div style="font-size:11px; color:var(--text2); margin: 4px 0 8px;">
          Target: <strong>${targetVal}</strong> | Realisasi: <strong>${actualVal}</strong> (<strong>${pct}%</strong>)
        </div>
        <div class="task-card-meta">
          <span class="tag" style="background:var(--green-l);color:var(--green-d)">Selesai</span>
          <div class="assignee-list">
            <div class="av" style="background:var(--teal-l);color:var(--teal-d)" title="${taskPic}">${initials}</div>
          </div>
        </div>
        <div class="task-card-due"><i class="ti ti-check" style="font-size:12px;color:var(--green)"></i><span style="color:var(--green)">Selesai — Baru saja</span></div>
      </div>
    `;

    // Sisipkan tepat di atas tombol "Tambah tugas" pada kolom selesai
    const addBtn = targetColumn.querySelector('.add-task-btn');
    if (addBtn) {
      addBtn.insertAdjacentHTML('beforebegin', newTaskHTML);
    } else {
      targetColumn.insertAdjacentHTML('beforeend', newTaskHTML);
    }

    // Update Counter angka kolom selesai
    const countSpan = targetColumn.querySelector('.col-count');
    if (countSpan) {
      countSpan.textContent = (parseInt(countSpan.textContent) || 0) + 1;
    }
  }

  // ==========================================
  // SINKRONISASI 2: KE PAGE EVALUASI CAPAIAN
  // ==========================================
  if (progData[programKey]) {
    // Tambahkan data ke akumulasi program evaluasi terkait
    progData[programKey].target += targetVal;
    progData[programKey].actual += actualVal;
    
    const newProgPct = Math.round((progData[programKey].actual / progData[programKey].target) * 100);
    progData[programKey].pct = newProgPct;

    // Tentukan status barunya
    progData[programKey].status = newProgPct >= 80 ? 'On Track' : (newProgPct >= 60 ? 'Butuh Perhatian' : 'Kritis');

    // Tambah baris baru di tabel indikator detail
    const statusPillType = pct >= 80 ? 'ok' : (pct >= 50 ? 'warn' : 'bad');
    progData[programKey].rows.push([taskName, targetVal, actualVal, pct, statusPillType]);

    // Update bulan terakhir (Mei) di tren grafik agar meningkat secara dinamis
    progData[programKey].months[4] = Math.min(100, Math.round(progData[programKey].months[4] + (pct * 0.05)));

    // Re-render kartu program secara dinamis di HTML agar persentasenya berubah
    const progCard = document.getElementById(`pc-${programKey}`);
    if (progCard) {
      progCard.querySelector('.prog-card-pct').textContent = `${newProgPct}%`;
      progCard.querySelector('.prog-card-mini').textContent = `Target: ${progData[programKey].target} · Tercapai: ${progData[programKey].actual}`;
      
      // Update lebar progress bar di dalam kartu program
      const fillBar = progCard.querySelector('.prog-card-pct + div div');
      if (fillBar) fillBar.style.width = `${newProgPct}%`;
    }
    
    // Jika kartu program yang sedang aktif/dipilih adalah program yang dimodifikasi, re-render tabel & grafik detail secara langsung
    const activeCard = document.querySelector('.prog-card.selected');
    if (activeCard && activeCard.id === `pc-${programKey}`) {
      selectProg(activeCard);
    }
  }

  // ==========================================
  // SINKRONISASI 3: KE PAGE DASHBOARD
  // ==========================================
  // A. Tambahkan log aktivitas terbaru tim secara real-time
  const activityContainer = document.querySelector('#page-dash .card:last-child div[style*="grid-template-columns"]');
  if (activityContainer) {
    const newActivityHTML = `
      <div class="activity-item">
        <div class="act-dot" style="background:var(--green-l);color:var(--green)"><i class="ti ti-file-analytics"></i></div>
        <div>
          <div class="act-text"><strong>${taskPic}</strong> menginput laporan: "${taskName}" (${pct}%)</div>
          <div class="act-time">Baru saja</div>
        </div>
      </div>
    `;
    activityContainer.insertAdjacentHTML('afterbegin', newActivityHTML);
  }

  // B. Tambah angka statistik "Total Tugas Aktif"
  const totalTaskVal = document.querySelector('.stat-card:first-child .stat-val');
  if (totalTaskVal) {
    totalTaskVal.textContent = (parseInt(totalTaskVal.textContent) || 0) + 1;
  }

  // C. Update "Rata-rata Capaian" seluruh program di dashboard
  let totalPctSum = 0;
  let countProgs = 0;
  for (let key in progData) {
    totalPctSum += progData[key].pct;
    countProgs++;
  }
  const avgCapaianVal = document.querySelectorAll('.stat-card')[2]?.querySelector('.stat-val');
  if (avgCapaianVal && countProgs > 0) {
    avgCapaianVal.textContent = `${Math.round(totalPctSum / countProgs)}%`;
  }

  // Tutup Modal & Bersihkan form
  closeTaskModal();
  alert(`Laporan "${taskName}" sukses dibuat & tersinkronisasi di semua halaman!`);
}

// ===== INISIALISASI HALAMAN UTAMA =====
document.addEventListener("DOMContentLoaded", function() {
  renderChart([65, 70, 75, 82, 92], '#16a34a');
  const initialCard = document.getElementById('pc-kia');
  if (initialCard) {
    initialCard.style.borderColor = 'currentColor';
    initialCard.classList.add('selected');
  }
});
