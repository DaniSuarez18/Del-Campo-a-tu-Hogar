// Estado inicial
let state = { user: null, role: 'comprador' };

const views = {
    hero: document.getElementById('hero-view'),
    auth: document.getElementById('auth-view'),
    vendedor: document.getElementById('dashboard-vendedor'),
    comprador: document.getElementById('dashboard-comprador')
};

// Navegación entre secciones
function showView(viewName) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[viewName].classList.add('active');
}

function showAuth() {
    showView('auth');
}

// Lógica formulario doble
const container = document.getElementById('container-double');
document.getElementById('signUpBtn').addEventListener('click', () => container.classList.add("right-panel-active"));
document.getElementById('signInBtn').addEventListener('click', () => container.classList.remove("right-panel-active"));

// Selección de rol
window.selectRole = function(role) {
    state.role = role;
    document.querySelectorAll('.btn-role').forEach(b => b.classList.remove('btn-secondary-selected'));
    document.getElementById(`btn-${role}`).classList.add('btn-secondary-selected');
};

// Login / Registro (Simulado)
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    handleAuthSuccess(document.getElementById('reg-email').value);
});

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    handleAuthSuccess(document.getElementById('login-email').value);
});

function handleAuthSuccess(email) {
    state.user = email;
    document.getElementById('main-header').classList.remove('hidden');
    document.getElementById('user-display').textContent = `Hola, ${email.split('@')[0]}`;
    
    // Redirección según rol
    if (state.role === 'vendedor') {
        renderVendedorDashboard();
        showView('vendedor');
    } else {
        renderCompradorDashboard();
        showView('comprador');
    }
}
