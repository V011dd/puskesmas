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
  kia: { title: 'KIA (Kesehatan Ibu & Anak)', color: '#16a34a', dot: '#16a34a', monthsVal: [0,0,0,0,0], target: 6000, actual: 0, pct: 0, status: 'Belum Ada Data', rows: [] },
  imun: { title: 'Ibu Bersalin (Imunisasi)', color: '#2563eb', dot: '#2563eb', monthsVal: [0,0,0,0,0], target: 5000, actual: 0, pct: 0, status: 'Belum Ada Data', rows: [] },
  gizi: { title: 'Bayi Baru Lahir (Gizi)', color: '#ea580c', dot: '#ea580c', monthsVal: [0,0,0,0,0], target: 4000, actual: 0, pct: 0, status: 'Belum Ada Data', rows: [] },
  ptm: { title: 'Balita (PTM)', color: '#7c3aed', dot: '#7c3aed', monthsVal: [0,0,0,0,0], target: 8000, actual: 0, pct: 0, status: 'Belum Ada Data', rows: [] },
  tb: { title: 'Yang Terduga TB (TB & Paru)', color: '#dc2626', dot: '#dc2626', monthsVal: [0,0,0,0,0], target: 1000, actual: 0, pct: 0, status: 'Belum Ada Data', rows: [] }
};

// ===== RENDER BAR CHART =====
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
  document.querySelectorAll('.prog-card').forEach(c => { c.classList.remove('selected'); c.style.borderColor = 'transparent'; });
  el.classList.add('selected'); el.style.borderColor = 'currentColor';
  const key = el.id.replace('pc-', ''); const d = progData[key];
  if (!d) return;
  document.getElementById('detail-title').textContent = 'Detail Capaian — ' + d.title;
  document.getElementById('sum-target').textContent = d.target.toLocaleString('id-ID');
  document.getElementById('sum-actual').textContent = d.actual.toLocaleString('id-ID');
  document.getElementById('sum-pct').textContent = d.pct + '%';
  const sc = document.getElementById('sum-status'); sc.textContent = d.status;
  sc.style.color = d.pct >= 80 ? '#16a34a' : d.pct >= 40 ? '#d97706' : '#dc2626';
  const tbody = document.getElementById('detail-tbody');
  if (d.rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text3); padding: 24px;">Belum ada input data laporan.</td></tr>`;
  } else {
    tbody.innerHTML = d.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1].toLocaleString('id-ID')}</td><td>${r[2].toLocaleString('id-ID')}</td><td>${r[3]}%</td><td>${r[4]}</td></tr>`).join('');
  }
  renderChart(d.monthsVal, d.color, d.target);
}

// ===== LOGIKA MODAL =====
function openTaskModal() {
  const modal = document.getElementById('task-modal');
  if (modal) {
    document.getElementById('modal-title-text').textContent = 'Tambah Tugas Baru';
    document.getElementById('edit-task-id').value = '';
    document.getElementById('task-status').value = 'todo';
    document.getElementById('task-status').disabled = false;
    document.getElementById('opt-status-done').style.display = 'none';
    modal.style.display = 'flex';
    toggleReportFields();
  }
}

function closeTaskModal() {
  const modal = document.getElementById('task-modal');
  if (modal) modal.style.display = 'none';
  document.getElementById('task-form').reset();
}

function toggleReportFields() {
  const statusSelect = document.getElementById('task-status');
  const reportWrapper = document.getElementById('report-fields-wrapper');
  if (statusSelect && reportWrapper) {
    reportWrapper.style.display = statusSelect.value === 'done' ? 'block' : 'none';
  }
}

function openReportForTask(taskId) {
  const taskCard = document.getElementById(taskId);
  if (!taskCard) return;
  document.getElementById('modal-title-text').textContent = 'Selesaikan & Isi Laporan';
  document.getElementById('edit-task-id').value = taskId;
  document.getElementById('task-name').value = taskCard.querySelector('.task-card-title').textContent;
  document.getElementById('task-pic').value = taskCard.querySelector('.av').getAttribute('title');
  const statusSelect = document.getElementById('task-status');
  document.getElementById('opt-status-done').style.display = 'block';
  statusSelect.value = 'done';
  statusSelect.disabled = true;
  document.getElementById('task-modal').style.display = 'flex';
  toggleReportFields();
}

// ===== SIMPAN TUGAS & OTOMATISASI =====
function saveTask(event) {
  event.preventDefault();
  const taskIdToEdit = document.getElementById('edit-task-id').value;
  const taskName = document.getElementById('task-name').value;
  const taskPic = document.getElementById('task-pic').value;
  const statusValue = document.getElementById('task-status').value;
  const initials = taskPic.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

  if (taskIdToEdit) {
    const oldCard = document.getElementById(taskIdToEdit);
    if (oldCard) oldCard.remove();
  }
  const currentTaskId = taskIdToEdit || 'task-' + Date.now();

  // KONDISI A: BELUM MULAI / PROSES (DENGAN ATRIBUT WAKTU)
  if (statusValue === 'todo' || statusValue === 'progress') {
    const taskTime = document.getElementById('task-datetime').value;
    let targetColSelector = statusValue === 'todo' ? '#col-todo .task-list-container' : '#col-progress .task-list-container';
    
    const newTaskHTML = `
        <div class="task-card" id="${currentTaskId}" data-time="${taskTime}">
          <div class="prio-bar" style="background:${statusValue === 'progress' ? 'var(--orange)' : 'var(--amber)'}"><div style="width:100%;height:3px;background:currentColor;border-radius:3px"></div></div>
          <div class="task-card-title">${taskName}</div>
          <div class="task-card-meta">
            <span class="tag" style="${statusValue === 'todo' ? 'background:#f1f5f9;color:var(--text2)' : 'background:var(--blue-l);color:var(--blue-d)'}">${statusValue === 'todo' ? 'Belum Mulai' : 'Proses'}</span>
            <div class="assignee-list">
              <div class="av" style="background:var(--teal-l);color:var(--teal-d)" title="${taskPic}">${initials}</div>
            </div>
          </div>
          <div class="task-footer" style="margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border); font-size: 11px; color: var(--text3)">
            ${statusValue === 'todo' ? `<i class="ti ti-alarm"></i> Mulai: ${new Date(taskTime).toLocaleString('id-ID')}` : 
            `<span style="display:flex; justify-content:space-between; align-items:center;">
              <span><i class="ti ti-loader"></i> Sedang Dikerjakan</span>
              <button onclick="openReportForTask('${currentTaskId}')" style="background:var(--green-l); color:var(--green-d); border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-weight:700;">Selesaikan</button>
            </span>`}
          </div>
        </div>`;
    document.querySelector(targetColSelector).insertAdjacentHTML('beforeend', newTaskHTML);
  } 
  
  // KONDISI B: SELESAI & SINKRONISASI
  else if (statusValue === 'done') {
    const programKey = document.getElementById('task-program').value;
    const monthIndex = parseInt(document.getElementById('report-month').value);
    const actualVal = parseInt(document.getElementById('report-actual').value) || 0;
    const prog = progData[programKey];

    if (prog) {
      prog.actual += actualVal;
      prog.monthsVal[monthIndex] += actualVal;
      prog.pct = Math.round((prog.actual / prog.target) * 100);
      prog.status = prog.pct >= 80 ? 'On Track' : (prog.pct >= 50 ? 'Butuh Perhatian' : 'Kritis');
      const contributionPct = Math.round((actualVal / prog.target) * 100);
      prog.rows.push([`${taskName}`, prog.target, actualVal, contributionPct, 'Baik']);

      const doneHTML = `
        <div class="task-card">
          <div class="prio-bar" style="background:var(--green)"><div style="width:100%;height:3px;background:currentColor;border-radius:3px"></div></div>
          <div class="task-card-title">${taskName}</div>
          <div style="font-size:11px; color:var(--text2); margin-bottom:8px;">Capaian: +${actualVal.toLocaleString('id-ID')} (${contributionPct}%)</div>
          <div class="task-card-meta">
            <span class="tag" style="background:var(--green-l);color:var(--green-d)">Selesai</span>
            <div class="assignee-list"><div class="av" style="background:var(--teal-l);color:var(--teal-d)" title="${taskPic}">${initials}</div></div>
          </div>
        </div>`;
      document.querySelector('#col-done .task-list-container').insertAdjacentHTML('beforeend', doneHTML);
    }
  }
  updateKanbanStats(); closeTaskModal();
}

// ===== AUTOMATION =====
function checkTaskAutomation() {
  const now = new Date();
  document.querySelectorAll('#col-todo .task-card').forEach(card => {
    const startTimeStr = card.getAttribute('data-time');
    if (startTimeStr && now >= new Date(startTimeStr)) {
      moveTaskToProgress(card);
    }
  });
}

function moveTaskToProgress(card) {
  const progressContainer = document.querySelector('#col-progress .task-list-container');
  const tag = card.querySelector('.tag');
  const prioBar = card.querySelector('.prio-bar');
  if (tag) { tag.textContent = 'Proses'; tag.style.background = 'var(--blue-l)'; tag.style.color = 'var(--blue-d)'; }
  if (prioBar) prioBar.style.background = 'var(--orange)';
  
  card.querySelector('.task-footer').innerHTML = `
    <span style="display:flex; justify-content:space-between; align-items:center; width:100%;">
      <span><i class="ti ti-loader"></i> Sedang Dikerjakan</span>
      <button onclick="openReportForTask('${card.id}')" style="background:var(--green-l); color:var(--green-d); border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-weight:700;">Selesaikan</button>
    </span>`;
  progressContainer.appendChild(card);
  updateKanbanStats();
}
setInterval(checkTaskAutomation, 10000); // Cek setiap 10 detik

// ===== STATS & DASHBOARD =====
function updateKanbanStats() {
  const todo = document.querySelectorAll('#col-todo .task-card').length;
  const progress = document.querySelectorAll('#col-progress .task-card').length;
  const done = document.querySelectorAll('#col-done .task-card').length;
  
  document.getElementById('badge-tugas-total').textContent = todo + progress;
  document.getElementById('tugas-stats-text').textContent = `${todo + progress} aktif · ${done} selesai`;
  document.querySelector('#col-todo .col-count').textContent = todo;
  document.querySelector('#col-progress .col-count').textContent = progress;
  document.querySelector('#col-done .col-count').textContent = done;
  document.getElementById('dash-total-tugas').textContent = todo + progress + done;

  // Update Capaian Dash
  let totalPct = 0;
  for (let k in progData) {
    totalPct += progData[k].pct;
    const item = document.getElementById(`dash-prog-${k}`);
    if (item) {
        item.querySelector('.prog-pct-text').textContent = progData[k].pct + '%';
        item.querySelector('.prog-fill').style.width = progData[k].pct + '%';
    }
  }
  document.getElementById('dash-avg-capaian').textContent = Math.round(totalPct/5) + '%';
}

document.addEventListener("DOMContentLoaded", () => {
  updateKanbanStats();
  goPage('dash');
});
