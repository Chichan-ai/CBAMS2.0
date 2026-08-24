/* ===========================================================
   Header & Navigation — script
   =========================================================== */

/* =========================================================
   VIEW PROFILE — read-only modal populated from currentUser
   ========================================================= */
function openProfileModal(){
  if(!currentUser) return;
  document.getElementById('profFullName').textContent = currentUser.full_name || '—';
  document.getElementById('profUsername').textContent = currentUser.username || '—';
  document.getElementById('profEmail').textContent = currentUser.email || '—';
  document.getElementById('profRole').textContent = currentUser.role_label || currentUser.role || '—';
  const perms = currentUser.permissions || {};
  const permsEl = document.getElementById('profPerms');
  const granted = ACCESS_PERMS.filter(p => perms[p.key]).map(p => p.label);
  permsEl.innerHTML = granted.length
    ? granted.map(l => `<div>✓ ${l}</div>`).join('')
    : '<div>No permissions granted.</div>';
  document.getElementById('profileScrim').classList.add('show');
  document.getElementById('profileModal').classList.add('show');
  document.getElementById('dd-account').classList.remove('show');
}
function closeProfileModal(){
  document.getElementById('profileScrim').classList.remove('show');
  document.getElementById('profileModal').classList.remove('show');
}
document.getElementById('link-view-profile').addEventListener('click', (e)=>{
  e.preventDefault();
  openProfileModal();
});
document.getElementById('profileModalClose').addEventListener('click', closeProfileModal);
document.getElementById('profileCloseBtn').addEventListener('click', closeProfileModal);
document.getElementById('profileScrim').addEventListener('click', closeProfileModal);


const loginToggleBtn = document.getElementById('toggleVis');
const loginPwdInput = document.getElementById('loginPassword');
loginToggleBtn.addEventListener('click', ()=>{
  const show = loginPwdInput.type === 'password';
  loginPwdInput.type = show ? 'text' : 'password';
  loginToggleBtn.textContent = show ? 'Hide Password' : 'Show Password';
});

// auto-sliding announcement panel
const loginMediaTrack = document.getElementById('mediaTrack');
const loginMediaSlides = loginMediaTrack.querySelectorAll('.media-slide');
const loginMediaDots = document.querySelectorAll('#mediaDots span');
const loginSlideCount = loginMediaSlides.length;
let loginSlideCurrent = 0;
function goToSlide(i){
  loginSlideCurrent = i;
  loginMediaSlides.forEach((s, idx) => s.classList.toggle('active', idx === loginSlideCurrent));
  loginMediaDots.forEach((d, idx) => d.classList.toggle('active', idx === loginSlideCurrent));
}
setInterval(() => goToSlide((loginSlideCurrent + 1) % loginSlideCount), 4500);


/* =========================================================
   NAV DROPDOWNS
   ========================================================= */
function closeAllDropdowns(){
  document.querySelectorAll('.dropdown.show').forEach(d=>d.classList.remove('show'));
  document.querySelectorAll('.navitem.open').forEach(n=>n.classList.remove('open'));
  document.getElementById('dd-account').classList.remove('show');
}
function wireDropdown(navId, ddId){
  const nav = document.getElementById(navId), dd = document.getElementById(ddId);
  nav.addEventListener('click',(e)=>{
    e.stopPropagation();
    const willOpen = !dd.classList.contains('show');
    closeAllDropdowns();
    if(willOpen){ dd.classList.add('show'); nav.classList.add('open'); }
  });
}
wireDropdown('nav-records','dd-records');
wireDropdown('nav-forms','dd-forms');

const accCell = document.getElementById('account-cell');
const accDD = document.getElementById('dd-account');
accCell.addEventListener('click',(e)=>{ e.stopPropagation(); accDD.classList.toggle('show'); });
document.addEventListener('click', closeAllDropdowns);

