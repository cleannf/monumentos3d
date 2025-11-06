const canvas = document.getElementById("canvasLibertad");
const engine = new BABYLON.Engine(canvas, true);
let libertadMesh;

function esMovil() {
  return window.innerWidth <= 768;
}

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 2, Math.PI / 2.5, 6, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1;

  const modelo = esMovil() ? "libertad_movil.glb" : "libertad.glb";
  await BABYLON.SceneLoader.AppendAsync("models/", modelo, scene);

  libertadMesh = scene.meshes.find(m => m.name && m.name !== "__root__");
  if (libertadMesh) {
    libertadMesh.position = new BABYLON.Vector3(0, 0, 0);
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
    texto: `La Estatua de la Libertad fue un regalo de Francia a Estados Unidos en 1886, como símbolo de amistad y libertad. Fue diseñada por Frédéric Auguste Bartholdi y construida con la ayuda del ingeniero Gustave Eiffel. Se erige en la isla de la Libertad en Nueva York y ha sido un ícono de bienvenida para millones de inmigrantes.`
  },
  autor: {
    titulo: "Autor",
    texto: `Frédéric Auguste Bartholdi fue el escultor principal de la estatua, mientras que Gustave Eiffel diseñó la estructura interna. Bartholdi se inspiró en la figura de Libertas, la diosa romana de la libertad, y trabajó durante años para concretar el proyecto con apoyo del pueblo francés.`
  },
  definicion: {
    titulo: "Definición artística",
    texto: `La estatua pertenece al estilo neoclásico, con influencias del arte romano. Representa a una mujer con una corona de siete puntas, una antorcha en alto y una tabla con la fecha de la independencia estadounidense. Su diseño transmite fuerza, esperanza y libertad.`
  },
  tecnica: {
    titulo: "Técnica",
    texto: `La estructura está hecha de hierro y cobre, con una técnica de ensamblaje por paneles. Eiffel diseñó un esqueleto interno que permite que la estatua resista vientos y movimientos. El cobre fue martillado y moldeado para formar la figura, y luego ensamblado sobre la estructura metálica.`
  },
  detalles: {
    titulo: "Detalles relevantes",
    texto: `La estatua mide 46 metros desde los pies hasta la cabeza, y 93 metros incluyendo el pedestal. Pesa más de 200 toneladas y su antorcha original fue reemplazada por una nueva en 1986. Es Patrimonio de la Humanidad y uno de los monumentos más visitados del mundo.`
  }
};

// --- Elementos visuales ---
const instruccionesTexto = document.querySelector(".monumento-instrucciones-texto");
const instruccionesTitulo = document.querySelector(".monumento-instrucciones-titulo");
const infoBlock = document.querySelector(".monumento-info");

const menuToggle = document.getElementById("menuToggle");
const menuOpciones = document.getElementById("menuOpciones");

if (esMovil() && menuToggle && menuOpciones) {
  menuToggle.addEventListener("click", () => {
    menuOpciones.classList.toggle("activo");
  });
}

const infoContenido = document.createElement("div");
infoContenido.style.marginTop = "40px";
infoContenido.style.display = "none";
infoBlock.appendChild(infoContenido);

document.querySelectorAll(".monumento-button").forEach(btn => {
  btn.addEventListener("click", () => {
    const topic = btn.dataset.topic;
    const { titulo, texto } = contenidos[topic];

    document.querySelectorAll(".monumento-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    instruccionesTexto.style.display = "none";
    instruccionesTitulo.style.display = "none";

    infoContenido.innerHTML = `
      <h2 style="font-family: 'Limelight', cursive; font-size: 1.4rem; margin-bottom: 10px;">${titulo}</h2>
      <p style="font-family: 'Karla', sans-serif; font-size: 1rem; color: #ccc; line-height: 1.6;">${texto}</p>
    `;
    infoContenido.classList.remove("fade-in");
    void infoContenido.offsetWidth;
    infoContenido.classList.add("fade-in");
    infoContenido.style.display = "block";

    if (esMovil()) {
      menuOpciones.classList.remove("activo");
    }
  });
});

document.querySelector(".monumento-volver").addEventListener("click", () => {
  const volverBtn = document.querySelector(".monumento-volver");
  volverBtn.classList.add("active");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 200);
});
