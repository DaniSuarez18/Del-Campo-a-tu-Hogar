// Estado inicial de la aplicación[cite: 3, 5]
let state = { user: null, role: "comprador" };

const views = {
  hero: document.getElementById("hero-view"),
  auth: document.getElementById("auth-view"),
  vendedor: document.getElementById("dashboard-vendedor"),
  comprador: document.getElementById("dashboard-comprador"),
};

// Navegación limpia usando clases
function showView(viewName) {
  Object.values(views).forEach((v) => {
    if (v) {
      v.classList.remove("active");
      v.classList.add("hidden");
    }
  });

  const targetView = views[viewName];
  if (targetView) {
    targetView.classList.remove("hidden");
    targetView.classList.add("active");
    window.scrollTo(0, 0);
  }
}

function showAuth() {
  showView("auth");
}

// Control de animaciones del formulario doble[cite: 3, 5]
const container = document.getElementById("container-double");
if (document.getElementById("signUpBtn")) {
  document
    .getElementById("signUpBtn")
    .addEventListener("click", () =>
      container.classList.add("right-panel-active"),
    );
}

if (document.getElementById("signInBtn")) {
  document
    .getElementById("signInBtn")
    .addEventListener("click", () =>
      container.classList.remove("right-panel-active"),
    );
}

// Selección de rol[cite: 3, 5]
window.selectRole = function (role) {
  state.role = role;
  document
    .querySelectorAll(".btn-role")
    .forEach((b) => b.classList.remove("btn-secondary-selected"));
  document
    .getElementById(`btn-${role}`)
    .classList.add("btn-secondary-selected");
};

// Registro de usuarios[cite: 3, 5]
document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const pass = document.getElementById("reg-password").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  if (usuarios.find((u) => u.email === email)) {
    alert("Este correo electrónico ya está registrado.");
    return;
  }

  usuarios.push({ nombre, email, password: pass, role: state.role });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("¡Cuenta creada con éxito!");
  e.target.reset();
  container.classList.remove("right-panel-active");
});

// Lógica de login[cite: 3, 5]
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const emailIngresado = document.getElementById("login-email").value;
  const passIngresada = document.getElementById("login-password").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioValido = usuarios.find(
    (u) => u.email === emailIngresado && u.password == passIngresada,
  );

  if (usuarioValido) {
    state.role = usuarioValido.role;
    handleAuthSuccess(usuarioValido.nombre);
  } else {
    alert("Correo o contraseña incorrectos.");
  }
});

function handleAuthSuccess(nombre) {
  state.user = nombre;
  document.getElementById("main-header").classList.remove("hidden");
  document.getElementById("user-display").textContent = `Hola, ${nombre}`;

  if (state.role === "vendedor") {
    renderVendedorDashboard(nombre);
    showView("vendedor");
  } else {
    renderCompradorDashboard(nombre);
    showView("comprador");
  }
}

// --- PANEL DEL VENDEDOR (ACTUALIZADO CON GESTIÓN) ---[cite: 1, 8]
function renderVendedorDashboard(nombre) {
  const vendedorView = document.getElementById("dashboard-vendedor");
  vendedorView.innerHTML = `
    <div class="hero-content" style="max-width: 900px;">
      <h1>Panel de Vendedor</h1>
      <p>Bienvenido ${nombre}. Gestiona tus productos lácteos.</p>
      
      <form id="product-form" class="product-form" style="margin-top: 20px; width: 100%;">
        <h3>Cargar Nuevo Producto</h3>
        <input type="text" id="p-name" placeholder="Nombre del producto" required />
        <input type="number" id="p-price" placeholder="Precio ($)" required />
        <label style="margin-top: 10px; display: block; font-size: 0.9rem;">Imagen del producto:</label>
        <input type="file" id="p-image" accept="image/*" required style="background: white; border: 1px solid #ddd; padding: 10px;" />
        <button type="submit" class="btn btn-primary" style="margin-top: 15px;">Publicar Producto</button>
      </form>

      <hr style="width: 100%; margin: 30px 0; border: 0; border-top: 1px solid #eee;">

      <h3>Mis Productos Publicados</h3>
      <div id="vendedor-product-list" class="product-grid"></div>
    </div>`;

  updateVendedorProductList(nombre);

  document.getElementById("product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const pName = document.getElementById("p-name").value;
    const pPrice = document.getElementById("p-price").value;
    const pImageInput = document.getElementById("p-image");
    const file = pImageInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        let productos = JSON.parse(localStorage.getItem("productos")) || [];
        productos.push({
          vendedor: nombre,
          nombre: pName,
          precio: pPrice,
          imagen: reader.result,
          id: Date.now(),
        });
        localStorage.setItem("productos", JSON.stringify(productos));
        alert("Producto publicado.");
        e.target.reset();
        updateVendedorProductList(nombre);
      };
      reader.readAsDataURL(file);
    }
  });
}

// --- FUNCIÓN PARA LISTAR Y GESTIONAR ---
function updateVendedorProductList(nombreVendedor) {
  const container = document.getElementById("vendedor-product-list");
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  const misProductos = productos.filter((p) => p.vendedor === nombreVendedor);

  if (misProductos.length === 0) {
    container.innerHTML = "<p>No tienes productos publicados.</p>";
    return;
  }

  container.innerHTML = "";
  misProductos.forEach((p) => {
    container.innerHTML += `
      <div class="product-card">
        <div class="product-image-container"><img src="${p.imagen}" class="product-card-image" /></div>
        <div class="product-details">
          <h3>${p.nombre}</h3>
          <p class="product-price">$${p.precio}</p>
          <div style="display: flex; gap: 5px; margin-top: 10px;">
            <button onclick="editProduct(${p.id})" class="btn" style="background: #ffc107; color: black; flex: 1; padding: 5px; font-size: 0.7rem;">Editar</button>
            <button onclick="deleteProduct(${p.id}, '${nombreVendedor}')" class="btn" style="background: #dc3545; color: white; flex: 1; padding: 5px; font-size: 0.7rem;">Eliminar</button>
          </div>
        </div>
      </div>`;
  });
}

// --- ACCIONES DE GESTIÓN ---
window.deleteProduct = function (id, nombreVendedor) {
  if (confirm("¿Estás seguro de eliminar este producto?")) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos = productos.filter((p) => p.id !== id);
    localStorage.setItem("productos", JSON.stringify(productos));
    updateVendedorProductList(nombreVendedor);
  }
};

window.editProduct = function (id) {
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  let pIndex = productos.findIndex((p) => p.id === id);
  let p = productos[pIndex];

  const nuevoNombre = prompt("Nuevo nombre:", p.nombre);
  const nuevoPrecio = prompt("Nuevo precio:", p.precio);

  if (nuevoNombre && nuevoPrecio) {
    productos[pIndex].nombre = nuevoNombre;
    productos[pIndex].precio = nuevoPrecio;
    localStorage.setItem("productos", JSON.stringify(productos));
    renderVendedorDashboard(p.vendedor); // Refresca todo el panel
  }
};

function renderCompradorDashboard(nombre) {
  const compradorView = document.getElementById("dashboard-comprador");
  compradorView.innerHTML = `
    <div class="hero-content" style="max-width: 1000px;">
      <h1>Productos Disponibles</h1>
      <p>Bienvenido ${nombre}.</p>
      <div id="product-list" class="product-grid"></div>
    </div>`;

  const productList = document.getElementById("product-list");
  let productos = JSON.parse(localStorage.getItem("productos")) || [];

  if (productos.length === 0) {
    productList.innerHTML = "<p>No hay productos disponibles.</p>";
  } else {
    productos.forEach((p) => {
      productList.innerHTML += `
        <div class="product-card">
          <div class="product-image-container"><img src="${p.imagen}" class="product-card-image" /></div>
          <div class="product-details">
            <h3>${p.nombre}</h3>
            <p class="product-price"><strong>Precio:</strong> $${p.precio}</p>
            <p class="product-seller"><small>Productor: ${p.vendedor}</small></p>
            <button class="btn btn-primary" style="width: 100%; margin-top: 10px;">Comprar</button>
          </div>
        </div>`;
    });
  }
}

document
  .getElementById("btn-logout")
  .addEventListener("click", () => location.reload());

// --- ESCUCHADOR PARA ACTUALIZACIÓN EN TIEMPO REAL ---
// Este evento detecta cuando el LocalStorage cambia desde OTRA pestaña
window.addEventListener("storage", (e) => {
  if (e.key === "productos") {
    // Si somos compradores y estamos viendo el dashboard, refrescamos la lista
    if (state.role === "comprador" && state.user) {
      renderCompradorDashboard(state.user);
    }
    // Si somos vendedores, refrescamos nuestra lista de gestión
    if (state.role === "vendedor" && state.user) {
      updateVendedorProductList(state.user);
    }
  }
});

// También vamos a mejorar la función renderCompradorDashboard para que sea fácil de llamar
// Asegúrate de que tu función renderCompradorDashboard use esta lógica:
function updateGlobalProductList() {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  let productos = JSON.parse(localStorage.getItem("productos")) || [];

  if (productos.length === 0) {
    productList.innerHTML = "<p>No hay productos disponibles.</p>";
  } else {
    productList.innerHTML = ""; // Limpiamos antes de re-dibujar
    productos.forEach((p) => {
      productList.innerHTML += `
        <div class="product-card">
          <div class="product-image-container"><img src="${p.imagen}" class="product-card-image" /></div>
          <div class="product-details">
            <h3>${p.nombre}</h3>
            <p class="product-price"><strong>Precio:</strong> $${p.precio}</p>
            <p class="product-seller"><small>Productor: ${p.vendedor}</small></p>
            <button class="btn btn-primary" style="width: 100%; margin-top: 10px;">Comprar</button>
          </div>
        </div>`;
    });
  }
}
