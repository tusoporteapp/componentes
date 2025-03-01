
const clientId = "26268621569-lfjae4mrdaa32bunhig435njn3ej4tb6.apps.googleusercontent.com";
const apiKey = "AIzaSyC2gil5B_kl_qRxDtmon8qJ4TdAAHZs4D0";
const redirectUri = window.location.origin;
const scope = "https://www.googleapis.com/auth/blogger";
const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;

function login() {
  window.location.href = authUrl;
}

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = urlParams.get("access_token");

  if (accessToken) {
    document.getElementById("resultado").innerText = "¡Autenticado con Google!";
    sessionStorage.setItem("accessToken", accessToken);
  }
};

async function publicarPost() {
  const accessToken = sessionStorage.getItem("accessToken");
  const blogId = "4347227722296631169";
  const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`;

  const post = {
    title: "Prueba desde UPIA 🔥",
    content: "Este es mi primer post automático usando la API de Blogger",
  };

  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(post),
    });

    const data = await response.json();
    if (data.id) {
      alert("Post publicado con éxito");
    } else {
      alert("Error al publicar");
    }
  } catch (error) {
    console.error("Error al publicar", error);
    alert("Error al publicar");
  }
}
