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

// ===== LOGIKA MODAL TAMBAH & SELESAIKAN TUGAS =====

// ID unik pembantu untuk tugas-tugas baru
let taskIdCounter = Date.now();

// 1. Membuka Modal (Untuk Tugas Baru)
function openTaskModal() {
  const modal = document.getElementById('task-modal');
  if (modal) {
    document.getElementById('edit-task-id').value = ''; // Kosongkan ID edit karena ini tugas baru
    document.getElementById('task-status').disabled = false; // Aktifkan pilihan status
    modal.style.display = 'flex';
    toggleReportFields();
  }
}

// 2. Menutup Modal
function closeTaskModal() {
  const modal = document.getElementById('task-modal');
  if (modal) modal.style.display = 'none';
  const form = document.getElementById('task-form');
  if (form) form.reset();
}

// 3. Menampilkan/Menyembunyikan Form Laporan secara Dinamis
function toggleReportFields() {
  const statusSelect = document.getElementById('task-status');
  const reportWrapper = document.getElementById('report-fields-wrapper');
  const targetInput = document.getElementById('report-target');
  const actualInput = document.getElementById('report-actual');

  if (statusSelect && reportWrapper) {
    if (statusSelect.value === 'done') {
      reportWrapper.style.display = 'block';
      if (targetInput) targetInput.required = true;
      if (actualInput) actualInput.required = true;
    } else {
      reportWrapper.style.display = 'none';
      if (targetInput) { targetInput.required = false; targetInput.value = ''; }
      if (actualInput) { actualInput.required = false; actualInput.value = ''; }
    }
  }
}

// 4. KHUSUS: Membuka Modal Laporan untuk Tugas yang Sudah Ada
function openReportForTask(taskId) {
  const taskCard = document.getElementById(taskId);
  if (!taskCard) return;

  // Ambil data dari kartu tugas yang lama
  const taskName = taskCard.querySelector('.task-card-title').textContent;
  const taskPic = taskCard.querySelector('.av').getAttribute('title') || '';

  // Isi data tersebut ke dalam form modal
  document.getElementById('edit-task-id').value = taskId; // Simpan ID kartu untuk dihapus nanti
  document.getElementById('task-name').value = taskName;
  document.getElementById('task-pic').value = taskPic;
  
  // Paksa status modal menjadi "Selesai" dan buka form input laporannya
  const statusSelect = document.getElementById('task-status');
  statusSelect.value = 'done';
  statusSelect.disabled = true; // Kunci agar tidak bisa diubah kembali ke "todo/progress" saat proses ini

  const modal = document.getElementById('task-modal');
  if (modal) {
    modal.style.display = 'flex';
    toggleReportFields();
  }
}

// 5. Menyimpan Tugas & Sinkronisasi
function saveTask(event) {
  event.preventDefault();

  const taskIdToEdit = document.getElementById('edit-task-id').value;
  const taskName = document.getElementById('task-name').value;
  const taskDesc = document.getElementById('task-desc').value;
  const taskPic = document.getElementById('task-pic').value;
  const statusValue = document.getElementById('task-status').value;

  const initials = taskPic.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

  // Jika ini adalah proses "Menyelesaikan Tugas yang sudah ada", hapus kartu lamanya terlebih dahulu
  if (taskIdToEdit) {
    const oldCard = document.getElementById(taskIdToEdit);
    if (oldCard) {
      // Kurangi counter kolom asal sebelum kartunya dihapus
      const parentCol = oldCard.closest('.kanban-col');
      if (parentCol) {
        const countSpan = parentCol.querySelector('.col-count');
        if (countSpan) {
          countSpan.textContent = Math.max(0, (parseInt(countSpan.textContent) || 0) - 1);
        }
      }
      oldCard.remove(); // Hapus kartu lama dari kolom Belum Mulai / Sedang Dikerjakan
    }
  }

  // Generate ID baru jika ini adalah pembuatan tugas dari awal
  const currentTaskId = taskIdToEdit || 'task-' + (taskIdCounter++);

  // ==========================================
  // KONDISI A: SIMPAN SEBAGAI BELUM MULAI / SEDANG DIKERJAKAN
  // ==========================================
  if (statusValue === 'todo' || statusValue === 'progress') {
    let targetColSelector = '#page-tugas .kanban-col:first-child';
    let tagBg = '#f1f5f9';
    let tagColor = 'var(--text2)';
    let tagText = 'Belum Mulai';

    if (statusValue === 'progress') {
      targetColSelector = '#page-tugas .kanban-col:nth-child(2)';
      tagBg = 'var(--blue-l)';
      tagColor = 'var(--blue-d)';
      tagText = 'Proses';
    }

    const targetColumn = document.querySelector(targetColSelector);

    if (targetColumn) {
      const newTaskHTML = `
        <div class="task-card" id="${currentTaskId}">
          <div class="prio-bar" style="background:${statusValue === 'progress' ? 'var(--orange)' : 'var(--amber)'}"><div style="width:100%;height:3px;background:currentColor;border-radius:3px"></div></div>
          <div class="task-card-title">${taskName}</div>
          ${taskDesc ? `<p style="font-size:12px; color:var(--text2); margin: 4px 0 8px; line-height:1.4;">${taskDesc}</p>` : ''}
          <div class="task-card-meta" style="margin-top: 8px;">
            <span class="tag" style="background:${tagBg};color:${tagColor}">${tagText}</span>
            <div class="assignee-list">
              <div class="av" style="background:var(--teal-l);color:var(--teal-d)" title="${taskPic}">${initials}</div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border)">
            <span style="font-size:11px; color:var(--text3)"><i class="ti ti-calendar"></i> Aktif</span>
            <button onclick="openReportForTask('${currentTaskId}')" style="background: var(--green-l); color: var(--green-d); border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 3px;">
              <i class="ti ti-checklist"></i> Selesaikan
            </button>
          </div>
        </div>
      `;

      const addBtn = targetColumn.querySelector('.add-task-btn');
      if (addBtn) {
        addBtn.insertAdjacentHTML('beforebegin', newTaskHTML);
      } else {
        targetColumn.insertAdjacentHTML('beforeend', newTaskHTML);
      }

      const countSpan = targetColumn.querySelector('.col-count');
      if (countSpan) {
        countSpan.textContent = (parseInt(countSpan.textContent) || 0) + 1;
      }
    }

    // Buat log aktivitas di Dashboard
    const activityContainer = document.querySelector('#page-dash .card:last-child div[style*="grid-template-columns"]');
    if (activityContainer) {
      const logHTML = `
        <div class="activity-item">
          <div class="act-dot" style="background:var(--blue-l);color:var(--blue)"><i class="ti ti-plus"></i></div>
          <div>
            <div class="act-text"><strong>${taskPic}</strong> membuat tugas baru: "${taskName}"</div>
            <div class="act-time">Baru saja</div>
          </div>
        </div>
      `;
      activityContainer.insertAdjacentHTML('afterbegin', logHTML);
    }

    closeTaskModal();
    alert(`Tugas "${taskName}" berhasil ditambahkan ke daftar!`);
    return;
  }

  // ==========================================
  // KONDISI B: SIMPAN SEBAGAI SELESAI + INPUT LAPORAN (SINKRONISASI)
  // ==========================================
  if (statusValue === 'done') {
    const programKey = document.getElementById('task-program').value;
    const targetVal = parseInt(document.getElementById('report-target').value) || 0;
    const actualVal = parseInt(document.getElementById('report-actual').value) || 0;

    const pct = targetVal > 0 ? Math.round((actualVal / targetVal) * 100) : 0;

    // 1. Tambahkan kartu ke kolom Selesai
    const doneColumn = document.querySelector('#page-tugas .kanban-col:last-child');
    if (doneColumn) {
      const newTaskHTML = `
        <div class="task-card" id="${currentTaskId}">
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

      const addBtn = doneColumn.querySelector('.add-task-btn');
      if (addBtn) {
        addBtn.insertAdjacentHTML('beforebegin', newTaskHTML);
      } else {
        doneColumn.insertAdjacentHTML('beforeend', newTaskHTML);
      }

      const countSpan = doneColumn.querySelector('.col-count');
      if (countSpan) {
        countSpan.textContent = (parseInt(countSpan.textContent) || 0) + 1;
      }
    }

    // 2. Sinkronisasi data ke Evaluasi Capaian
    if (progData[programKey]) {
      progData[programKey].target += targetVal;
      progData[programKey].actual += actualVal;
      
      const newProgPct = Math.round((progData[programKey].actual / progData[programKey].target) * 100);
      progData[programKey].pct = newProgPct;
      progData[programKey].status = newProgPct >= 80 ? 'On Track' : (newProgPct >= 60 ? 'Butuh Perhatian' : 'Kritis');

      const statusPillType = pct >= 80 ? 'ok' : (pct >= 50 ? 'warn' : 'bad');
      progData[programKey].rows.push([taskName, targetVal, actualVal, pct, statusPillType]);

      progData[programKey].months[4] = Math.min(100, Math.round(progData[programKey].months[4] + (pct * 0.05)));

      const progCard = document.getElementById(`pc-${programKey}`);
      if (progCard) {
        progCard.querySelector('.prog-card-pct').textContent = `${newProgPct}%`;
        progCard.querySelector('.prog-card-mini').textContent = `Target: ${progData[programKey].target} · Tercapai: ${progData[programKey].actual}`;
        
        const fillBar = progCard.querySelector('.prog-card-pct + div div');
        if (fillBar) fillBar.style.width = `${newProgPct}%`;
      }
      
      const activeCard = document.querySelector('.prog-card.selected');
      if (activeCard && activeCard.id === `pc-${programKey}`) {
        selectProg(activeCard);
      }
    }

    // 3. Sinkronisasi Dashboard
    const activityContainer = document.querySelector('#page-dash .card:last-child div[style*="grid-template-columns"]');
    if (activityContainer) {
      const actionText = taskIdToEdit ? 'menyelesaikan laporan tugas' : 'menginput laporan langsung';
      const logHTML = `
        <div class="activity-item">
          <div class="act-dot" style="background:var(--green-l);color:var(--green)"><i class="ti ti-file-analytics"></i></div>
          <div>
            <div class="act-text"><strong>${taskPic}</strong> ${actionText}: "${taskName}" (${pct}%)</div>
            <div class="act-time">Baru saja</div>
          </div>
        </div>
      `;
      activityContainer.insertAdjacentHTML('afterbegin', logHTML);
    }

    // Update total tugas aktif di Dashboard
    const totalTaskVal = document.querySelector('.stat-card:first-child .stat-val');
    if (totalTaskVal) {
      totalTaskVal.textContent = (parseInt(totalTaskVal.textContent) || 0) + 1;
    }

    // Update Rata-rata Capaian global di Dashboard
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

    closeTaskModal();
    alert(`Laporan "${taskName}" sukses diinput dan tersinkronisasi di semua halaman!`);
  }
}
