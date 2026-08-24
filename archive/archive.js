/* ===========================================================
   Archive — script
   ---------------------------------------------------------------
   Moved from the original REQUEST FORM section. Uses
   requestTableRowHTML() defined in request-form/request-form.js
   and the `requests` array loaded/maintained in core/core.js.
   =========================================================== */

let archiveFilter = 'all';
function renderArchiveList(){
  let list = requests.filter(r=>r.status!=='pending');
  if(archiveFilter!=='all') list = list.filter(r=>r.status===archiveFilter);

  const tbody = document.getElementById('archiveTableBody');
  const empty = document.getElementById('archiveTableEmpty');
  if(!tbody || !empty) return;

  if(list.length===0){
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  tbody.innerHTML = list.map(r=>requestTableRowHTML(r,'archive')).join('');
}
