const canvas = document.getElementById("canvasTorre");
const engine = new BABYLON.Engine(canvas, true);
let torreMesh;

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 2, Math.PI / 2.5, 6, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1;

  await BABYLON.SceneLoader.AppendAsync("models/", "torre.glb", scene);

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
    texto: `La Torre Eiffel fue construida como pieza central para la Exposición Universal de París de 1889, organizada en conmemoración del centenario de la Revolución Francesa. Su construcción comenzó en 1887 y finalizó en un tiempo récord de poco más de dos años, siendo inaugurada el 31 de marzo de 1889. Aunque en un inicio fue objeto de críticas por parte de artistas y ciudadanos, quienes la consideraban antiestética, con el paso del tiempo se convirtió en el mayor símbolo de París y de Francia a nivel mundial.`
  },
  autor: {
    titulo: "Autor",
    texto: `El proyecto fue diseñado por el ingeniero Gustave Eiffel y su empresa, aunque el verdadero trabajo de diseño recayó en dos de sus colaboradores: Maurice Koechlin y Émile Nouguier, quienes concibieron la estructura metálica. El arquitecto Stephen Sauvestre aportó los detalles decorativos. Finalmente, fue bautizada con el apellido de Eiffel en reconocimiento al ingeniero que dirigió su construcción.`
  },
  definicion: {
    titulo: "Definición artística",
    texto: `La Torre Eiffel pertenece al movimiento de la arquitectura del hierro, propio de la segunda mitad del siglo XIX, cuando las nuevas técnicas constructivas buscaban mostrar la modernidad y el avance industrial. Aunque inicialmente fue vista como una obra puramente funcional, con el tiempo se valoró su estética vanguardista, que combina ligereza visual con monumentalidad. Hoy es considerada un ícono de la arquitectura moderna.`
  },
  tecnica: {
    titulo: "Técnica",
    texto: `La torre está construida íntegramente en hierro forjado, con más de 18.000 piezas unidas por 2,5 millones de remaches. Mide 300 metros de altura (330 con antenas actuales) y durante más de 40 años fue la estructura más alta del mundo. La técnica utilizada consistió en un montaje progresivo de piezas metálicas prefabricadas, ensambladas como un gigantesco mecano. Su diseño, con forma de pirámide curva, fue ideado para resistir la fuerza del viento, algo revolucionario para su tiempo.`
  },
  detalles: {
    titulo: "Detalles relevantes",
    texto: `Hoy en día, la Torre Eiffel recibe más de 7 millones de visitantes al año, siendo uno de los monumentos más visitados del mundo. Está iluminada cada noche con un sistema de luces que resalta su silueta en el cielo parisino. Además de su función turística, ha tenido usos científicos y tecnológicos, sirviendo como antena de radio y televisión. Lo que en su momento fue considerado una “monstruosidad de hierro” se transformó en un símbolo universal del arte, la ingeniería y la identidad francesa.`
  }
};

// --- Elementos visuales ---
const instruccionesTexto = document.querySelector(".monumento-instrucciones-texto");
const instruccionesTitulo = document.querySelector(".monumento-instrucciones-titulo");
const infoBlock = document.querySelector(".monumento-info");

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
    infoContenido.classList.remove("fade-in");
    void infoContenido.offsetWidth;
    infoContenido.classList.add("fade-in");
    infoContenido.style.display = "block";
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
