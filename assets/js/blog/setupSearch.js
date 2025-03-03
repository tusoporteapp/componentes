// ✅ Función para eliminar tildes y normalizar texto
function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function setupSearch() {
    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", function () {
        const searchTerm = normalizeText(searchInput.value);

        // Filtrar posts por título o contenido normalizados
        const filteredPosts = allPosts.filter(post =>
            normalizeText(post.title).includes(searchTerm) ||
            normalizeText(extractText(post.content, 100)).includes(searchTerm)
        );

        renderPosts(filteredPosts);
    });
}
