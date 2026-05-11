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
  if (p === 'eval') renderChart([65, 70, 75, 82, 92], '#16a34a');
}

// ===== FILTER CHIPS =====
document.querySelectorAll('.filter-chip').forEach(btn => {
  btn.addEventListener('click', function () {
    this.closest('.filter-bar').querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ===== DATA PROGRAM EVALUASI =====
const progData = {
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
  container.innerHTML = vals.map((v, i) => `
    <div class="bar-wrap">
      <div class="bar-val">${v}%</div>
      <div class="bar" style="height:${Math.round((v / max) * 60)}px;background:${color};opacity:${0.4 + 0.6 * (v / max)}"></div>
      <div class="bar-label">${labels[i]}</div>
    </div>`).join('');
}

// ===== INISIALISASI =====
renderChart([65, 70, 75, 82, 92], '#16a34a');
document.getElementById('pc-kia').style.borderColor = 'currentColor';
document.getElementById('pc-kia').classList.add('selected');

// ===== DATABASE / STATE SEMENTARA =====
// Mengambil data awal dari progData yang sudah ada di main.js kamu, atau membuat baru
let currentProgData = { ...progData }; 

// ===== FUNGSI MODAL =====
function openTaskModal() {
  document.getElementById('task-modal').style.display = 'flex';
}

function closeTaskModal() {
  document.getElementById('task-modal').style.display = 'none';
  document.getElementById('task-form').reset();
}

// ===== UTAMA: SINKRONISASI DATA =====
function saveTask(event) {
  event.preventDefault();

  // 1. Ambil data dari Form Input
  const taskName = document.getElementById('task-name').value;
  const programKey = document.getElementById('task-program').value;
  const targetVal = parseInt(document.getElementById('report-target').value);
  const actualVal = parseInt(document.getElementById('report-actual').value);
  const taskPic = document.getElementById('task-pic').value;

  // Hitung persentase capaian baru untuk tugas ini
  const pct = Math.round((actualVal / targetVal) * 100);
  const initials = taskPic.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

  // ==========================================
  // SINKRONISASI 1: KE PAGE MANAJEMEN TUGAS
  // ==========================================
  const taskContainer = document.querySelector('#page-tugas .kanban-col:last-child'); // Kolom "Selesai"
  if (taskContainer) {
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
    
    // Masukkan kartu sebelum tombol "Tambah Tugas" di kolom Selesai
    const addBtn = taskContainer.querySelector('.add-task-btn');
    if (addBtn) {
      addBtn.insertAdjacentHTML('beforebegin', newTaskHTML);
    } else {
      taskContainer.insertAdjacentHTML('beforeend', newTaskHTML);
    }

    // Update counter kolom Selesai
    const countSpan = taskContainer.querySelector('.col-count');
    if (countSpan) {
      countSpan.textContent = parseInt(countSpan.textContent) + 1;
    }
  }

  // ==========================================
  // SINKRONISASI 2: KE PAGE EVALUASI CAPAIAN
  // ==========================================
  // Update data program di object progData
  if (currentProgData[programKey]) {
    // Tambahkan target dan realisasi baru ke total program
    currentProgData[programKey].target += targetVal;
    currentProgData[programKey].actual += actualVal;
    
    // Hitung ulang persentase total program tersebut
    const newProgPct = Math.round((currentProgData[programKey].actual / currentProgData[programKey].target) * 100);
    currentProgData[programKey].pct = newProgPct;

    // Tambahkan data ke baris tabel detail
    const statusPill = pct >= 80 ? 'ok' : (pct >= 50 ? 'warn' : 'danger');
    currentProgData[programKey].rows.push([taskName, targetVal, actualVal, pct, statusPill]);

    // Tambahkan tren bulan Mei (index ke-4) agar grafiknya naik secara visual
    currentProgData[programKey].months[4] = Math.min(100, Math.round(currentProgData[programKey].months[4] + (pct * 0.1)));

    // Update visual Kartu Evaluasi di UI secara instan
    const cardId = `pc-${programKey}`;
    const progCard = document.getElementById(cardId);
    if (progCard) {
      progCard.querySelector('.prog-card-pct').textContent = `${newProgPct}%`;
      progCard.querySelector('.prog-card-mini').textContent = `Target: ${currentProgData[programKey].target} · Tercapai: ${currentProgData[programKey].actual}`;
      progCard.querySelector('.prog-card-pct + div div').style.width = `${newProgPct}%`;
    }
  }

  // ==========================================
  // SINKRONISASI 3: KE PAGE DASHBOARD
  // ==========================================
  // A. Tambah ke Log "Aktivitas Terbaru" di Dashboard
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

  // B. Update total tugas aktif di statistik Dashboard
  const totalTaskVal = document.querySelector('.stat-card:first-child .stat-val');
  if (totalTaskVal) {
    totalTaskVal.textContent = parseInt(totalTaskVal.textContent) + 1;
  }

  // C. Update Rata-rata Capaian seluruh program di Dashboard
  let totalPctSum = 0;
  let countProgs = 0;
  for (let key in currentProgData) {
    totalPctSum += currentProgData[key].pct;
    countProgs++;
  }
  const avgCapaianVal = document.querySelectorAll('.stat-card')[2]?.querySelector('.stat-val');
  if (avgCapaianVal && countProgs > 0) {
    avgCapaianVal.textContent = `${Math.round(totalPctSum / countProgs)}%`;
  }

  // ==========================================
  // SELESAI
  // ==========================================
  closeTaskModal();
  alert(`Laporan "${taskName}" berhasil disinkronkan ke semua halaman!`);
}
