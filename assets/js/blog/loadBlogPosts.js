let allPosts = []; // Variable global para almacenar los posts

async function loadBlogPosts() {
    const blogContainer = document.getElementById("blog-container");
    const searchInput = document.getElementById("search-input");

    const apiKey = "AIzaSyC2gil5B_kl_qRxDtmon8qJ4TdAAHZs4D0";
    const blogId = "4307581421676951430";
    const maxResults = 6;
    const apiUrl = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=${maxResults}`;

    // Obtener los posts desde el caché o API
    allPosts = await getBlogPosts(apiUrl);
    
    // Renderizar los posts si hay contenido
    if (allPosts.length > 0) {
        renderPosts(allPosts);
    }

    // Iniciar la búsqueda después de cargar los posts
    setupSearch();
}

function renderPosts(posts) {
    const blogContainer = document.getElementById("blog-container");
    blogContainer.innerHTML = "";
    
    posts.forEach(post => {
        const { title, published, content, url } = post;
        const imageUrl = extractImage(content) || "default-image.jpg";
        const cleanContent = removeFirstImage(content);
        const excerpt = extractText(content, 100);

        const blogCard = `
            <div class="col-xxl-3 blog-post">
                <div class="card">
                    <img class="card-img-top w-100 d-block fit-cover" style="height: 200px;" src="${imageUrl}" />
                    <div class="card-body p-4">
                        <h4 class="card-title">${title}</h4>
                        <p class="card-text">${excerpt}</p>
                        <button class="btn btn-primary leer-mas" type="button" 
                            style="width: 100%; background: rgb(55,81,126); border-style: none;" 
                            data-title="${title}" 
                            data-image="${imageUrl}" 
                            data-content="${encodeURIComponent(cleanContent)}">
                            <strong>Leer más</strong>
                        </button>
                        <div class="d-flex align-items-center" style="margin-top: 18px;">
                            <img class="rounded-circle flex-shrink-0 me-3" width="50" height="50" src="iconos.png" style="object-fit: cover; aspect-ratio: 1 / 1;" />
                            <div>
                                <p class="fw-bold mb-0">UPIA</p>
                                <p class="text-muted mb-0">Universidad para Emprendedores</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        blogContainer.innerHTML += blogCard;
    });

    // Agregar eventos a los botones de "Leer más"
    document.querySelectorAll(".leer-mas").forEach(button => {
        button.addEventListener("click", function () {
            openOffcanvas(this);
        });
    });
}

// ✅ Función de búsqueda optimizada
function setupSearch() {
    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();

        // Filtrar posts por título o contenido
        const filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm) ||
            extractText(post.content, 100).toLowerCase().includes(searchTerm)
        );

        renderPosts(filteredPosts);
    });
}

// Ejecutar la función al cargar la página
document.addEventListener("DOMContentLoaded", loadBlogPosts);
