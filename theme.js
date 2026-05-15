/* ═══════════════════════════════════════════
   GARCÍA & ASOCIADOS — THEME JS CENTRALIZADO
   Sistema de 6 temas + auto día/noche
═══════════════════════════════════════════ */

/* ═══ SISTEMA DE 6 TEMAS + auto día/noche ═══ */
(function(){
    var TEMAS = [
        {id:1, nombre:'Día Clásico',   sub:'Crema & Dorado',  modo:'dia',   bg:'#ddd6c8', acc:'#c9a96e', emoji:'☀️'},
        {id:2, nombre:'Noche Clásico', sub:'Oscuro & Dorado', modo:'noche', bg:'#0a0a0f', acc:'#c9a96e', emoji:'🌙'},
        {id:3, nombre:'Esmeralda',     sub:'Verde & Dorado',  modo:'noche', bg:'#040d08', acc:'#50c878', emoji:'🌿'},
        {id:4, nombre:'Pergamino',     sub:'Beige & Bordo',   modo:'dia',   bg:'#ddd4c4', acc:'#8a1c30', emoji:'📜'},
        {id:5, nombre:'Océano',        sub:'Azul & Cian',     modo:'noche', bg:'#020c14', acc:'#00d4ff', emoji:'🌊'},
        {id:6, nombre:'Justicia',      sub:'Negro & Carmesí', modo:'noche', bg:'#060404', acc:'#d4203c', emoji:'⚖️'}
    ];
    var temaManual = null;

    function temaAutoPorHora(){
        var h = new Date().getHours();
        return (h >= 7 && h < 19) ? 1 : 2;
    }

    function aplicarTema(id){
        var t = TEMAS.find(function(x){return x.id===id;});
        if(!t) return;
        // Quitar clases anteriores
        for(var i=1;i<=6;i++) document.body.classList.remove('tema-'+i);
        document.body.classList.remove('modo-dia','modo-noche');
        // Aplicar modo + tema
        document.body.classList.add('modo-'+t.modo);
        document.body.classList.add('tema-'+id);
        // Badge
        var badge = document.getElementById('modo-badge');
        if(badge){
            var auto = !temaManual;
            badge.innerHTML = t.emoji+' '+t.nombre+(auto?' <span style="font-size:.65em;opacity:.5">AUTO</span>':'');
        }
        // Panel
        actualizarPanel(id);
        // Guardar
        try{localStorage.setItem('ga_tema',temaManual||'auto');}catch(e){}
        try{
            if(typeof firebase!=='undefined'&&firebase.apps&&firebase.apps.length)
                firebase.database().ref('config/tema').set(temaManual||'auto');
        }catch(e){}
    }

    function actualizarPanel(activo){
        var p=document.getElementById('tema-panel');
        if(!p)return;
        p.innerHTML='<div style="font-size:.68em;letter-spacing:.15em;text-transform:uppercase;color:var(--text-label);margin-bottom:10px;">Seleccionar tema</div>'+
            TEMAS.map(function(t){
                return '<div class="tema-option '+(t.id===activo?'activo':'')+'" onclick="window._elegirTema('+t.id+')">'+
                    '<div class="tema-swatch" style="background:linear-gradient(135deg,'+t.bg+' 50%,'+t.acc+' 50%)"></div>'+
                    '<div><div class="tema-name">'+t.emoji+' '+t.nombre+'</div><div class="tema-sub">'+t.sub+'</div></div></div>';
            }).join('')+
            (temaManual?'<div style="margin-top:10px;text-align:center"><button onclick="window._volverAuto()" style="background:none;border:1px solid var(--gold-border);color:var(--gold);padding:4px 12px;border-radius:16px;cursor:pointer;font-size:.72em;font-family:DM Sans,sans-serif">↺ Automático</button></div>':'');
    }

    window._elegirTema = function(id){
        temaManual = id;
        aplicarTema(id);
        document.getElementById('tema-panel').classList.remove('visible');
    };
    window._volverAuto = function(){
        temaManual = null;
        aplicarTema(temaAutoPorHora());
        document.getElementById('tema-panel').classList.remove('visible');
    };

    function init(){
        try{
            var saved=localStorage.getItem('ga_tema');
            if(saved&&saved!=='auto') temaManual=parseInt(saved);
        }catch(e){}
        aplicarTema(temaManual||temaAutoPorHora());
        // Badge click → toggle panel
        var badge=document.getElementById('modo-badge');
        if(badge) badge.addEventListener('click',function(e){
            e.stopPropagation();
            document.getElementById('tema-panel').classList.toggle('visible');
        });
        // Click afuera cierra panel
        document.addEventListener('click',function(e){
            var sel=document.getElementById('tema-panel');
            if(sel&&!sel.contains(e.target)) sel.classList.remove('visible');
        });
        // Auto-cambio cada minuto
        setInterval(function(){
            if(!temaManual) aplicarTema(temaAutoPorHora());
        },60000);
    }

    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
    else init();
})();