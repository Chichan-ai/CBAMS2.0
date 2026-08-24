/* ===========================================================
   Maintenance Reports — script
   =========================================================== */

/* =========================================================
   MAINTENANCE REPORTS — extract by date range
   ========================================================= */
function populateReportCategoryFilter(){
  const sel = document.getElementById('reportCategory');
  const current = sel.value;
  const cats = Object.keys(CLOSURE_CATEGORIES);
  sel.innerHTML = '<option value="all">All categories</option>' + cats.map(c=>`<option value="${c}">${c}</option>`).join('');
  if(current && (current==='all' || cats.includes(current))) sel.value = current;
}

function getReportRows(){
  const from = document.getElementById('reportFrom').value;
  const to = document.getElementById('reportTo').value;
  const cat = document.getElementById('reportCategory').value;
  const status = document.getElementById('reportStatus').value;
  const fromDate = from ? new Date(from+'T00:00:00') : null;
  const toDate = to ? new Date(to+'T23:59:59') : null;
  return requests.filter(r=>{
    if(status!=='all' && r.status!==status) return false;
    if(cat!=='all' && r.category!==cat) return false;
    if(fromDate && (!r.submittedAtDate || r.submittedAtDate < fromDate)) return false;
    if(toDate && (!r.submittedAtDate || r.submittedAtDate > toDate)) return false;
    return true;
  });
}

function renderReportTable(){
  const rows = getReportRows();
  const tbody = document.getElementById('reportTableBody');
  if(rows.length === 0){
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:24px;color:var(--muted);font-size:12px;">No requests match this filter.</td></tr>';
  } else {
    tbody.innerHTML = rows.map(r=>{
      const change = r.requestedStatus==='closed' ? 'Open → Closed' : 'Closed → Open';
      const statusLabel = r.status.charAt(0).toUpperCase()+r.status.slice(1);
      return `<tr>
        <td>${r.id}</td>
        <td>${r.branchName} <span style="color:var(--muted);">(${r.branchCode})</span></td>
        <td>${r.region}</td>
        <td>${r.category||'—'}</td>
        <td>${r.subcategory||'—'}</td>
        <td>${change}</td>
        <td>${statusLabel}</td>
        <td>${r.submittedBy}${r.submittedByPosition?` (${r.submittedByPosition})`:''}, ${r.submittedAt}</td>
        <td>${r.reviewedBy ? r.reviewedBy+', '+r.reviewedAt : '—'}</td>
      </tr>`;
    }).join('');
  }
  const total = rows.length;
  const approved = rows.filter(r=>r.status==='approved').length;
  const rejected = rows.filter(r=>r.status==='rejected').length;
  const pending = rows.filter(r=>r.status==='pending').length;
  document.getElementById('reportSummary').innerHTML = `
    <div class="report-stat"><span class="rs-val">${total}</span><span class="rs-lbl">Total</span></div>
    <div class="report-stat"><span class="rs-val">${approved}</span><span class="rs-lbl">Approved</span></div>
    <div class="report-stat"><span class="rs-val">${rejected}</span><span class="rs-lbl">Rejected</span></div>
    <div class="report-stat"><span class="rs-val">${pending}</span><span class="rs-lbl">Pending</span></div>
  `;
}

function exportReportCSV(rows){
  const headers = ['Request ID','Branch','Code','Region','Category','Subcategory','Change','Status','Submitted By','Submitted By Position','Submitted At','Reviewed By','Reviewed At','Reason'];
  const csvRows = [headers.join(',')];
  rows.forEach(r=>{
    const change = r.requestedStatus==='closed' ? 'Open to Closed' : 'Closed to Open';
    const vals = [
      r.id, r.branchName, r.branchCode, r.region, r.category||'', r.subcategory||'',
      change, r.status, r.submittedBy, r.submittedByPosition||'', r.submittedAt, r.reviewedBy||'', r.reviewedAt||'', r.reason||''
    ].map(v => `"${String(v).replace(/"/g,'""')}"`);
    csvRows.push(vals.join(','));
  });
  const blob = new Blob([csvRows.join('\n')], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CBAMS_Maintenance_Report_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.getElementById('reportGenerateBtn').addEventListener('click', renderReportTable);
document.getElementById('reportResetBtn').addEventListener('click', ()=>{
  document.getElementById('reportFrom').value = '';
  document.getElementById('reportTo').value = '';
  document.getElementById('reportCategory').value = 'all';
  document.getElementById('reportStatus').value = 'all';
  renderReportTable();
});
document.getElementById('reportExportBtn').addEventListener('click', ()=>{
  const rows = getReportRows();
  if(rows.length === 0){ showToast('No data to export for the selected filters.', 'error'); return; }
  exportReportCSV(rows);
  showToast(`Exported ${rows.length} record(s) to CSV.`, 'success');
});

