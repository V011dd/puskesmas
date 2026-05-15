// ===== DATA AWAL 0% =====
let progData = {
    kia: { title: 'Ibu Hamil (KIA)', target: 6000, actual: 0, monthsVal: [0,0,0,0,0], color: '#16a34a', rows: [] },
    imun: { title: 'Ibu Bersalin', target: 5000, actual: 0, monthsVal: [0,0,0,0,0], color: '#2563eb', rows: [] },
    gizi: { title: 'Bayi Baru Lahir', target: 4000, actual: 0, monthsVal: [0,0,0,0,0], color: '#ea580c', rows: [] },
    ptm: { title: 'Balita (PTM)', target: 8000, actual: 0, monthsVal: [0,0,0,0,0], color: '#7c3aed', rows: [] },
    tb: { title: 'Yang Terduga TB', target: 1000, actual: 0, monthsVal: [0,0,0,0,0], color: '#dc2626', rows: [] }
};

// ===== NAVIGASI =====
function goPage(p) {
    document.querySelectorAll('.page').forEach(pg => pg.classList.remove('active'));
    document.getElementById('page-' + p).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(ni => ni.classList.remove('active'));
    document.getElementById('nav-' + p).classList.add('active');
    document.getElementById('page-title').textContent = titles[p];
    if(p === 'eval') updateEvalCards();
}

// ===== MODAL LOGIC =====
function openTaskModal() {
    document.getElementById('task-modal').style.display = 'flex';
    document.getElementById('report-fields-wrapper').style.display = 'none';
    document.getElementById('edit-task-id').value = '';
    document.getElementById('btn-save').textContent = 'Simpan Tugas';
    document.getElementById('task-form').reset();
    document.getElementById('base-fields').style.display = 'block';
}

function openReportForTask(taskId) {
    const card = document.getElementById(taskId);
    document.getElementById('task-modal').style.display = 'flex';
    document.getElementById('report-fields-wrapper').style.display = 'block';
    document.getElementById('base-fields').style.display = 'none'; // Sembunyikan input nama/waktu
    document.getElementById('edit-task-id').value = taskId;
    document.getElementById('btn-save').textContent = 'Selesaikan & Sinkronkan';
    document.getElementById('task-name').value = card.dataset.name;
    document.getElementById('task-pic').value = card.dataset.pic;
}

function closeTaskModal() {
    document.getElementById('task-modal').style.display = 'none';
}

function toggleReportFields() {
    // Digunakan jika status manual diaktifkan
}

// ===== CORE LOGIC: SIMPAN & OTOMATISASI =====
function saveTask(event) {
    event.preventDefault();
    const taskId = document.getElementById('edit-task-id').value;
    const isFinishing = taskId !== '';

    if (!isFinishing) {
        // TAMBAH TUGAS BARU (BELUM MULAI)
        const name = document.getElementById('task-name').value;
        const time = document.getElementById('task-datetime').value;
        const pic = document.getElementById('task-pic').value;
        const id = 'task-' + Date.now();

        const html = `
            <div class="task-card" id="${id}" data-name="${name}" data-time="${time}" data-pic="${pic}">
                <div class="task-card-title">${name}</div>
                <div style="font-size:11px; color:var(--text3); margin-bottom:8px;">PIC: ${pic}</div>
                <div style="font-size:10px; background:#f1f5f9; padding:5px; border-radius:5px;">
                    <i class="ti ti-alarm"></i> Jadwal: ${new Date(time).toLocaleString('id-ID')}
                </div>
            </div>`;
        document.querySelector('#col-todo .task-list-container').insertAdjacentHTML('beforeend', html);
    } else {
        // SELESAIKAN TUGAS (INPUT LAPORAN)
        const progKey = document.getElementById('task-program').value;
        const monthIdx = document.getElementById('report-month').value;
        const actual = parseInt(document.getElementById('report-actual').value) || 0;
        const fileInput = document.getElementById('report-file');
        const fileName = fileInput.files[0] ? fileInput.files[0].name : null;

        // Akumulasi Data
        const prog = progData[progKey];
        prog.actual += actual;
        prog.monthsVal[monthIdx] += actual;
        const totalPct = Math.round((prog.actual / prog.target) * 100);
        prog.pct = totalPct;
        prog.status = totalPct >= 80 ? 'Baik' : (totalPct >= 40 ? 'Cukup' : 'Rendah');
        prog.rows.push([`Laporan ${document.getElementById('task-name').value}`, prog.target, actual, Math.round((actual/prog.target)*100), 'ok']);

        // Pindah ke Kolom Selesai
        const card = document.getElementById(taskId);
        const html = `
            <div class="task-card" style="border-left:4px solid var(--green)">
                <div class="task-card-title">${card.dataset.name}</div>
                <div style="font-size:11px; color:var(--green-d)">Realisasi: +${actual} (${prog.pct}%)</div>
                ${fileName ? `<div style="font-size:10px; color:var(--blue); margin-top:5px;"><i class="ti ti-paperclip"></i> ${fileName}</div>` : ''}
            </div>`;
        document.querySelector('#col-done .task-list-container').insertAdjacentHTML('beforeend', html);
        card.remove();
    }

    updateStats();
    closeTaskModal();
}

// ===== OTOMATISASI PINDAH KOLOM (SETIAP 10 DETIK) =====
function autoMoveTasks() {
    const now = new Date();
    document.querySelectorAll('#col-todo .task-card').forEach(card => {
        const taskTime = new Date(card.dataset.time);
        if (now >= taskTime) {
            // Pindah ke Sedang Dikerjakan
            const container = document.querySelector('#col-progress .task-list-container');
            card.style.borderLeft = "4px solid var(--blue)";
            const btnHtml = `<button onclick="openReportForTask('${card.id}')" style="margin-top:10px; width:100%; background:var(--green); color:#fff; border:none; padding:5px; border-radius:5px; cursor:pointer; font-weight:700;">Selesaikan</button>`;
            card.insertAdjacentHTML('beforeend', btnHtml);
            container.appendChild(card);
            updateStats();
        }
    });
}
setInterval(autoMoveTasks, 10000);

// ===== UI UPDATES =====
function updateStats() {
    const todo = document.querySelectorAll('#col-todo .task-card').length;
    const prog = document.querySelectorAll('#col-progress .task-card').length;
    const done = document.querySelectorAll('#col-done .task-card').length;

    document.getElementById('badge-tugas-total').textContent = todo + prog;
    document.getElementById('dash-total-tugas').textContent = todo + prog + done;
    document.getElementById('tugas-stats-text').textContent = `${todo + prog} tugas aktif · ${done} selesai`;
    
    // Update Dashboard Capaian List
    let totalPct = 0;
    let listHtml = '';
    for (let k in progData) {
        totalPct += progData[k].pct;
        listHtml += `
            <div class="prog-item">
                <div class="prog-header"><span>${progData[k].title}</span><span>${progData[k].pct}%</span></div>
                <div class="prog-bar"><div class="prog-fill" style="width:${progData[k].pct}%; background:${progData[k].color}"></div></div>
            </div>`;
    }
    document.getElementById('dash-capaian-list').innerHTML = listHtml;
    document.getElementById('dash-avg-capaian').textContent = Math.round(totalPct/5) + '%';
    
    // Update Dashboard Task List
    const activeTasks = Array.from(document.querySelectorAll('#col-todo .task-card, #col-progress .task-card'));
    document.getElementById('dash-active-tasks-list').innerHTML = activeTasks.length ? 
        activeTasks.map(t => `<div style="padding:10px; border-bottom:1px solid #eee; font-size:12px;"><strong>${t.dataset.name}</strong> - ${t.dataset.pic}</div>`).join('') :
        "Belum ada tugas aktif.";
}

function updateEvalCards() {
    let html = '';
    for (let k in progData) {
        html += `
            <div class="prog-card" id="pc-${k}" onclick="selectProg(this)" style="background:var(--bg); border:1px solid #eee; padding:15px; border-radius:12px; cursor:pointer;">
                <div style="font-weight:800">${progData[k].title}</div>
                <div style="font-size:24px; font-weight:800; margin:10px 0;">${progData[k].pct}%</div>
                <div class="prog-card-mini">Terakumulasi: ${progData[k].actual}</div>
            </div>`;
    }
    document.getElementById('eval-cards-container').innerHTML = html;
}

function selectProg(el) {
    const key = el.id.replace('pc-', '');
    const d = progData[key];
    document.getElementById('detail-title').textContent = d.title;
    document.getElementById('sum-target').textContent = d.target;
    document.getElementById('sum-actual').textContent = d.actual;
    document.getElementById('sum-pct').textContent = d.pct + '%';
    document.getElementById('sum-status').textContent = d.status;
    
    document.getElementById('detail-tbody').innerHTML = d.rows.length ? 
        d.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}%</td><td>${r[4]}</td></tr>`).join('') :
        `<tr><td colspan="5" style="text-align:center">Belum ada data</td></tr>`;
    
    // Render Chart (Simulasi bar sederhana)
    renderChart(d.monthsVal, d.color, d.target);
}

function renderChart(vals, color, target) {
    const container = document.getElementById('mini-chart');
    container.innerHTML = vals.map((v, i) => {
        const p = Math.round((v/target)*100);
        return `<div style="display:inline-block; width:15%; margin:2%; vertical-align:bottom;">
            <div style="font-size:9px; text-align:center">${p}%</div>
            <div style="background:${color}; height:${p*2}px; border-radius:3px;"></div>
            <div style="font-size:9px; text-align:center">${['J','F','M','A','M'][i]}</div>
        </div>`;
    }).join('');
}

const titles = { dash: 'Dashboard', tugas: 'Manajemen Tugas', eval: 'Evaluasi Capaian Program' };
document.addEventListener("DOMContentLoaded", updateStats);
