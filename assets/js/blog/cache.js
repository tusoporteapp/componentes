const CACHE_KEY = "cachedBlogPosts";
const CACHE_TIME_KEY = "cacheTime";
const LAST_POST_ID_KEY = "lastPostId";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora en milisegundos

// Función para obtener posts desde el caché o la API si es necesario
async function getBlogPosts(apiUrl) {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
    const lastPostId = localStorage.getItem(LAST_POST_ID_KEY);

    // Si hay datos en caché y no han pasado más de 1 hora, usarlos
    if (cachedData && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
        console.log("📌 Cargando posts desde caché");
        const cachedPosts = JSON.parse(cachedData);

        // Comprobar si hay un nuevo post en la API
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.items) {
                const latestPostId = data.items[0].id; // ID del post más reciente

                if (lastPostId !== latestPostId) {
                    console.log("🆕 Se ha detectado un nuevo post, actualizando caché");
                    updateCache(data.items);
                    return data.items; // Retornar los posts nuevos
                }
            }
        } catch (error) {
            console.error("❌ Error al verificar nuevos posts:", error);
        }

        return cachedPosts; // Si no hay nuevos posts, seguir usando el caché
    }

    // Si el caché está vacío o ha caducado, obtener los datos de la API
    console.log("🔄 Obteniendo posts desde la API de Blogger");
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.items) {
            updateCache(data.items);
            return data.items;
        }
    } catch (error) {
        console.error("❌ Error al obtener posts de la API:", error);
    }

    return []; // Retornar array vacío en caso de error
}

// ✅ Función para actualizar el caché con los posts nuevos
function updateCache(posts) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(posts));
    localStorage.setItem(CACHE_TIME_KEY, Date.now());
    localStorage.setItem(LAST_POST_ID_KEY, posts[0].id); // Guardar el ID del último post
}
