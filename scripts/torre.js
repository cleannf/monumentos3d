const canvas = document.getElementById("canvasTorre");
const engine = new BABYLON.Engine(canvas, true);
let torreMesh;

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

  const modelo = esMovil() ? "torre_movil.glb" : "torre.glb";
  await BABYLON.SceneLoader.AppendAsync("models/", modelo, scene);

  torreMesh = scene.meshes.find(m => m.name && m.name !== "__root__");
  if (torreMesh) {
    torreMesh.position = new BABYLON.Vector3(0, 0, 0);
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
    texto: `La Torre Eiffel fue construida para la Exposición Universal de París en 1889, conmemorando el centenario de la Revolución Francesa. Diseñada por Gustave Eiffel, inicialmente fue criticada por artistas e intelectuales, pero con el tiempo se convirtió en el símbolo más reconocido de Francia.`
  },
  autor: {
    titulo: "Autor",
    texto: `Gustave Eiffel fue el ingeniero detrás del proyecto, aunque el diseño inicial fue realizado por Maurice Koechlin y Émile Nouguier. Eiffel defendió la obra ante las críticas y supervisó su construcción, que duró poco más de dos años.`
  },
  definicion: {
    titulo: "Definición artística",
    texto: `La torre representa el espíritu industrial del siglo XIX. Su estructura metálica expuesta rompió con los estilos arquitectónicos tradicionales, convirtiéndose en un ícono del modernismo y la ingeniería. Su forma estilizada y simétrica le da una estética única.`
  },
  tecnica: {
    titulo: "Técnica",
    texto: `Construida con más de 18,000 piezas de hierro pudelado y 2.5 millones de remaches, la torre fue ensamblada como un gigantesco mecano. Su diseño permite una gran resistencia al viento y estabilidad estructural, siendo una obra maestra de la ingeniería de su época.`
  },
  detalles: {
    titulo: "Detalles relevantes",
    texto: `La Torre Eiffel mide 330 metros de altura incluyendo antenas, y fue la estructura más alta del mundo hasta 1930. Tiene tres niveles accesibles al público, y su iluminación nocturna la convierte en uno de los monumentos más fotografiados del planeta.`
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
