const canvas = document.getElementById("canvasCristo");
const engine = new BABYLON.Engine(canvas, true);
let cristoMesh;

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 2, Math.PI / 2.5, 6, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1;

  const modelo = esMovil() ? "cristo_movil.glb" : "cristo.glb";
  await BABYLON.SceneLoader.AppendAsync("models/", modelo, scene);

  cristoMesh = scene.meshes.find(m => m.name && m.name !== "__root__");
  if (cristoMesh) {
    cristoMesh.position = new BABYLON.Vector3(0, 0, 0);
  }

  return scene;
};

(async function () {
  const scene = await createScene();
  engine.runRenderLoop(() => scene.render());
})();

window.addEventListener("resize", () => engine.resize());

// --- Contenido por tema ---
const contenidos = {
  historia: {
    titulo: "Historia",
    texto: `El Cristo Redentor es uno de los monumentos más emblemáticos de Brasil y del mundo. Se inauguró oficialmente el 12 de octubre de 1931, después de casi una década de planificación y construcción. La idea de levantar una gran estatua religiosa en Río de Janeiro surgió a finales del siglo XIX, pero tomó fuerza en 1921, cuando se acercaba el centenario de la independencia de Brasil. Su propósito era simbolizar la fe cristiana del pueblo brasileño y transmitir un mensaje de paz y unidad en una época de grandes transformaciones sociales.`
  },
  autor: {
    titulo: "Autor",
    texto: `El diseño del monumento fue obra del ingeniero brasileño Heitor da Silva Costa, quien concibió la idea general de la estructura. La parte escultórica estuvo a cargo del francés Paul Landowski, quien modeló la figura de Cristo. A su vez, el rostro fue elaborado por el artista rumano Gheorghe Leonida, reconocido por su habilidad en retratos. Este trabajo en conjunto permitió que ingeniería y arte se unieran para crear una escultura de proporciones colosales.`
  },
  definicion: {
    titulo: "Definición artística",
    texto: `El Cristo Redentor pertenece al estilo art déco, un movimiento artístico popular en la primera mitad del siglo XX, caracterizado por sus líneas estilizadas, formas geométricas y monumentalidad. Se le considera una de las mayores y más representativas esculturas de este estilo a nivel mundial. Además, su valor no es solo estético, sino también simbólico, pues se ha transformado en un ícono cultural y espiritual.`
  },
  tecnica: {
    titulo: "Técnica",
    texto: `La construcción combinó ingeniería avanzada con trabajo manual minucioso. La estructura principal está hecha en hormigón armado, lo que garantiza su resistencia frente a las condiciones climáticas del cerro Corcovado. Para el recubrimiento se utilizaron millones de pequeños mosaicos de piedra jabonosa (esteatita), colocados manualmente por artesanas y voluntarios. Este material fue elegido por su durabilidad, suavidad al tacto y tono claro, que resalta la majestuosidad de la escultura.`
  },
  detalles: {
    titulo: "Detalles relevantes",
    texto: `El monumento alcanza los 38 metros de altura (30 metros de estatua más 8 del pedestal), con un ancho de brazos de 28 metros. Se levanta en la cima del Cerro Corcovado, a 710 metros sobre el nivel del mar, dominando toda la ciudad de Río de Janeiro. Además de ser considerado una de las Nuevas Siete Maravillas del Mundo Moderno, el Cristo Redentor es un símbolo de paz, hospitalidad y esperanza, extendiendo sus brazos como si abrazara y protegiera a toda la ciudad y a quienes la visitan.`
  }
};

// --- Elementos visuales ---
const instruccionesTexto = document.querySelector(".monumento-instrucciones-texto");
const instruccionesTitulo = document.querySelector(".monumento-instrucciones-titulo");
const infoBlock = document.querySelector(".monumento-info");

// Activar menú hamburguesa solo en móvil
function esMovil() {
  return window.innerWidth <= 768;
}

const menuToggle = document.getElementById("menuToggle");
const menuOpciones = document.getElementById("menuOpciones");

if (esMovil() && menuToggle && menuOpciones) {
  menuToggle.addEventListener("click", () => {
    menuOpciones.classList.toggle("activo");
  });
}

// Crear contenedor dinámico
const infoContenido = document.createElement("div");
infoContenido.style.marginTop = "40px";
infoContenido.style.display = "none";
infoBlock.appendChild(infoContenido);

// Activar botones con animación y estado activo
document.querySelectorAll(".monumento-button").forEach(btn => {
  btn.addEventListener("click", () => {
    const topic = btn.dataset.topic;
    const { titulo, texto } = contenidos[topic];

    // Resetear botones activos
    document.querySelectorAll(".monumento-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Ocultar instrucciones
    instruccionesTexto.style.display = "none";
    instruccionesTitulo.style.display = "none";

    // Mostrar contenido con animación
    infoContenido.innerHTML = `
      <h2 style="font-family: 'Limelight', cursive; font-size: 1.4rem; margin-bottom: 10px;">${titulo}</h2>
      <p style="font-family: 'Karla', sans-serif; font-size: 1rem; color: #ccc; line-height: 1.6;">${texto}</p>
    `;
    infoContenido.classList.remove("fade-in"); // reiniciar animación
    void infoContenido.offsetWidth; // forzar reflow
    infoContenido.classList.add("fade-in");
    infoContenido.style.display = "block";

    if (esMovil()) {
    menuOpciones.classList.remove("activo");
    }
  });
});


// Botón volver
document.querySelector(".monumento-volver").addEventListener("click", () => {
  const volverBtn = document.querySelector(".monumento-volver");
  volverBtn.classList.add("active");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 200);
});
