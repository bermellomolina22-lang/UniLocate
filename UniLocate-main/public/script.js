// ─── 1. SOLUCIÓN CLOUDINARY PARA NO USAR TARJETA DE CRÉDITO ───
async function subirACloudinary(archivo) {
    const CLOUD_NAME = "TU_CLOUD_NAME_AQUI"; // Regístrate gratis en cloudinary.com y pon tu nombre de usuario aquí
    const UPLOAD_PRESET = "TU_UPLOAD_PRESET_AQUI"; // Crea un upload preset "Unsigned" en Cloudinary

    const url = `https://cloudinary.com{CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const response = await fetch(url, { method: "POST", body: formData });
        const resultado = await response.json();
        return resultado.secure_url; // Te da el link de la foto en internet
    } catch (error) {
        console.error("Error al subir a Cloudinary:", error);
        return null;
    }
}

// ─── 2. EVENTO DEL BOTÓN: GUARDAR OBJETO PERDIDO ───
document.getElementById("btnReportar").addEventListener("click", async () => {
    const nombre = document.getElementById("nombre-objeto").value;
    const categoria = document.getElementById("categoria-objeto").value;
    const ubicacion = document.getElementById("ubicacion-objeto").value;
    const fotoInput = document.getElementById("foto-objeto").files[0];

    if (!nombre || !ubicacion || !fotoInput) {
        alert("Por favor, llena todos los campos del reporte e incluye una foto.");
        return;
    }

    alert("Subiendo imagen y registrando hallazgo...");
    
    // Subir imagen a Cloudinary primero
    const urlImagen = await subirACloudinary(fotoInput);

    // Crear el documento JSON estructurado para Firestore
    const nuevoObjeto = {
        nombre: nombre,
        categoria: categoria,
        ubicacion_hallazgo: ubicacion,
        imagen_url: urlImagen,
        estado: "pendiente", // Patrón State inicial obligatorio
        fecha_registro: new Date().toISOString()
    };

    try {
        // Guardar directamente en la colección 'objetos_perdidos' en la nube
        await db.collection("objetos_perdidos").add(nuevoObjeto);
        alert("¡Objeto registrado con éxito en UniLocate!");
        
        // Limpiar el formulario
        document.getElementById("nombre-objeto").value = "";
        document.getElementById("ubicacion-objeto").value = "";
    } catch (error) {
        console.error("Error al guardar en Firestore:", error);
    }
});

// ─── 3. ESCUCHAR CAMBIOS EN TIEMPO REAL (MOSTRAR EN PANTALLA) ───
db.collection("objects_perdidos").orderBy("fecha_registro", "desc")
    .onSnapshot((snapshot) => {
        const contenedor = document.getElementById("lista-objetos");
        contenedor.innerHTML = ""; // Limpiar lista

        snapshot.forEach((doc) => {
            const data = doc.data();
            contenedor.innerHTML += `
                <div class="col-12 mb-3">
                    <div class="card h-100">
                        <img src="${data.imagen_url}" class="card-img-top" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${data.nombre}</h5>
                            <p class="card-text mb-1"><strong>Lugar:</strong> ${data.ubicacion_hallazgo}</p>
                            <p class="card-text mb-2"><strong>Estado:</strong> <span class="badge bg-warning">${data.estado}</span></p>
                            <button class="btn btn-outline-danger btn-sm w-100">Solicitar Reclamo</button>
                        </div>
                    </div>
                </div>
            `;
        });
    });
