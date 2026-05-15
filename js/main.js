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
    // Memanggil renderChart dengan parameter program yang terpilih atau default (KIA)
    const activeCard = document.querySelector('.prog-card.selected') || document.getElementById('pc-kia');
    if (activeCard) selectProg(activeCard);
  }
}

// ===== FILTER CHIPS =====
document.querySelectorAll('.filter-chip').forEach(btn => {
  btn.addEventListener('click', function () {
    this.closest('.filter-bar').querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ===== DATA PROGRAM EVALUASI (SET KE 0% UNTUK AWALAN) =====
let progData = {
  kia: {
    title: 'KIA (Kesehatan Ibu & Anak)',
    color: '#16a34a', dot: '#16a34a',
    monthsVal: [0, 0, 0, 0, 0], 
    target: 6000, 
    actual: 0, 
    pct: 0,      
    status: 'Belum Ada Data',
    rows: []
  },
  imun: {
    title: 'Ibu Bersalin (Imunisasi)',
    color: '#2563eb', dot: '#2563eb',
    monthsVal: [0, 0, 0, 0, 0],
    target: 5000,
    actual: 0,
    pct: 0,
    status: 'Belum Ada Data',
    rows: []
  },
  gizi: {
    title: 'Bayi Baru Lahir (Gizi)',
    color: '#ea580c', dot: '#ea580c',
    monthsVal: [0, 0, 0, 0, 0],
    target: 4000,
    actual: 0,
    pct: 0,
    status: 'Belum Ada Data',
    rows: []
  },
  ptm: {
    title: 'Balita (PTM)',
    color: '#7c3aed', dot: '#7c3aed',
    monthsVal: [0, 0, 0, 0, 0],
    target: 8000,
    actual: 0,
    pct: 0,
    status: 'Belum Ada Data',
    rows: []
  },
  tb: {
    title: 'Yang Terduga TB (TB & Paru)',
    color: '#dc2626', dot: '#dc2626',
    monthsVal: [0, 0, 0, 0, 0],
    target: 1000,
    actual: 0,
    pct: 0,
    status: 'Belum Ada Data',
    rows: []
  }
};

// ===== RENDER BAR CHART (AKUMULASI BULANAN TERHADAP TARGET SETAHUN) =====
function renderChart(monthsVal, color, targetTotal) {
  const labels    = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'];
  const container = document.getElementById('mini-chart');
  if (!container) return;

  const percentages = monthsVal.map(val => targetTotal > 0 ? Math.round((val / targetTotal) * 100) : 0);
  const maxPct = Math.max(...percentages, 1); 

  container.innerHTML = percentages.map((p, i) => `
    <div class="bar-wrap">
      <div class="bar-val">${p}%</div>
      <div class="bar" style="height:${Math.round((p / maxPct) * 60)}px;background:${color};opacity:${0.4 + 0.6 * (p / maxPct)}"></div>
      <div class="bar-label">${labels[i]} (${monthsVal[i]})</div>
    </div>`).join('');
}

// ===== FUNGSI PILIH PROGRAM EVALUASI =====
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
  document.getElementById('chart-title').textContent  = 'Tren Capaian Bulanan Terhadap Target Tahunan';
  document.getElementById('detail-dot').style.background = d.dot;
  document.getElementById('chart-dot').style.background  = d.dot;
  document.getElementById('sum-target').textContent = d.target.toLocaleString('id-ID');
  document.getElementById('sum-actual').textContent = d.actual.toLocaleString('id-ID');
  document.getElementById('sum-pct').textContent    = d.pct + '%';

  const sc = document.getElementById('sum-status');
  sc.textContent = d.status;
  sc.style.color = d.pct >= 80 ? '#16a34a' : d.pct >= 40 ? '#d97706' : '#dc2626';

  const tbody = document.getElementById('detail-tbody');
  if (d.rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text3); padding: 24px;">Belum ada input data laporan untuk program ini.</td></tr>`;
  } else {
    tbody.innerHTML = d.rows.map(r => {
      let pill;
      if (r[4] === 'ok') {
        pill = `<span class="status-pill" style="background:var(--green-l);color:var(--green-d)"><i class="ti ti-check" style="font-size:10px"></i> Baik</span>`;
      } else if (r[4] === 'warn') {
        pill = `<span class="status-pill" style="background:var(--amber-l);color:var(--amber-d)"><i class="ti ti-alert-triangle" style="font-size:10px"></i> Cukup</span>`;
      } else {
        pill = `<span class="status-pill" style="background:var(--red-l);color:var(--red-d)"><i class="ti ti-x" style="font-size:10px"></i> Rendah</span>`;
      }
      return `<tr><td>${r[0]}</td><td>${r[1].toLocaleString('id-ID')}</td><td>${r[2].toLocaleString('id-ID')}</td><td>${r[3]}%</td><td>${pill}</td></tr>`;
    }).join('');
  }

  renderChart(d.monthsVal, d.color, d.target);
}

// ===== LOGIKA INPUT TUGAS & AKUMULASI LAPORAN BULANAN =====

// 1. Membuka Modal (Tugas Baru)
function openTaskModal() {
  const modal = document.getElementById('task-modal');
  if (modal) {
    document.getElementById('modal-title-text').textContent = 'Tambah Tugas Baru';
    document.getElementById('edit-task-id').value = '';
    
    // Konfigurasi dropdown untuk tugas baru
    document.getElementById('task-status').disabled = false;
    document.getElementById('task-status').value = 'todo';
    document.getElementById('opt-status-done').style.display = 'none'; // Sembunyikan opsi selesai di awal

    // Tampilkan field tugas baru & kunci
    document.getElementById('task-name').disabled = false;
    document.getElementById('task-pic').disabled = false;
    document.getElementById('task-month-select').disabled = false;

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
  const actualInput = document.getElementById('report-actual');

  if (statusSelect && reportWrapper) {
    if (statusSelect.value === 'done') {
      reportWrapper.style.display = 'block';
      if (actualInput) actualInput.required = true;
    } else {
      reportWrapper.style.display = 'none';
      if (actualInput) { actualInput.required = false; actualInput.value = ''; }
    }
  }
}

// 4. Membuka Modal Selesaikan Tugas (Hanya input laporan + berkas opsional)
function openReportForTask(taskId) {
  const taskCard = document.getElementById(taskId);
  if (!taskCard) return;

  const taskName = taskCard.querySelector('.task-card-title').textContent;
  const taskPic = taskCard.querySelector('.av').getAttribute('title') || '';
  const taskMonth = taskCard.dataset.month;

  document.getElementById('modal-title-text').textContent = 'Selesaikan & Isi Laporan';
  document.getElementById('edit-task-id').value = taskId;
  
  // Isi data tugas yang bersangkutan & kunci agar fokus mengisi laporan
  document.getElementById('task-name').value = taskName;
  document.getElementById('task-name').disabled = true;
  
  document.getElementById('task-pic').value = taskPic;
  document.getElementById('task-pic').disabled = true;

  // Sesuaikan pilihan bulan laporan otomatis
  const selectBulan = document.getElementById('task-month-select');
  selectBulan.value = taskMonth;
  selectBulan.disabled = true;

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei'];
  const reportMonthSelect = document.getElementById('report-month');
  reportMonthSelect.value = Math.max(0, monthNames.indexOf(taskMonth));

  // Tampilkan & kunci status ke Selesai
  const statusSelect = document.getElementById('task-status');
  document.getElementById('opt-status-done').style.display = 'block';
  statusSelect.value = 'done';
  statusSelect.disabled = true;

  const modal = document.getElementById('task-modal');
  if (modal) {
    modal.style.display = 'flex';
    toggleReportFields();
  }
}

// 5. Menyimpan Tugas (Simpan Baru / Selesaikan)
function saveTask(event) {
  event.preventDefault();

  const taskIdToEdit = document.getElementById('edit-task-id').value;
  
  // Re-enable form agar value bisa dibaca
  document.getElementById('task-name').disabled = false;
  document.getElementById('task-pic').disabled = false;
  document.getElementById('task-month-select').disabled = false;

  const taskName = document.getElementById('task-name').value;
  const taskPic = document.getElementById('task-pic').value;
  const taskMonth = document.getElementById('task-month-select').value;
  const statusValue = document.getElementById('task-status').value;

  const initials = taskPic.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

  // Hapus tugas lama di kolom Belum Mulai / Proses jika ia diselesaikan
  if (taskIdToEdit) {
    const oldCard = document.getElementById(taskIdToEdit);
    if (oldCard) oldCard.remove();
  }

  const currentTaskId = taskIdToEdit || 'task-' + Date.now();

  // =========================================================
  // KONDISI A: TUGAS BELUM MULAI / SEDANG PROSES
  // =========================================================
  if (statusValue === 'todo' || statusValue === 'progress') {
  const taskTime = document.getElementById('task-datetime').value; // Ambil waktu
  
  // Tambahkan data-time="${taskTime}" pada tag div task-card
  const newTaskHTML = `
    <div class="task-card" id="${currentTaskId}" data-time="${taskTime}">
      <div class="prio-bar" style="background:var(--amber)"><div style="width:100%;height:3px;background:currentColor;border-radius:3px"></div></div>
      <div class="task-card-title">${taskName}</div>
      <div class="task-card-meta">
        <span class="tag" style="background:#f1f5f9;color:var(--text2)">Belum Mulai</span>
        <div class="assignee-list">
          <div class="av" style="background:var(--teal-l);color:var(--teal-d)" title="${taskPic}">${initials}</div>
        </div>
      </div>
      <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border); font-size: 11px; color: var(--text3)">
        <i class="ti ti-alarm"></i> Mulai: ${new Date(taskTime).toLocaleString('id-ID')}
      </div>
    </div>
    
    let targetColSelector = statusValue === 'todo' ? '#col-todo .task-list-container' : '#col-progress .task-list-container';
    let tagText = statusValue === 'todo' ? 'Belum Mulai' : 'Proses';
    let tagColorStyle = statusValue === 'todo' ? 'background:#f1f5f9;color:var(--text2)' : 'background:var(--blue-l);color:var(--blue-d)';

    const targetColumn = document.querySelector(targetColSelector);
    if (targetColumn) {
      const newTaskHTML = `
        <div class="task-card" id="${currentTaskId}" data-month="${taskMonth}">
          <div class="prio-bar" style="background:${statusValue === 'progress' ? 'var(--orange)' : 'var(--amber)'}"><div style="width:100%;height:3px;background:currentColor;border-radius:3px"></div></div>
          <div class="task-card-title">${taskName}</div>
          <div class="task-card-meta">
            <span class="tag" style="${tagColorStyle}">${tagText}</span>
            <div class="assignee-list">
              <div class="av" style="background:var(--teal-l);color:var(--teal-d)" title="${taskPic}">${initials}</div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border)">
            <span style="font-size:11px; color:var(--text3)"><i class="ti ti-calendar"></i> Periode: ${taskMonth}</span>
            <button onclick="openReportForTask('${currentTaskId}')" style="background: var(--green-l); color: var(--green-d); border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 3px;">
              <i class="ti ti-checklist"></i> Selesaikan
            </button>
          </div>
        </div>
      `;
      targetColumn.insertAdjacentHTML('beforeend', newTaskHTML);
    }
    
    updateKanbanStats();
    closeTaskModal();
    return;
  }

  // =========================================================
  // KONDISI B: TUGAS SELESAI + AKUMULASI LAPORAN BULANAN
  // =========================================================
  if (statusValue === 'done') {
    const programKey = document.getElementById('task-program').value;
    const monthIndex = parseInt(document.getElementById('report-month').value);
    const actualVal = parseInt(document.getElementById('report-actual').value) || 0;

    const prog = progData[programKey];
    if (prog) {
      // Akumulasikan realisasi bulanan baru ke total realisasi program
      prog.actual += actualVal;
      prog.monthsVal[monthIndex] += actualVal;

      // Hitung ulang persentase total terhadap Target Tahunan statis
      const newProgPct = Math.round((prog.actual / prog.target) * 100);
      prog.pct = newProgPct;
      prog.status = newProgPct >= 80 ? 'On Track' : (newProgPct >= 50 ? 'Butuh Perhatian' : 'Kritis');

      // Kontribusi peninputan laporan ini terhadap target setahun
      const contributionPct = Math.round((actualVal / prog.target) * 100);

      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei'];
      const currentMonthName = monthNames[monthIndex];
      const statusPillType = contributionPct >= 10 ? 'ok' : (contributionPct >= 5 ? 'warn' : 'bad');
      
      prog.rows.push([`${taskName} (${currentMonthName})`, prog.target, actualVal, contributionPct, statusPillType]);

      // --- LOGIKA LAMPIRAN BERKAS (OPSIONAL) ---
      const fileInput = document.getElementById('report-file');
      let fileHTML = '';
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileExt = file.name.split('.').pop().toLowerCase();
        let iconColor = fileExt === 'pdf' ? '#dc2626' : (fileExt === 'xlsx' ? '#16a34a' : '#2563eb');
        fileHTML = `
          <div style="margin-top: 10px; padding: 6px 10px; background:#f8fafc; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--border)">
            <span style="font-size: 11px; font-weight: 700; color: var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:80%;"><i class="ti ti-file" style="color:${iconColor}"></i> ${file.name}</span>
            <a href="#" onclick="alert('Mengunduh ${file.name}'); return false;" style="color:${iconColor}"><i class="ti ti-download"></i></a>
          </div>`;
      }

      // --- SINKRONISASI VISUAL KANBAN TUGAS ---
      const doneColumn = document.querySelector('#col-done .task-list-container');
      if (doneColumn) {
        const newTaskHTML = `
          <div class="task-card" id="${currentTaskId}" data-month="${taskMonth}">
            <div class="prio-bar" style="background:var(--green)"><div style="width:100%;height:3px;background:currentColor;border-radius:3px"></div></div>
            <div class="task-card-title">${taskName}</div>
            <div style="font-size:11px; color:var(--text2); margin: 4px 0 8px;">
              Bulan: <strong>${currentMonthName}</strong> | Realisasi: <strong>+${actualVal.toLocaleString('id-ID')}</strong> (<strong>${contributionPct}%</strong> dari target)
            </div>
            ${fileHTML}
            <div class="task-card-meta" style="margin-top:10px;">
              <span class="tag" style="background:var(--green-l);color:var(--green-d)">Selesai (${newProgPct}%)</span>
              <div class="assignee-list">
                <div class="av" style="background:var(--teal-l);color:var(--teal-d)" title="${taskPic}">${initials}</div>
              </div>
            </div>
          </div>`;
        doneColumn.insertAdjacentHTML('beforeend', newTaskHTML);
      }

      // --- SINKRONISASI VISUAL DASHBOARD (CAPAIAN PROGRAM BULAN INI) ---
      const dashProgItem = document.getElementById(`dash-prog-${programKey}`);
      if (dashProgItem) {
        dashProgItem.querySelector('.prog-pct-text').textContent = `${newProgPct}%`;
        dashProgItem.querySelector('.prog-fill').style.width = `${Math.min(newProgPct, 100)}%`;
      }

      // --- SINKRONISASI VISUAL KARTU EVALUASI ---
      const progCard = document.getElementById(`pc-${programKey}`);
      if (progCard) {
        progCard.querySelector('.prog-card-pct').textContent = `${newProgPct}%`;
        progCard.querySelector('.prog-card-mini').textContent = `Target: ${prog.target.toLocaleString('id-ID')} · Tercapai: ${prog.actual.toLocaleString('id-ID')}`;
        const fillBar = progCard.querySelector('.prog-card-pct + div div');
        if (fillBar) fillBar.style.width = `${Math.min(newProgPct, 100)}%`;
      }

      // Re-render jika program yang diupdate sedang aktif dibuka di page Evaluasi
      const activeCard = document.querySelector('.prog-card.selected');
      if (activeCard && activeCard.id === `pc-${programKey}`) {
        selectProg(activeCard);
      }
    }

    // --- SINKRONISASI AKTIVITAS DASHBOARD ---
    const activityContainer = document.getElementById('dash-activity-list');
    if (activityContainer) {
      // Hapus pesan kosong di awal jika ini aktivitas pertama
      if (activityContainer.textContent.includes("Belum ada aktivitas")) {
        activityContainer.innerHTML = '';
      }
      const logHTML = `
        <div class="activity-item">
          <div class="act-dot" style="background:var(--green-l);color:var(--green)"><i class="ti ti-trending-up"></i></div>
          <div>
            <div class="act-text"><strong>${taskPic}</strong> menginput realisasi bulanan: +${actualVal.toLocaleString('id-ID')} pada program <strong>${prog.title}</strong></div>
            <div class="act-time">Baru saja</div>
          </div>
        </div>`;
      activityContainer.insertAdjacentHTML('afterbegin', logHTML);
    }

    updateKanbanStats();
    closeTaskModal();
    alert(`Laporan "${taskName}" berhasil diakumulasikan! Capaian program ${prog.title} naik menjadi ${prog.pct}%.`);
  }
}

// ===== UPDATE STATISTIK KANBAN & DASHBOARD =====
function updateKanbanStats() {
  const todoCount = document.querySelectorAll('#col-todo .task-card').length;
  const progressCount = document.querySelectorAll('#col-progress .task-card').length;
  const doneCount = document.querySelectorAll('#col-done .task-card').length;
  const totalActive = todoCount + progressCount;

  // Render teks angka di badge sidebar dan title manajemen tugas
  document.getElementById('badge-tugas-total').textContent = totalActive;
  document.getElementById('tugas-stats-text').textContent = `${totalActive} tugas aktif · ${doneCount} selesai`;

  // Render angka di atas masing-masing kolom kanban
  document.querySelector('#col-todo .col-count').textContent = todoCount;
  document.querySelector('#col-progress .col-count').textContent = progressCount;
  document.querySelector('#col-done .col-count').textContent = doneCount;

  // Render angka total di Dashboard
  document.getElementById('dash-total-tugas').textContent = totalActive + doneCount;

  // Render daftar tugas berjalan di Dashboard
  const dashTaskList = document.getElementById('dash-active-tasks-list');
  const allActiveCards = document.querySelectorAll('#col-todo .task-card, #col-progress .task-card');
  
  if (allActiveCards.length === 0) {
    dashTaskList.innerHTML = `<div style="text-align: center; color: var(--text3); font-size: 13px; padding: 24px 0;">Belum ada tugas aktif berjalan.</div>`;
  } else {
    dashTaskList.innerHTML = Array.from(allActiveCards).map(card => {
      const title = card.querySelector('.task-card-title').textContent;
      const pic = card.querySelector('.av').getAttribute('title');
      const isProgress = card.closest('#col-progress') !== null;
      const period = card.dataset.month;
      
      return `
        <div class="task-item">
          <div class="task-check" style="${isProgress ? 'border-color:var(--blue)' : 'border-color:var(--orange)'}"></div>
          <div style="flex:1">
            <div class="task-name">${title}</div>
            <div style="font-size:11px;color:var(--text3)">${pic} · Periode: ${period}</div>
          </div>
          <div class="chip" style="${isProgress ? 'background:var(--blue-l);color:var(--blue-d)' : 'background:var(--orange-l);color:var(--orange-d)'}">
            ${isProgress ? 'Proses' : 'Pending'}
          </div>
        </div>
      `;
    }).join('');
  }

  // Hitung ulang Rata-rata Capaian global di Dashboard
  let totalPctSum = 0;
  let countProgs = 0;
  for (let key in progData) {
    totalPctSum += progData[key].pct;
    countProgs++;
  }
  const avgPct = Math.round(totalPctSum / countProgs);
  document.getElementById('dash-avg-capaian').textContent = `${avgPct}%`;
}

// ===== INISIALISASI HALAMAN SAAT WEBPAGE DI-LOAD =====
document.addEventListener("DOMContentLoaded", function() {
  // Render KIA (0%) secara default
  renderChart(progData.kia.monthsVal, progData.kia.color, progData.kia.target);
  const initialCard = document.getElementById('pc-kia');
  if (initialCard) {
    initialCard.style.borderColor = 'currentColor';
    initialCard.classList.add('selected');
  }
  updateKanbanStats();
});

// Fungsi untuk memindahkan tugas secara otomatis
function checkTaskAutomation() {
  const now = new Date();
  const todoCards = document.querySelectorAll('#col-todo .task-card');

  todoCards.forEach(card => {
    const startTimeStr = card.getAttribute('data-time');
    if (!startTimeStr) return;

    const startTime = new Date(startTimeStr);

    // Jika waktu sekarang sudah melewati atau sama dengan waktu mulai
    if (now >= startTime) {
      moveTaskToProgress(card);
    }
  });
}

function moveTaskToProgress(card) {
  const progressContainer = document.querySelector('#col-progress .task-list-container');
  const tag = card.querySelector('.tag');
  const prioBar = card.querySelector('.prio-bar');

  // Ubah tampilan kartu menjadi "Proses"
  if (tag) {
    tag.textContent = 'Proses';
    tag.style.background = 'var(--blue-l)';
    tag.style.color = 'var(--blue-d)';
  }
  if (prioBar) {
    prioBar.style.background = 'var(--orange)';
  }

  // Tambahkan tombol Selesaikan (karena sekarang sudah di kolom pengerjaan)
  const footer = card.lastElementChild;
  footer.innerHTML = `
    <span style="font-size:11px; color:var(--text3)"><i class="ti ti-loader"></i> Sedang Dikerjakan</span>
    <button onclick="openReportForTask('${card.id}')" style="background: var(--green-l); color: var(--green-d); border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 3px;">
      <i class="ti ti-checklist"></i> Selesaikan
    </button>
  `;

  // Pindahkan kartu secara fisik di HTML
  progressContainer.appendChild(card);
  
  // Update angka statistik di header kolom
  updateKanbanStats();
  
  console.log(`Tugas "${card.querySelector('.task-card-title').textContent}" otomatis pindah ke Sedang Dikerjakan.`);
}

// Jalankan pengecekan setiap 30 detik
setInterval(checkTaskAutomation, 30000);
