
// JS con Sincronización en Tiempo Real y Notificaciones Automáticas
const CACHE_KEY = "blog_posts_cache";
const blogUrl = "https://miguelherediavlog.blogspot.com/";
const apiKey = "AIzaSyC2gil5B_kl_qRxDtmon8qJ4TdAAHZs4D0";

async function fetchPosts(forceUpdate = false) {
  const cache = localStorage.getItem(CACHE_KEY);
  let cachedPosts = cache ? JSON.parse(cache) : [];
  let newPosts = [];

  if (!forceUpdate && cache) {
    console.log("✅ Usando datos del caché");
    renderPosts(cachedPosts);
  }

  const url = `https://www.googleapis.com/blogger/v3/blogs/byurl?url=${blogUrl}&key=${apiKey}`;

  try {
    const blogResponse = await fetch(url);
    const blogData = await blogResponse.json();

    if (blogData.id) {
      const postsUrl = `https://www.googleapis.com/blogger/v3/blogs/${blogData.id}/posts?key=${apiKey}`;
      const postsResponse = await fetch(postsUrl);
      const postsData = await postsResponse.json();

      if (postsData.items) {
        newPosts = postsData.items;

        if (cachedPosts.length > 0) {
          const cachedIds = cachedPosts.map(post => post.id);
          const freshPosts = newPosts.filter(post => !cachedIds.includes(post.id));

          if (freshPosts.length > 0) {
            showToast(`📢 ${freshPosts.length} nuevas publicaciones disponibles.`);
            cachedPosts = [...freshPosts, ...cachedPosts];
            localStorage.setItem(CACHE_KEY, JSON.stringify(cachedPosts));
            renderPosts(cachedPosts);
          }
        } else {
          cachedPosts = newPosts;
          localStorage.setItem(CACHE_KEY, JSON.stringify(cachedPosts));
          renderPosts(cachedPosts);
        }
      }
    }
  } catch (error) {
    console.error("Error al conectar con la API:", error);
  }
}

function showToast(message) {
  const toastEl = document.getElementById("blogToast");
  const toastBody = document.querySelector("#blogToast .toast-body");
  toastBody.innerText = message;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Blog UPIA", { body: message });
  }
}

function renderPosts(posts) {
  const container = document.getElementById("blog-posts");
  container.innerHTML = "";

  posts.slice(0, 6).forEach(post => {
    const extract = post.content ? post.content.replace(/<[^>]+>/g, '').slice(0, 100) : "Sin descripción";
    const imageMatches = [...post.content.matchAll(/<img[^>]+src="([^"]+)"/g)];
    const images = imageMatches.map(match => match[1]);
    const slider = images.map((img, index) =>
      `<div class="carousel-item ${index === 0 ? 'active' : ''}">
        <img src="${img}" class="d-block w-100">
      </div>`).join("");

    const col = document.createElement("div");
    col.classList.add("col-lg-4", "col-md-6", "col-sm-6", "col-6", "mb-4");
    col.innerHTML = `
      <div class="card h-100 shadow">
        <div id="carousel-${post.id}" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">${slider}</div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${post.id}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carousel-${post.id}" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${extract}...</p>
          <button class="btn btn-primary leer-mas" data-title="${post.title}" data-content='${post.content}'>Leer más</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  document.querySelectorAll(".leer-mas").forEach(button => {
    button.addEventListener("click", function () {
      document.getElementById("offcanvasTitle").innerText = this.dataset.title;
      document.getElementById("offcanvasContent").innerHTML = this.dataset.content;
      const offcanvas = new bootstrap.Offcanvas(document.getElementById("blogOffcanvas"));
      offcanvas.show();
    });
  });
}

if ("Notification" in window) {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("🔔 Notificaciones activadas");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchPosts();
  setInterval(() => fetchPosts(), 60000); // Sincronización cada 1 minuto
});

