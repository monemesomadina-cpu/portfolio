// ====== Mock Data ======
const visitsData = {
  labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  datasets: [
    { label: "Organic", data: [420, 560, 480, 700, 650, 900, 1200], borderColor: "#4f46e5", backgroundColor: createGradient('#4f46e5'), tension: 0.35, fill: true, pointRadius:3 },
    { label: "Paid", data: [200, 240, 220, 280, 300, 340, 380], borderColor: "#9333ea", backgroundColor: createGradient('#9333ea', 0.08), tension: 0.35, fill: true, pointRadius:3 }
  ]
};

const revenueData = {
  labels: ["Direct","Search","Social","Referrals"],
  datasets: [{
    label: "Revenue",
    data: [5600, 4200, 2100, 1500],
    backgroundColor: ["#4f46e5","#9333ea","#60a5fa","#34d399"],
    hoverOffset: 8
  }]
};

const topProjects = [
  { name: "Landing Rebuild", progress: "85%" },
  { name: "E-commerce Revamp", progress: "62%" },
  { name: "Analytics Dashboard", progress: "44%" },
  { name: "Design System", progress: "22%" }
];

const transactions = [
  { client:"Acme Corp", project:"Landing Rebuild", amount:"$3,200", date:"2025-10-10", status:"Paid" },
  { client:"BlueCo", project:"E-commerce Revamp", amount:"$8,500", date:"2025-10-08", status:"Pending" },
  { client:"Nexa", project:"Analytics Dashboard", amount:"$1,600", date:"2025-10-07", status:"Failed" },
  { client:"Orbit", project:"Design System", amount:"$4,400", date:"2025-10-02", status:"Paid" }
];

const activity = [
  "Deployed v1.3 to production",
  "Added new analytics chart for sessions",
  "Completed QA for Landing Rebuild",
  "Onboarded client BlueCo"
];


// ====== Helpers ======
function createGradient(color, alpha = 0.14){
  // Chart.js gradient placeholder - return color for dataset; actual gradients assigned later
  return color;
}

// Utility to format status badge
function statusClass(status){
  if(status.toLowerCase() === "paid") return 'background: #10b981; color:white;';
  if(status.toLowerCase() === "pending") return 'background: #f59e0b; color:white;';
  return 'background: #ef4444; color:white;';
}

// ====== Mount lists & tables ======
function mountTopProjects(){
  const el = document.getElementById('topProjects');
  topProjects.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${p.name}</strong><span style="font-weight:700;color:#374151">${p.progress}</span>`;
    el.appendChild(li);
  });
}

function mountTransactions(){
  const tbody = document.getElementById('transactionsBody');
  transactions.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.client}</td>
      <td>${t.project}</td>
      <td>${t.amount}</td>
      <td>${t.date}</td>
      <td><span class="status" style="${statusClass(t.status)}">${t.status}</span></td>
      <td>
        ${actionButtonsForStatus(t.status)}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Return action buttons HTML depending on status
function actionButtonsForStatus(status){
  if(status.toLowerCase() === 'paid'){
    return `<button class="btn-ghost" onclick="viewTransaction(this)">View</button> <button class="btn-ghost" onclick="refundTransaction(this)">Refund</button>`;
  }
  if(status.toLowerCase() === 'pending'){
    return `<button class="btn-primary" onclick="confirmTransaction(this)">Confirm</button> <button class="btn-ghost" onclick="viewTransaction(this)">View</button>`;
  }
  // failed
  return `<button class="btn-primary" onclick="retryTransaction(this)">Retry</button> <button class="btn-ghost" onclick="viewTransaction(this)">View</button>`;
}

function mountActivity(){
  const feed = document.getElementById('activityFeed');
  activity.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="dot"></div><div><strong style="font-size:14px">${a}</strong><div style="color:#6b7280;font-size:13px;margin-top:4px">Just now</div></div>`;
    feed.appendChild(li);
  });
}


// ====== Charts ======
function initCharts(){
  // Visits line chart
  const visitsCtx = document.getElementById('visitsChart').getContext('2d');
  const grad1 = visitsCtx.createLinearGradient(0,0,0,250);
  grad1.addColorStop(0, 'rgba(79,70,229,0.28)');
  grad1.addColorStop(1, 'rgba(79,70,229,0.03)');
  const grad2 = visitsCtx.createLinearGradient(0,0,0,250);
  grad2.addColorStop(0, 'rgba(147,51,234,0.22)');
  grad2.addColorStop(1, 'rgba(147,51,234,0.02)');

  const visitsChart = new Chart(visitsCtx, {
    type: 'line',
    data: {
      labels: visitsData.labels,
      datasets: [
        { label:'Organic', data: visitsData.datasets[0].data, borderColor:'#4f46e5', backgroundColor:grad1, fill:true, tension:0.36, pointRadius:3 },
        { label:'Paid', data: visitsData.datasets[1].data, borderColor:'#9333ea', backgroundColor:grad2, fill:true, tension:0.36, pointRadius:3 }
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'top' } },
      scales:{
        x:{ grid:{ display:false } },
        y:{ grid:{ color:'rgba(15,23,42,0.04)' } }
      }
    }
  });

  // Revenue doughnut
  const revCtx = document.getElementById('revenueChart').getContext('2d');
  new Chart(revCtx, {
    type:'doughnut',
    data: revenueData,
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'bottom' } },
      cutout:'65%'
    }
  });
}


// ====== Init on DOM ready ======
document.addEventListener('DOMContentLoaded', () => {
  mountTopProjects();
  mountTransactions();
  mountActivity();
  initCharts();
  initBTC();

  // Tiny search behavior (filter transactions by client/project)
  const search = document.getElementById('globalSearch');
  search.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#transactionsBody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  });

  // Collapse sidebar (small UI nicety)
  const collapseBtn = document.getElementById('collapseBtn');
  collapseBtn && collapseBtn.addEventListener('click', () => {
    const sb = document.querySelector('.sidebar');
    if(sb.style.display === 'none') sb.style.display = '';
    else sb.style.display = 'none';
  });

  // Notifications dropdown
  const notif = document.querySelector('.notifications');
  const dropdown = document.getElementById('notificationsDropdown');
  notif && notif.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
  });
  // dismiss dropdown on outside click
  document.addEventListener('click', () => { if(dropdown) dropdown.style.display = 'none'; });

  // Modal wiring
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalPrimary = document.getElementById('modalPrimary');
  modalClose && modalClose.addEventListener('click', closeModal);
  modalBackdrop && modalBackdrop.addEventListener('click', (e) => { if(e.target === modalBackdrop) closeModal(); });
  modalPrimary && modalPrimary.addEventListener('click', () => {
    // default confirm action: mark selected transaction as Paid
    const selected = modalBackdrop.dataset.selectedIndex;
    if(selected){
      const idx = Number(selected);
      transactions[idx].status = 'Paid';
      refreshTransactions();
      closeModal();
    }
  });
});

// ===== BTC realtime integration (optimized)
let btcPrices = []; // rolling buffer of {t,v}
let btcChart = null;
let btcSpark = null;
let btcPriceEl = null, btcChangeEl = null;
let _btcPendingUpdate = false;
const BTC_UPDATE_THROTTLE_MS = 300; // batch updates to reduce redraws
const BTC_MAX_POINTS = 120;

// Reconnect/backoff settings for Binance WS
const WS_MAX_RETRIES = 5;
let wsRetryCount = 0;
let wsInstance = null;
let coinGeckoTimer = null;

function initBTC(){
  // cache DOM handles
  btcPriceEl = document.getElementById('btcPrice');
  btcChangeEl = document.getElementById('btcChange');
  setupSparkline();
  setupBtcChart();
  // try websocket with reconnect/backoff; if retries exhausted, use polling fallback
  connectBinanceWS();
}

function setupSparkline(){
  if(btcSpark) return; // reuse
  const el = document.getElementById('btcSparkline');
  if(!el) return;
  const ctx = el.getContext('2d');
  btcSpark = new Chart(ctx, {
    type: 'line',
    data: { labels: [], datasets: [{ data: [], borderColor: '#00d1ff', borderWidth: 1.5, pointRadius:0, fill:false }] },
    options: { responsive:false, animation:false, plugins:{legend:{display:false}}, scales:{ x:{display:false}, y:{display:false} }, elements:{line:{tension:0.3}} }
  });
}

function setupBtcChart(){
  if(btcChart) return;
  const el = document.getElementById('btcChart');
  if(!el) return;
  const ctx = el.getContext('2d');
  btcChart = new Chart(ctx, {
    type: 'line',
    data: { labels: [], datasets: [{ label:'BTC/USDT', data: [], borderColor:'#00d1ff', backgroundColor:'rgba(0,209,255,0.06)', fill:true, tension:0.2 }] },
    options: { responsive:true, maintainAspectRatio:false, animation:false, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(255,255,255,0.02)' } } } }
  });
}

function connectBinanceWS(){
  // clear any polling while ws attempts
  if(coinGeckoTimer){ clearInterval(coinGeckoTimer); coinGeckoTimer = null; }
  const url = 'wss://stream.binance.com:9443/ws/btcusdt@trade';
  try {
    wsInstance = new WebSocket(url);
  } catch(e){
    console.warn('WebSocket constructor failed:', e);
    scheduleFallback();
    return;
  }

  let opened = false;
  wsInstance.addEventListener('open', () => {
    opened = true; wsRetryCount = 0; console.log('Binance WS open');
  });
  wsInstance.addEventListener('message', ev => {
    try{
      const d = JSON.parse(ev.data);
      if(d && d.p){ pushBtcPrice(Number(d.p)); }
    }catch(e){ /* ignore malformed messages */ }
  });
  wsInstance.addEventListener('close', (ev) => {
    console.warn('Binance WS closed', ev);
    handleWsClose();
  });
  wsInstance.addEventListener('error', (err) => {
    console.warn('Binance WS error', err);
    try{ wsInstance.close(); }catch(e){}
    handleWsClose();
  });

  // if not opened within timeout, treat as failure
  setTimeout(() => { if(!opened){ try{ wsInstance.close(); }catch(e){} handleWsClose(); } }, 4000);
}

function handleWsClose(){
  wsRetryCount++;
  if(wsRetryCount <= WS_MAX_RETRIES){
    // exponential backoff with jitter
    const delay = Math.min(1000 * Math.pow(2, wsRetryCount), 15000) + Math.floor(Math.random()*500);
    console.log('Reconnecting Binance WS in', delay, 'ms');
    setTimeout(connectBinanceWS, delay);
  } else {
    console.warn('WS retries exceeded, starting CoinGecko polling fallback');
    scheduleFallback();
  }
}

function scheduleFallback(){
  if(coinGeckoTimer) return; // already polling
  fetchCoinGecko();
  coinGeckoTimer = setInterval(fetchCoinGecko, 15000); // 15s friendly polling
}

async function fetchCoinGecko(){
  try{
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    const j = await res.json();
    const price = j.bitcoin.usd;
    const change = j.bitcoin.usd_24h_change;
    // update widget immediately and push to buffer
    updateBtcWidget(price, change);
    pushBtcPrice(price);
  }catch(e){ console.warn('CoinGecko fetch failed', e); }
}

// Throttled push: schedule one batched UI update
function pushBtcPrice(price){
  const now = Date.now();
  btcPrices.push({ t: now, v: price });
  if(btcPrices.length > BTC_MAX_POINTS) btcPrices.shift();
  if(!_btcPendingUpdate){
    _btcPendingUpdate = true;
    setTimeout(processBtcUpdates, BTC_UPDATE_THROTTLE_MS);
  }
}

function processBtcUpdates(){
  _btcPendingUpdate = false;
  if(btcPrices.length === 0) return;
  const latest = btcPrices[btcPrices.length-1].v;
  // compute change from first value in buffer
  const first = btcPrices[0].v;
  const change = ((latest - first) / first) * 100;
  updateBtcWidget(latest, change);

  // update sparkline dataset once
  if(btcSpark){
    const data = btcPrices.map(p => p.v);
    btcSpark.data.labels = data.map((_,i)=>i);
    btcSpark.data.datasets[0].data = data;
    btcSpark.update('none');
  }

  // update larger chart
  if(btcChart){
    const labels = btcPrices.map(p => new Date(p.t).toLocaleTimeString());
    const data = btcPrices.map(p => p.v);
    btcChart.data.labels = labels;
    btcChart.data.datasets[0].data = data;
    btcChart.update('none');
  }
}

function updateBtcWidget(price, change=null){
  if(btcPriceEl) btcPriceEl.textContent = '$' + Number(price).toLocaleString(undefined, {maximumFractionDigits:2});
  if(btcChangeEl){
    const sign = change >= 0 ? '+' : '';
    btcChangeEl.textContent = `${sign}${Number(change || 0).toFixed(2)}%`;
    btcChangeEl.style.background = (change >= 0) ? 'rgba(0,209,102,0.12)' : 'rgba(255,92,124,0.12)';
    btcChangeEl.style.color = (change >= 0) ? 'var(--success)' : 'var(--danger)';
  }
}

// Helpers to open/close modal and refresh table
function openModal(title, bodyHtml, idx){
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  modalBackdrop.style.display = 'flex';
  modalBackdrop.dataset.selectedIndex = typeof idx === 'number' ? String(idx) : '';
}

function closeModal(){
  const modalBackdrop = document.getElementById('modalBackdrop');
  modalBackdrop.style.display = 'none';
  modalBackdrop.dataset.selectedIndex = '';
}

function refreshTransactions(){
  const tbody = document.getElementById('transactionsBody');
  tbody.innerHTML = '';
  mountTransactions();
}

// Button actions (called via inline onclick to keep wiring simple)
function viewTransaction(btn){
  const tr = btn.closest('tr');
  const idx = Array.from(document.querySelectorAll('#transactionsBody tr')).indexOf(tr);
  const t = transactions[idx];
  openModal('Transaction details', `<p><strong>Client:</strong> ${t.client}</p><p><strong>Project:</strong> ${t.project}</p><p><strong>Amount:</strong> ${t.amount}</p><p><strong>Date:</strong> ${t.date}</p><p><strong>Status:</strong> ${t.status}</p>`, idx);
}

function confirmTransaction(btn){
  const tr = btn.closest('tr');
  const idx = Array.from(document.querySelectorAll('#transactionsBody tr')).indexOf(tr);
  transactions[idx].status = 'Paid';
  refreshTransactions();
}

function retryTransaction(btn){
  const tr = btn.closest('tr');
  const idx = Array.from(document.querySelectorAll('#transactionsBody tr')).indexOf(tr);
  // simulate retry success
  transactions[idx].status = 'Pending';
  refreshTransactions();
}

function refundTransaction(btn){
  const tr = btn.closest('tr');
  const idx = Array.from(document.querySelectorAll('#transactionsBody tr')).indexOf(tr);
  transactions[idx].status = 'Failed';
  refreshTransactions();
}
