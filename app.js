const icons = {
  dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m3 10v-3a6 6 0 0 0-2-4"/>',
  briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12c6 3 12 3 18 0M12 12v4"/>',
  check:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/>',
  chart:'<path d="M4 3v18h18M8 16v-5m5 5V6m5 10V9"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3c-1 0-1 1-1 2m0 3h.01"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-14 5h2m3 0h2m3 0h1"/>',
  wallet:'<rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 7V4h15v2m3 6h-6v5h6m-3-2.5h.01"/>',
  activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  filter:'<path d="M4 5h16l-6 7v7l-4 2v-9z"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>'
};
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[el.dataset.icon] || ''}</svg>`; });

const seedDeals = [
  {name:'Enterprise plan',company:'Linear',contact:'Olivia Rhye',value:8400,stage:'Negotiation',owner:'JD',mark:'◒',color:'#5e65b8',bg:'#eeeffb'},
  {name:'Annual subscription',company:'Notion',contact:'Phoenix Baker',value:6200,stage:'Won',owner:'AL',mark:'N',color:'#343c4d',bg:'#f2f3f5'},
  {name:'Growth package',company:'Figma',contact:'Lana Steiner',value:4800,stage:'Proposal',owner:'JD',mark:'F',color:'#b77d8e',bg:'#fdf0f3'},
  {name:'Team expansion',company:'Vercel',contact:'Demi Wilkinson',value:12500,stage:'Qualified',owner:'MK',mark:'▲',color:'#525b70',bg:'#f1f3f7'},
  {name:'Business plan',company:'Loom',contact:'Drew Cano',value:3600,stage:'Won',owner:'AL',mark:'✳',color:'#8a7acb',bg:'#f4effc'},
  {name:'Platform partnership',company:'Stripe',contact:'Natali Craig',value:9800,stage:'Proposal',owner:'MK',mark:'S',color:'#7e8cca',bg:'#eff1ff'}
];
const stages = ['Qualified','Proposal','Negotiation','Won'];
const tasks = [
  {title:'Follow up with Olivia Rhye',detail:'Linear · Enterprise plan',time:'10:30 AM'},
  {title:'Send proposal to Figma',detail:'Lana Steiner · Growth package',time:'12:00 PM'},
  {title:'Review the Q4 sales pipeline',detail:'Weekly team review',time:'2:00 PM'},
  {title:'Prepare the monthly report',detail:'Sales performance',time:'4:30 PM'}
];
function readStored(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { toast('Your changes are available for this session only.'); } }
const storedDeals = readStored('mql-demo-deals-v1', []);
const additions = Array.isArray(storedDeals) ? storedDeals.filter(d => d && ['name','company','contact'].every(k => typeof d[k] === 'string') && Number.isFinite(d.value) && d.value >= 0 && stages.includes(d.stage)).map(d => ({...d,owner:'JD',mark:d.company.slice(0,1).toUpperCase(),color:'#6e82be',bg:'#edf1fc'})) : [];
let deals = [...additions,...seedDeals];
const storedTasks = readStored('mql-demo-tasks-v1', []);
let completed = new Set(Array.isArray(storedTasks) ? storedTasks.filter(n => Number.isInteger(n) && n >= 0 && n < tasks.length) : []);
let currentView = 'overview';
let toastTimer;
const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(message) { $('toast').textContent = message; $('toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 3600); }
function visibleDeals() { const q = $('search').value.trim().toLowerCase(); const stage = $('status').value; return deals.filter(d => (!q || `${d.name} ${d.company} ${d.contact}`.toLowerCase().includes(q)) && (stage === 'all' || d.stage === stage)); }
function renderDeals() {
  const filtered = visibleDeals();
  $('record-count').textContent = filtered.length;
  $('deal-rows').innerHTML = filtered.map(d => `<tr><td><div class="company-cell"><span class="company-logo" style="background:${d.bg};color:${d.color}">${escapeHTML(d.mark)}</span><div><strong>${escapeHTML(currentView === 'contacts' ? d.company : d.name)}</strong><small>${escapeHTML(currentView === 'contacts' ? d.name : d.company)}</small></div></div></td><td>${escapeHTML(d.contact)}</td><td class="deal-value">${money(d.value)}</td><td><span class="stage ${d.stage.toLowerCase()}">${d.stage}</span></td><td><span class="avatar blue owner" title="${{JD:'Jamie Davis',AL:'Alex Lee',MK:'Morgan Kim'}[d.owner]}">${d.owner}</span></td></tr>`).join('') || '<tr><td colspan="5" class="empty">No matching records. Try another search or stage.</td></tr>';
  $('table-summary').textContent = `Showing ${filtered.length} of ${deals.length} ${currentView === 'contacts' ? 'contacts' : 'deals'}`;
  document.querySelector('[data-view="contacts"] .nav-count').textContent = deals.length;
}
function renderTasks() {
  $('task-list').innerHTML = tasks.map((t,i) => `<label class="task"><input type="checkbox" data-task="${i}" ${completed.has(i) ? 'checked' : ''} aria-label="Complete ${t.title}"><span><strong>${t.title}</strong><small>${t.detail}</small><small><b>${t.time}</b></small></span><span class="task-marker" aria-hidden="true"></span></label>`).join('');
  document.querySelectorAll('.task-count').forEach(el => el.textContent = tasks.length-completed.size);
  $('task-progress').textContent = `${completed.size} of ${tasks.length} tasks completed`;
  $('task-progress-bar').style.width = `${completed.size / tasks.length * 100}%`;
}
const periodData = {
  month:{revenue:48290,contacts:1248,deals:86,conversion:24.8,target:60000,label:'October',title:'Monthly target',labels:['Oct 1','Oct 5','Oct 10','Oct 15','Oct 20','Oct 25','Oct 31'],series:[26,31,29,41,38,63,50,53,39,65,57,74,65],targetSeries:[20,26,23,31,52,37,61,66,50,47,66,59,68]},
  quarter:{revenue:144870,contacts:3744,deals:258,conversion:25.3,target:180000,label:'Q4 2026',title:'Quarterly target',labels:['Oct 1','Oct 15','Nov 1','Nov 15','Dec 1','Dec 15','Dec 31'],series:[22,32,41,35,53,48,60,54,69,59,73,77,82],targetSeries:[20,25,30,35,40,45,50,55,60,65,70,75,80]},
  year:{revenue:579480,contacts:14976,deals:1032,conversion:26.1,target:720000,label:'2026',title:'Annual target',labels:['Jan','Mar','May','Jul','Sep','Nov','Dec'],series:[16,25,33,29,40,52,43,62,57,70,67,82,91],targetSeries:[20,25,31,36,42,47,53,59,65,71,78,83,90]}
};
function drawChart(data) {
  const plot = values => values.map((n,i) => `${52+i*39.5},${184-n*1.65}`).join(' ');
  const points = plot(data.series);
  const factor = $('period').value === 'year' ? 12 : $('period').value === 'quarter' ? 3 : 1;
  $('revenue-chart').innerHTML = `<svg viewBox="0 0 550 221" role="img" aria-label="${data.label} illustrative revenue and target trend"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#91a6fc" stop-opacity=".18"/><stop offset="100%" stop-color="#91a6fc" stop-opacity="0"/></linearGradient></defs>${[0,1,2,3,4].map(i=>`<line x1="48" x2="530" y1="${20+i*41}" y2="${20+i*41}" class="chart-grid"/><text x="4" y="${24+i*41}">$${(4-i)*15*factor}k</text>`).join('')}<polygon points="52,184 ${points} 526,184" fill="url(#area)"/><polyline points="${plot(data.targetSeries)}" class="target-line"/><polyline points="${points}" class="revenue-line"/>${data.labels.map((l,i)=>`<text x="${52+i*79}" y="212" text-anchor="${i===0?'start':i===6?'end':'middle'}">${l}</text>`).join('')}<circle cx="368" cy="${184-data.series[8]*1.65}" r="4" fill="#5877eb" stroke="white" stroke-width="2"/></svg>`;
}
function renderPeriod() {
  const d = periodData[$('period').value];
  $('revenue-value').innerHTML = `${money(d.revenue)}<span>.00</span>`;
  $('contacts-value').textContent = d.contacts.toLocaleString('en-US');
  $('deals-value').textContent = d.deals.toLocaleString('en-US');
  $('conversion-value').innerHTML = `${d.conversion}<span>%</span>`;
  $('chart-total').textContent = `${money(d.revenue)}.00`;
  $('target-period').textContent = d.label;
  document.querySelector('.target-panel h2').textContent = d.title;
  $('target-revenue').textContent = money(d.revenue);
  $('target-goal').textContent = money(d.target);
  $('target-remaining').textContent = money(d.target-d.revenue);
  drawChart(d);
}
const views = {overview:['Sales overview','Welcome back, Jamie. Let’s make today a productive one.'],contacts:['Contacts','The people behind your next opportunity.'],deals:['Sales pipeline','Every conversation is a step toward your next win.'],tasks:['Your tasks','A clear view of what needs your attention today.'],reports:['Sales performance','Understand your progress and plan what comes next.']};
function navigate() {
  currentView = location.hash.slice(1) in views ? location.hash.slice(1) : 'overview';
  document.body.dataset.view = currentView;
  const [title,subtitle] = views[currentView];
  $('page-title').innerHTML = `${title}<span class="title-dot">.</span>`;
  $('page-subtitle').textContent = subtitle;
  $('breadcrumb-name').textContent = {overview:'Overview',contacts:'Contacts',deals:'Deals',tasks:'Tasks',reports:'Reports'}[currentView];
  document.title = `MQL Dashboard · ${title}`;
  document.querySelectorAll('[data-view]').forEach(a => { const active = a.dataset.view === currentView; a.classList.toggle('active',active); if(active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  $('table-title').firstChild.textContent = (currentView === 'contacts' ? 'All contacts ' : currentView === 'deals' ? 'All deals ' : 'Recent deals ');
  $('name-heading').textContent = currentView === 'contacts' ? 'Company / Deal' : 'Deal / Company';
  $('view-all').hidden = currentView !== 'overview';
  $('sidebar').classList.remove('open'); $('menu-toggle').setAttribute('aria-expanded','false');
  renderDeals();
}
$('search').addEventListener('input',renderDeals);
$('status').addEventListener('change',renderDeals);
$('period').addEventListener('change',renderPeriod);
window.addEventListener('hashchange',navigate);
$('menu-toggle').addEventListener('click',() => { const open = $('sidebar').classList.toggle('open'); $('menu-toggle').setAttribute('aria-expanded',String(open)); });
document.addEventListener('click',e => { if(!$('sidebar').contains(e.target) && !$('menu-toggle').contains(e.target)) { $('sidebar').classList.remove('open'); $('menu-toggle').setAttribute('aria-expanded','false'); } });
document.addEventListener('keydown',e => { if(e.key === 'Escape') { $('sidebar').classList.remove('open'); $('menu-toggle').setAttribute('aria-expanded','false'); } });
$('task-list').addEventListener('change',e => { const i = Number(e.target.dataset.task); if(e.target.checked) completed.add(i); else completed.delete(i); save('mql-demo-tasks-v1',[...completed]); renderTasks(); });
$('add-deal').addEventListener('click',() => $('deal-dialog').showModal());
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click',() => $(button.dataset.close).close()));
$('deal-form').addEventListener('submit',e => {
  e.preventDefault(); const form = new FormData(e.target);
  const name = form.get('name').trim(), company = form.get('company').trim(), contact = form.get('contact').trim();
  if(!name || !company || !contact) { toast('Please enter a deal, company, and contact name.'); return; }
  const deal = {name,company,contact,value:Number(form.get('value')),stage:form.get('stage'),owner:'JD',mark:company.slice(0,1).toUpperCase(),color:'#6e82be',bg:'#edf1fc'};
  additions.unshift(deal); deals = [...additions,...seedDeals]; save('mql-demo-deals-v1',additions);
  $('search').value=''; $('status').value='all'; renderDeals(); $('deal-dialog').close(); e.target.reset(); location.hash='deals'; toast('Deal created. Your next opportunity is ready.');
});
function info(title, html) { $('info-title').textContent=title; $('info-content').innerHTML=html; $('info-dialog').showModal(); }
$('help').addEventListener('click',() => info('Your workspace, at a glance','<p>Use <strong>Overview</strong> for the big picture, <strong>Contacts</strong> to find people, and <strong>Deals</strong> to track opportunities.</p><p>Change the reporting period, search or filter deals, check off tasks, and export a CSV report. Add a deal with the blue button.</p><p>This is an interactive design demo. Analytics are illustrative sample data; new deals and task progress are saved only in this browser. No live CRM or authentication is connected.</p>'));
$('notifications').addEventListener('click',() => info('Your updates','<p><strong>Monthly sales snapshot</strong><br>Your demo workspace has reached 80.5% of its revenue target.</p><p><strong>Today’s priorities</strong><br>'+ (tasks.length-completed.size) +' tasks are waiting in your task list.</p><p>These are sample workspace updates.</p>'));
function csvCell(value) { const text=String(value); const safe=/^[=+@\-\t\r]/.test(text) ? "'"+text : text; return '"'+safe.replaceAll('"','""')+'"'; }
$('export').addEventListener('click',() => {
  const d=periodData[$('period').value];
  let rows;
  if(currentView==='reports') rows=[['Period','Revenue','Contacts','Deals closed','Conversion rate','Target'],[d.label,d.revenue,d.contacts,d.deals,d.conversion+'%',d.target]];
  else if(currentView==='tasks') rows=[['Task','Details','Time','Completed'],...tasks.map((t,i)=>[t.title,t.detail,t.time,completed.has(i)?'Yes':'No'])];
  else rows=[['Deal','Company','Contact','Value (USD)','Stage','Owner'],...visibleDeals().map(d=>[d.name,d.company,d.contact,d.value,d.stage,d.owner])];
  const blob=new Blob(['\uFEFF'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8;'});
  const link=document.createElement('a'); const url=URL.createObjectURL(blob); link.href=url; link.download=`mql-${currentView}-${$('period').value}.csv`; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); toast('Your report has been exported.');
});
renderPeriod(); renderTasks(); navigate();
