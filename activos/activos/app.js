// Utilidades comunes (ES-AR). Bloqueo de traducción activado.
(function(){
  // Forzar atributos que bloquean traducción en elementos clave
  window.enforceNotranslate = function(){
    const sel = 'h1,h2,h3,th,td,label,button,a,legend,dialog,table';
    document.documentElement.classList.add('notranslate');
    document.documentElement.setAttribute('translate','no');
    document.body?.classList.add('notranslate');
    document.body?.setAttribute('translate','no');
    document.querySelectorAll(sel).forEach(el=>{
      el.classList.add('notranslate');
      el.setAttribute('translate','no');
    });
    const meta = document.head.querySelector('meta[name="google"]');
    if(!meta){
      const m = document.createElement('meta');
      m.name = 'google'; m.content = 'notranslate';
      document.head.appendChild(m);
    }
  };

  // Sanitizado
  window.escapeHtml = function(s){
    return String(s ?? '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  };

  // Fechas
  window.parseYmd = function(s){
    if(!s) return null;
    // Acepta YYYY-MM-DD
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if(!m) return null;
    const d = new Date(Number(m[1]), Number(m[2])-1, Number(m[3]));
    return isNaN(d.getTime()) ? null : d;
  };
  window.todayYmd = function(){
    const d = new Date();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  };
  window.addDays = function(d, n){
    const x = new Date(d.getTime()); x.setDate(x.getDate()+n); return truncDate(x);
  };
  window.truncDate = function(d){
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  window.sameDay = function(a,b){
    return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  };
  window.statusBadge = function(proxYmd){
    const d = parseYmd(proxYmd);
    if(!d) return '';
    const today = truncDate(new Date());
    let cls = 'ok', txt = 'En término';
    if(d < today){ cls = 'error'; txt = 'Vencida'; }
    else {
      const diff = Math.round((d - today) / 86400000);
      if (diff <= 7){ cls = 'warn'; txt = 'Próxima'; }
    }
    return `<span class="status"><span class="dot ${cls}"></span><span class="muted">${txt}</span></span>`;
  };

  // IDs y almacenamiento
  window.genId = function(prefix='ID_'){ return prefix + Date.now() + '_' + Math.floor(Math.random()*1e6); };

  window.loadLSArray = function(key){
    try { const v = JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(v)?v:[]; } catch { return []; }
  };
  window.saveLSArray = function(key, arr){
    try { localStorage.setItem(key, JSON.stringify(arr||[])); } catch {}
  };
  window.loadLSMap = function(key){
    try { const v = JSON.parse(localStorage.getItem(key)||'{}'); return v && typeof v==='object'? v : {}; } catch { return {}; }
  };
  window.saveLSMap = function(key, map){
    try { localStorage.setItem(key, JSON.stringify(map||{})); } catch {}
  };

  window.mergeBaseWithLocal = function(base, added, idKey='id'){
    const res = [...(Array.isArray(base)?base:[])];
    (Array.isArray(added)?added:[]).forEach(x=>res.push(x));
    // evitar duplicados si por alguna razón se repite id
    const seen = new Set();
    return res.filter(it=>{
      const id = it?.[idKey];
      if(!id) return true;
      if(seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  // Exportaciones
  window.exportJSON = function(filename, data){
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {href:url, download:filename});
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  window.exportCSV = function(filename, rows, headersMap){
    if(!Array.isArray(rows) || !rows.length){ return; }
    const headers = headersMap ? Object.keys(headersMap) : Object.keys(rows[0]);
    const titles = headersMap ? headers.map(h=>headersMap[h]||h) : headers;
    const esc = (v)=>`"${String(v??'').replace(/"/g,'""')}"`;
    const csv = [titles.join(','), ...rows.map(r=>headers.map(h=>esc(r[h])).join(','))].join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {href:url, download:filename});
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  // Prepara datos para exportación fusionando propiedad de observaciones
  window.exportMergedForDownload = function(viewData, obsMap, obsPropName, mergedPropName){
    return (viewData||[]).map(it=>{
      const clone = {...it};
      if (mergedPropName in clone){
        clone[obsPropName] = clone[mergedPropName];
        delete clone[mergedPropName];
      }
      return clone;
    });
  };
})();
