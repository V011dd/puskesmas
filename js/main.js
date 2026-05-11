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

// ===== DATA PROGRAM EVALUASI (TARGET TAHUNAN STATIS) =====
let progData = {
  kia: {
    title: 'KIA (Kesehatan Ibu & Anak)',
    color: '#16a34a', dot: '#16a34a',
    // Nilai awal capaian bulanan (misal: Jan=1500, Feb=1200, Mar=800, Apr=500, Mei=0)
    monthsVal: [1500, 1200, 800, 500, 0], 
    target: 6000, // Target Tahunan Statis
    actual: 4000, // Akumulasi realisasi awal (Jan-Apr)
    pct: 67,      // (4000 / 6000) * 100%
    status: 'On Track',
    rows: [
      ['Kunjungan K1 (Januari)',  6000, 1500, 25, 'warn'],
      ['Kunjungan K4 (Februari)',  6000, 1200, 20, 'warn'],
      ['Kunjungan Neonatal (Maret)', 6000, 800, 13, 'bad'],
      ['KB Aktif (April)',         6000, 500, 8, 'bad'],
    ]
  },
  imun: {
    title: 'Imunisasi Dasar',
    color: '#2563eb', dot: '#2563eb',
    monthsVal: [1000, 1100, 900, 400, 0],
    target: 5000,
    actual: 3400,
    pct: 68,
    status: 'On Track',
    rows: [
      ['DPT-HB-Hib (Januari)', 5000, 1000, 20, 'warn'],
      ['Polio Oral (Februari)',  5000, 1100, 22, 'warn'],
    ]
  },
  gizi: {
    title: 'Gizi Masyarakat',
    color: '#ea580c', dot: '#ea580c',
    monthsVal: [800, 700, 600, 300, 0],
    target: 4000,
    actual: 2400,
    pct: 60,
    status: 'Butuh Perhatian',
    rows: [
      ['Balita Ditimbang (Januari)', 4000, 800, 20, 'warn']
    ]
  },
  ptm: {
    title: 'PTM (Penyakit Tidak Menular)',
    color: '#7c3aed', dot: '#7c3aed',
    monthsVal: [1200, 1000, 800, 1000, 0],
    target: 8000,
    actual: 4000,
    pct: 50,
    status: 'Butuh Perhatian',
    rows: []
  },
  tb: {
    title: 'TB & Paru',
    color: '#dc2626', dot: '#dc2626',
    monthsVal: [100, 150, 120, 80, 0],
    target: 1000,
    actual: 450,
    pct: 45,
    status: 'Kritis',
    rows: []
  }
};

// ===== RENDER BAR CHART (MENGHITUNG PERSENTASE BULANAN DARI TARGET TAHUNAN) =====
function renderChart(monthsVal, color, targetTotal) {
  const labels    = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'];
  const container = document.getElementById('mini-chart');
  if (!container) return;

  // Konversi nilai riil bulanan menjadi persentase kontribusi terhadap target tahunan
  const percentages = monthsVal.map(val => Math.round((val / targetTotal) * 100));
  const maxPct = Math.max(...percentages, 1); // Hindari pembagian dengan nol

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
  document.getElementById('sum-target').textContent = d.target;
  document.getElementById('sum-actual').textContent = d.actual;
  document.getElementById('sum-pct').textContent    = d.pct + '%';

  const sc = document.getElementById('sum-status');
  sc.textContent = d.status;
  sc.style.color = d.pct >= 80 ? '#16a34a' : d.pct >= 50 ? '#d97706' : '#dc2626';

  const tbody = document.getElementById('detail-tbody');
  tbody.innerHTML = d.rows.map(r => {
    let pill;
    if (r[4] === 'ok') {
      pill = `<span class="status-pill" style="background:var(--green-l);color:var(--green-d)"><i class="ti ti-check" style="font-size:10px"></i> Ok</span>`;
    } else if (r[4] === 'warn') {
      pill = `<span class="status-pill" style="background:var(--amber-l);color:var(--amber-d)"><i class="ti ti-alert-triangle" style="font-size:10px"></i> Berjalan</span>`;
    } else {
      pill = `<span class="status-pill" style="background:var(--red-l);color:var(--red-d)"><i class="ti ti-x" style="font-size:10px"></i> Rendah</span>`;
    }
    return `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}%</td><td>${pill}</td></tr>`;
  }).join('');

  renderChart(d.monthsVal, d.color, d.target);
}

// ===== LOGIKA INPUT TUGAS & AKUMULASI LAPORAN BULANAN =====
function saveTask(event) {
  event.preventDefault();

  const taskIdToEdit = document.getElementById('edit-task-id').value;
  const taskName = document.getElementById('task-name').value;
  const taskDesc = document.getElementById('task-desc').value;
  const taskPic = document.getElementById('task-pic').value;
  const statusValue = document.getElementById('task-status').value;

  const initials = taskPic.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

  // Hapus tugas lama jika merupakan proses transisi dari 'Belum Mulai'/'Proses' ke 'Selesai'
  if (taskIdToEdit) {
    const oldCard = document.getElementById(taskIdToEdit);
    if (oldCard) {
      const parentCol = oldCard.closest('.kanban-col');
      if (parentCol) {
        const countSpan = parentCol.querySelector('.col-count');
        if (countSpan) countSpan.textContent = Math.max(0, (parseInt(countSpan.textContent) || 0) - 1);
      }
      oldCard.remove();
    }
  }

  const currentTaskId = taskIdToEdit || 'task-' + Date.now();

  // =========================================================
  // KONDISI A: TUGAS BELUM MULAI / SEDANG PROSES (TIDAK ADA INPUT AKUMULASI LAPORAN)
  // =========================================================
  if (statusValue === 'todo' || statusValue === 'progress') {
    let targetColSelector = statusValue === 'todo' ? '#page-tugas .kanban-col:first-child' : '#page-tugas .kanban-col:nth-child(2)';
    let tagText = statusValue === 'todo' ? 'Belum Mulai' : 'Proses';
    let tagColorStyle = statusValue === 'todo' ? 'background:#f1f5f9;color:var(--text2)' : 'background:var(--blue-l);color:var(--blue-d)';

    const targetColumn = document.querySelector(targetColSelector);
    if (targetColumn) {
      const newTaskHTML = `
        <div class="task-card" id="${currentTaskId}">
          <div class="prio-bar" style="background:${statusValue === 'progress' ? 'var(--orange)' : 'var(--amber)'}"><div style="width:100%;height:3px;background:currentColor;border-radius:3px"></div></div>
          <div class="task-card-title">${taskName}</div>
          ${taskDesc ? `<p style="font-size:12px; color:var(--text2); margin: 4px 0 8px;">${taskDesc}</p>` : ''}
          <div class="task-card-meta">
            <span class="tag" style="${tagColorStyle}">${tagText}</span>
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
      if (addBtn) addBtn.insertAdjacentHTML('beforebegin', newTaskHTML);
      
      const countSpan = targetColumn.querySelector('.col-count');
      if (countSpan) countSpan.textContent = (parseInt(countSpan.textContent) || 0) + 1;
    }
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
      // 1. Akumulasikan realisasi bulanan baru ke total realisasi program
      prog.actual += actualVal;
      
      // 2. Masukkan realisasi ke bulan yang dipilih pada array tren grafik
      prog.monthsVal[monthIndex] += actualVal;

      // 3. Hitung ulang persentase total terhadap Target Tahunan yang tetap (statis)
      const newProgPct = Math.round((prog.actual / prog.target) * 100);
      prog.pct = newProgPct;
      prog.status = newProgPct >= 80 ? 'On Track' : (newProgPct >= 50 ? 'Butuh Perhatian' : 'Kritis');

      // 4. Hitung kontribusi penginputan laporan ini terhadap target setahun
      const contributionPct = Math.round((actualVal / prog.target) * 100);

      // 5. Tambahkan baris baru ke dalam tabel rincian evaluasi
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei'];
      const currentMonthName = monthNames[monthIndex];
      const statusPillType = contributionPct >= 10 ? 'ok' : (contributionPct >= 5 ? 'warn' : 'bad');
      
      prog.rows.push([`${taskName} (${currentMonthName})`, prog.target, actualVal, contributionPct, statusPillType]);

      // --- SINKRONISASI VISUAL KANBAN TUGAS ---
      // Logika upload file simulasi
      const fileInput = document.getElementById('report-file');
      let fileHTML = '';
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileExt = file.name.split('.').pop().toLowerCase();
        let iconColor = fileExt === 'pdf' ? '#dc2626' : (fileExt === 'xlsx' ? '#16a34a' : '#2563eb');
        fileHTML = `
          <div style="margin-top: 10px; padding: 6px 10px; background:#f8fafc; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 11px; font-weight: 700; color: var(--text);"><i class="ti ti-file" style="color:${iconColor}"></i> ${file.name}</span>
            <a href="#" onclick="alert('Mengunduh ${file.name}'); return false;" style="color:${iconColor}"><i class="ti ti-download"></i></a>
          </div>`;
      }

      const doneColumn = document.querySelector('#page-tugas .kanban-col:last-child');
      if (doneColumn) {
        const newTaskHTML = `
          <div class="task-card" id="${currentTaskId}">
            <div class="prio-bar"><div style="width:100%;height:3px;background:var(--green);border-radius:3px"></div></div>
            <div class="task-card-title">${taskName}</div>
            <div style="font-size:11px; color:var(--text2); margin: 4px 0 8px;">
              Diinput pada: <strong>${currentMonthName}</strong> | Kontribusi: <strong>+${actualVal}</strong> (<strong>${contributionPct}%</strong> dari target setahun)
            </div>
            ${fileHTML}
            <div class="task-card-meta" style="margin-top:10px;">
              <span class="tag" style="background:var(--green-l);color:var(--green-d)">Selesai</span>
              <div class="assignee-list">
                <div class="av" style="background:var(--teal-l);color:var(--teal-d)" title="${taskPic}">${initials}</div>
              </div>
            </div>
          </div>`;
        const addBtn = doneColumn.querySelector('.add-task-btn');
        if (addBtn) addBtn.insertAdjacentHTML('beforebegin', newTaskHTML);
        
        const countSpan = doneColumn.querySelector('.col-count');
        if (countSpan) countSpan.textContent = (parseInt(countSpan.textContent) || 0) + 1;
      }

      // --- SINKRONISASI VISUAL KARTU EVALUASI ---
      const progCard = document.getElementById(`pc-${programKey}`);
      if (progCard) {
        progCard.querySelector('.prog-card-pct').textContent = `${newProgPct}%`;
        progCard.querySelector('.prog-card-mini').textContent = `Target Setahun: ${prog.target} · Terakumulasi: ${prog.actual}`;
        const fillBar = progCard.querySelector('.prog-card-pct + div div');
        if (fillBar) fillBar.style.width = `${newProgPct}%`;
      }

      // Jika kartu ini sedang aktif/dipilih, langsung render ulang grafiknya
      const activeCard = document.querySelector('.prog-card.selected');
      if (activeCard && activeCard.id === `pc-${programKey}`) {
        selectProg(activeCard);
      }
    }

    // --- SINKRONISASI DASHBOARD ---
    const activityContainer = document.querySelector('#page-dash .card:last-child div[style*="grid-template-columns"]');
    if (activityContainer) {
      const logHTML = `
        <div class="activity-item">
          <div class="act-dot" style="background:var(--green-l);color:var(--green)"><i class="ti ti-trending-up"></i></div>
          <div>
            <div class="act-text"><strong>${taskPic}</strong> menginput realisasi bulanan: +${actualVal} sasaran pada program <strong>${prog.title}</strong></div>
            <div class="act-time">Baru saja</div>
          </div>
        </div>`;
      activityContainer.insertAdjacentHTML('afterbegin', logHTML);
    }

    // Update total capaian rata-rata di Dashboard
    let totalPctSum = 0, countProgs = 0;
    for (let key in progData) {
      totalPctSum += progData[key].pct;
      countProgs++;
    }
    const avgCapaianVal = document.querySelectorAll('.stat-card')[2]?.querySelector('.stat-val');
    if (avgCapaianVal && countProgs > 0) {
      avgCapaianVal.textContent = `${Math.round(totalPctSum / countProgs)}%`;
    }

    closeTaskModal();
    alert(`Laporan berhasil diakumulasikan! Total capaian ${prog.title} naik menjadi ${prog.pct}%.`);
  }
}

// ===== INISIALISASI DEFAULT SAAT WEBSITE DIBUKA =====
document.addEventListener("DOMContentLoaded", function() {
  // Render KIA secara default saat web pertama kali dimuat
  renderChart(progData.kia.monthsVal, progData.kia.color, progData.kia.target);
  const initialCard = document.getElementById('pc-kia');
  if (initialCard) {
    initialCard.style.borderColor = 'currentColor';
    initialCard.classList.add('selected');
  }
});
