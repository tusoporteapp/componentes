if ("NDEFReader" in window) {
    const nfcReader = new NDEFReader();
    
    async function scanNFC() {
        try {
            await nfcReader.scan();
            console.log("Esperando NFC...");
            
            nfcReader.onreading = event => {
                console.log("NFC detectado");
                mostrarEfectoNFC();
                activarModalConEfecto();
            };
        } catch (error) {
            console.error("Error al escanear NFC", error);
        }
    }
    
    scanNFC();
}

function mostrarEfectoNFC() {
    const nfcEffect = document.getElementById("nfcEffect");
    nfcEffect.style.display = "block";
    setTimeout(() => {
        nfcEffect.style.display = "none";
    }, 1500);
}

function activarModalConEfecto() {
    const modal = document.getElementById("miModal");
    const overlay = document.getElementById("overlay");

    overlay.classList.add("mostrar-overlay");
    setTimeout(() => {
        modal.classList.add("mostrar-modal");
        overlay.style.display = "flex";

        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
    }, 1000);
}

function cerrarModal() {
    const modal = document.getElementById("miModal");
    const overlay = document.getElementById("overlay");
    modal.classList.remove("mostrar-modal");
    overlay.style.display = "none";
}

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("nfc")) {
        mostrarEfectoNFC();
        activarModalConEfecto();
    }
};
