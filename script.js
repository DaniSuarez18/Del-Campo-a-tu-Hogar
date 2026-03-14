// Estado inicial
let state = { user: null, role: "comprador"};

const views = {
    hero: document.getElementById("hero-view"),
    auth: document.getElementById("auth-view"),
    vendedor: document.getElementById("dashboard-vendedor"),
    comprador: document.getElementById("dashboard-comprador")
};

// Navegación entre secciones
function showView(viewName) {
    Object.values(views).forEach(v => {
        if(v) v.classList.remove("active");
    });

    if (views[viewName]) {
        views[viewName].classList.add("active");
        window.scrollTo(0, 0);
    } else {
        console.error("Error: La vista " + viewName + "no existe");
    }
}

function showAuth() {
    showView("auth");
}

// Control de amimaciones del formulario doble
const container = document.getElementById("container-double");
document.getElementById("signUpBtn").addEventListener("click", () => container.classList.add("right-panel-active"));
document.getElementById("signInBtn").addEventListener("click", () => container.classList.remove("right-panel-active"));

// Selección de rol en el registro
window.selectRole = function(role) {
    state.role = role;
    document.querySelectorAll(".btn-role").forEach(b => b.classList.remove("btn-secondary-selected"));
    document.getElementById(`btn-${role}`).classList.add("btn-secondary-selected");
};

// Login / Registro (Simulado) LocalStorage
document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const pass = document.getElementById("reg-password").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    
    //Verificar duplicados
    if (usuarios.find(u => u.email === email)) {
        alert("Este correo electrónico ya esta registrado.")
        return;
    }

    //Guardar nuevo usuario
    usuarios.push({
        nombre: nombre,
        email: email,
        password: pass,
        role: state.role
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("¡Cuenta creada con éxito! Ahora puedes inicar sesión.");

    //Limpiar campos y volver al panel de login
    e.target.reset();
    container.classList.remove("right-panel-active");
});

//Logica login con localstorage
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailIngresado = document.getElementById("login-email").value;
    const passIngresada = document.getElementById("login-password").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    //Buscar coincidencia exacta
    const usuarioValido = usuarios.find(u => u.email === emailIngresado && u.password == passIngresada);

    if (usuarioValido) {
        state.role = usuarioValido.role;
        handleAuthSuccess(usuarioValido.nombre);
    }else {
        alert("Correo o contraseña incorrectos. Intenta de nuevo.");
    }
});

//Manejo entrada exitosa
function handleAuthSuccess(nombre) {
    state.user = nombre;
    document.getElementById("main-header").classList.remove("hidden");
    document.getElementById("user-display").textContent = `Hola, ${nombre}`;
    
    // Redirección según rol
    if (state.role === "vendedor") {
        showView("vendedor");
        document.getElementById("dashboard-vendedor").innerHTML = `
            <div class="hero-content">
                <h1>Panel de Vendedor</h1>
                <p>Bienvenido ${nombre}. Aquí podras gestionar tus productos lácteos pronto.</p>
            </div> `;
    } else {
        showView("comprador");
        document.getElementById("dashboard-comprador").innerHTML = `
        <div class="hero-content">
            <h1>Panel del Comprador</h1>
            <p>Bienvenido ${nombre}. Aquí podras gestionar tus productos lacteos pronto.</p>
        </div> `;
    }
}

//Cerrar Sesión
document.getElementById("btn-logout").addEventListener("click", () => {
    location.reload();
});
