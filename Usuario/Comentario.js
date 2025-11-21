// Detectar si la página tiene elementos de comentarios
document.addEventListener("DOMContentLoaded", () => {

    const starContainer = document.getElementById("starContainer");
    const reviewsList = document.getElementById("reviewsList");
    const commentBox = document.getElementById("comment");

    // Si la página NO tiene comentarios, salir
    if (!starContainer || !reviewsList || !commentBox) return;

    // Obtener nombre de archivo para clave única
    const fileName = window.location.pathname.split("/").pop().split(".")[0].toLowerCase();
    const STORAGE_KEY = "reviews_" + fileName;

    let selectedStars = 0;

    const stars = document.querySelectorAll(".stars span");

    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedStars = star.dataset.star;

            stars.forEach(s => s.classList.remove("selected"));

            for (let i = 0; i < selectedStars; i++) {
                stars[i].classList.add("selected");
            }
        });
    });

    // Publicar comentario
    window.publicar = function () {
        const comment = commentBox.value.trim();

        if (selectedStars === 0) {
            alert("Selecciona una calificación.");
            return;
        }

        if (comment === "") {
            alert("Escribe un comentario.");
            return;
        }

        const review = {
            estrellas: selectedStars,
            texto: comment
        };

        let reviews = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        reviews.push(review);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

        selectedStars = 0;
        commentBox.value = "";
        stars.forEach(s => s.classList.remove("selected"));

        mostrarReseñas();
    };

    // Mostrar reseñas
    function mostrarReseñas() {
        let reviews = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        reviewsList.innerHTML = "";

        reviews.forEach(r => {
            reviewsList.innerHTML += `
                <div class="review">
                    <div class="rating">${"★".repeat(r.estrellas)}${"☆".repeat(5 - r.estrellas)}</div>
                    <p>${r.texto}</p>
                </div>
            `;
        });
    }

    mostrarReseñas();

});
