// ==============================================
//  1. Verificar inicio de sesión
// ==============================================
function estaLogueado() {
    return localStorage.getItem("logueado") === "true";
}

document.addEventListener("click", e => {
    if (e.target.classList.contains("add-button")) {

        if (!estaLogueado()) {
            Swal.fire({
                icon: "warning",
                title: "Debes iniciar sesión",
                text: "Inicia sesión para usar el carrito.",
                confirmButtonColor: "orange"
            }).then(() => {
                localStorage.setItem("pagina_anterior", window.location.href);
                window.location.href = "../Usuario/Sesion.html";
            });

            return;
        }


        // ======================================
        // Usuario logueado → agregar al carrito
        // ======================================

        const name = e.target.dataset.name;
        const price = Number(e.target.dataset.price);

        let existing = cart.find(p => p.name === name);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        saveCart();
        renderCart();

        Swal.fire({
            icon: "success",
            title: "Producto agregado",
            text: `"${name}" fue agregado al carrito.`,
            timer: 1200,
            showConfirmButton: false
        });
    }
});


// ==============================================
//  2. Inicialización del carrito
// ==============================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ==============================================
//  3. Renderizar carrito en el slidebar
// ==============================================
function renderCart() {
    const cartItems = document.getElementById("carritoLista");
    const cartTotal = document.getElementById("carritoTotal");

    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        li.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <br>
                $${item.price} c/u
            </div>

            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-secondary decrease" data-index="${index}">−</button>

                <span class="mx-2">${item.quantity}</span>

                <button class="btn btn-sm btn-secondary increase" data-index="${index}">+</button>

                <button class="btn btn-danger btn-sm ms-3 remove-item" data-index="${index}">
                    X
                </button>
            </div>
        `;

        cartItems.appendChild(li);
    });

    cartTotal.textContent = total;
}

renderCart();


// ==============================================
//  4. Eventos + , − y eliminar
// ==============================================
document.addEventListener("click", e => {

    // Eliminar
    if (e.target.classList.contains("remove-item")) {
        const i = e.target.dataset.index;
        cart.splice(i, 1);
        saveCart();
        renderCart();
    }

    // Incrementar +
    if (e.target.classList.contains("increase")) {
        let i = e.target.dataset.index;
        cart[i].quantity++;
        saveCart();
        renderCart();
    }

    // Disminuir −
    if (e.target.classList.contains("decrease")) {
        let i = e.target.dataset.index;

        if (cart[i].quantity > 1) {
            cart[i].quantity--;
        } else {
            cart.splice(i, 1);
        }

        saveCart();
        renderCart();
    }
});
