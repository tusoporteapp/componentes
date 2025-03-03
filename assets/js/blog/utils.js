function extractImage(content) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const img = tempDiv.querySelector("img");
    return img ? img.src : null;
}

function removeFirstImage(content) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const img = tempDiv.querySelector("img");
    if (img) {
        img.remove();
    }
    return tempDiv.innerHTML;
}

function extractText(html, length) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > length ? text.substring(0, length) + "..." : text;
}
