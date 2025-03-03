function openOffcanvas(button) {
    const offcanvas = new bootstrap.Offcanvas(document.getElementById("offcanvas"));
    const offcanvasTitle = document.getElementById("offcanvas-title");
    const offcanvasContent = document.getElementById("offcanvas-content");

    const title = button.getAttribute("data-title");
    let content = decodeURIComponent(button.getAttribute("data-content"));

    // Convertir a HTML sin modificar estructura original
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    // Eliminar la primera imagen si existe
    const firstImage = tempDiv.querySelector("img");
    if (firstImage) {
        firstImage.remove(); // ✅ Elimina la imagen sin dejar espacio en blanco
    }

    // Asegurar que emojis y caracteres especiales se muestren correctamente
    tempDiv.innerHTML = tempDiv.innerHTML.normalize("NFC");

    // Insertar contenido sin modificaciones
    offcanvasTitle.innerHTML = title;
    offcanvasContent.innerHTML = tempDiv.innerHTML; // ✅ Se mantiene el formato original de Blogger sin la imagen

    // Abrir el offcanvas
    offcanvas.show();
}
