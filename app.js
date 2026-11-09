const KEY='mio-bilancio-v2';
const months=[['2026-06','Giugno 2026'],['2026-07','Luglio 2026'],['2026-08','Agosto 2026'],['2026-09','Settembre 2026'],['2026-10','Ottobre 2026'],['2026-11','Novembre 2026']];
const cats={income:['Stipendio','Lavoro extra','Rimborsi','Altre entrate'],expense:['Casa e bollette','Spesa e alimentari','Trasporti e carburante','Salute','Telefono e internet','Tempo libero','Acquisti','Lavoro','Altro']};
let data=JSON.parse(localStorage.getItem(KEY)||'{"transactions":[],"goal":0}');
let type='expense';
const $=id=>document.getElementById(id);
const euro=n=>new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(n||0);
const monthOf=d=>d.slice(0,7);
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function setup(){ $('monthSelect').innerHTML=months.map(([v,n])=>`<option value="${v}">${n}</option>`).join('');$('monthSelect').value='2026-11';$('date').value='2026-11-09';$('date').max='2026-11-30';$('date').min='2026-06-01';$('goal').value=data.goal||'';setType('expense');}
function setType(t){type=t;$('incomeTab').className=t==='income'?'income':'ghost';$('expenseTab').className=t==='expense'?'expense':'ghost';$('category').innerHTML=cats[t].map(c=>`<option>${c}</option>`).join('')}
function totals(list){return list.reduce((a,x)=>{a[x.type]+=x.amount;return a},{income:0,expense:0})}
function render(){
 const m=$('monthSelect').value, list=data.transactions.filter(x=>monthOf(x.date)===m).sort((a,b)=>b.date.localeCompare(a.date));
 const t=totals(list),bal=t.income-t.expense;
 $('incomeTotal').textContent=euro(t.income);$('expenseTotal').textContent=euro(t.expense);$('balanceTotal').textContent=euro(bal);$('balanceTotal').className=bal>=0?'positive':'negative';
 $('transactionList').innerHTML=list.length?list.map(x=>`<div class="item"><div style="min-width:0"><div class="desc">${escapeHtml(x.description)}</div><div class="meta">${x.date} · ${escapeHtml(x.category)}</div></div><div class="actions"><span class="amount ${x.type==='income'?'positive':'negative'}">${x.type==='income'?'+':'−'}${euro(x.amount)}</span><button class="delete" data-delete="${x.id}" aria-label="Elimina movimento">✕</button></div></div>`).join(''):'<div class="empty">Nessun movimento per questo mese. Aggiungi la prima entrata o uscita qui sopra.</div>';
 renderMonths();renderCategories(list);renderGoal(bal);
}
function renderMonths(){
 const rows=months.map(([m,n])=>{let t=totals(data.transactions.filter(x=>monthOf(x.date)===m));return {m,n,...t,bal:t.income-t.expense}});
 const max=Math.max(1,...rows.flatMap(x=>[x.income,x.expense]));
 $('monthChart').innerHTML=rows.map(x=>`<div style="margin:12px 0"><div class="barrow"><strong>${x.n.split(' ')[0]}</strong><div><div class="track"><div class="bar in" style="width:${x.income/max*100}%"></div></div><div class="track" style="margin-top:5px"><div class="bar out" style="width:${x.expense/max*100}%"></div></div></div><span style="text-align:right">${euro(x.bal)}</span></div><div class="small" style="margin-left:82px">Entrate ${euro(x.income)} · Uscite ${euro(x.expense)}</div></div>`).join('');
}
function renderCategories(list){
 const sums={};list.filter(x=>x.type==='expense').forEach(x=>sums[x.category]=(sums[x.category]||0)+x.amount);
 const entries=Object.entries(sums).sort((a,b)=>b[1]-a[1]),max=Math.max(1,...entries.map(x=>x[1]));
 $('categoryChart').innerHTML=entries.length?entries.map(([c,v])=>`<div class="barrow"><span>${escapeHtml(c)}</span><div class="track"><div class="bar out" style="width:${v/max*100}%"></div></div><strong style="text-align:right">${euro(v)}</strong></div>`).join(''):'<div class="empty">Le categorie delle uscite compariranno qui.</div>';
}
function renderGoal(balance){let goal=Number(data.goal)||0;$('goalStatus').textContent=goal?`Saldo del mese: ${euro(balance)} · Obiettivo: ${euro(goal)} · ${balance>=goal?'Obiettivo raggiunto! 🎉':`Ti mancano ${euro(Math.max(0,goal-balance))} per raggiungerlo.`}`:'Imposta un obiettivo per vedere i tuoi progressi.'}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('incomeTab').onclick=()=>setType('income');$('expenseTab').onclick=()=>setType('expense');$('monthSelect').onchange=render;
$('transactionForm').onsubmit=e=>{e.preventDefault();let amount=Number($('amount').value),date=$('date').value;if(!(amount>0)||!date)return;data.transactions.push({id:Date.now().toString()+Math.random().toString(16).slice(2),type,amount, date,description:$('description').value.trim(),category:$('category').value});save();$('amount').value='';$('description').value='';$('monthSelect').value=monthOf(date)};
$('transactionList').onclick=e=>{let b=e.target.closest('[data-delete]');if(b&&confirm('Vuoi eliminare questo movimento?')){data.transactions=data.transactions.filter(x=>x.id!==b.dataset.delete);save()}};
$('goal').onchange=()=>{data.goal=Math.max(0,Number($('goal').value)||0);save()};
$('exportBtn').onclick=()=>{let blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mio-bilancio-backup.json';a.click();URL.revokeObjectURL(a.href)};
$('importBtn').onclick=()=>$('importFile').click();
$('importFile').onchange=async e=>{let f=e.target.files[0];if(!f)return;try{let d=JSON.parse(await f.text());if(!Array.isArray(d.transactions))throw Error();if(confirm('Importare il backup? I dati attuali saranno sostituiti.')){data={transactions:d.transactions,goal:Number(d.goal)||0};save();$('goal').value=data.goal}}catch{alert('File di backup non valido.')}e.target.value=''};
setup();render();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
