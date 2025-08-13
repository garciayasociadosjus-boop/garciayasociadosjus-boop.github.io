// Funcionalidad para las planillas
document.addEventListener('DOMContentLoaded', function() {
    // Código para planilla jurídica
    if (document.body.dataset.page === 'juridica') {
        initPlanillaJuridica();
    }
    
    // Código para planilla siniestros
    if (document.body.dataset.page === 'siniestros') {
        initPlanillaSiniestros();
    }
});

function initPlanillaJuridica() {
    const form = document.getElementById('form-nuevo');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Funcionalidad básica
            alert('Caso agregado correctamente');
            form.reset();
        });
    }
}

function initPlanillaSiniestros() {
    const form = document.getElementById('form-nuevo');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Funcionalidad básica
            alert('Reclamo agregado correctamente');
            form.reset();
        });
    }
}