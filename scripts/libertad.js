const canvas = document.getElementById("canvasLibertad");
const engine = new BABYLON.Engine(canvas, true);
let libertadMesh;

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 2, Math.PI / 2.5, 6, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1;

  await BABYLON.SceneLoader.AppendAsync("models/", "libertad.glb", scene);

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
    texto: `La Estatua de la Libertad, oficialmente llamada La Libertad iluminando al mundo, fue un regalo del pueblo francés a Estados Unidos para conmemorar el centenario de la independencia norteamericana y celebrar la amistad entre ambos países. Su inauguración tuvo lugar el 28 de octubre de 1886 en la isla de la Libertad (antes Bedloe’s Island), en el puerto de Nueva York. La idea original fue propuesta por el político y jurista francés Édouard René de Laboulaye, quien imaginó un monumento que simbolizara los valores de libertad y democracia compartidos por ambas naciones.`
  },
  autor: {
    titulo: "Autor",
    texto: `El diseño artístico de la estatua estuvo a cargo del escultor francés Frédéric Auguste Bartholdi, mientras que la ingeniería de su estructura interna fue obra de Alexandre Gustave Eiffel, el mismo creador de la Torre Eiffel. Bartholdi fue responsable de la concepción estética y de la majestuosa figura femenina, mientras que Eiffel ideó el armazón metálico que sostiene la escultura, permitiendo que resista el viento y el paso del tiempo.`
  },
  definicion: {
    titulo: "Definición artística",
    texto: `La Estatua de la Libertad es un monumento de estilo neoclásico, inspirado en las formas de la antigua Roma y Grecia, lo que le da un aire solemne y monumental. Representa a Libertas, la diosa romana de la libertad, que sostiene en su mano derecha una antorcha en alto como símbolo de iluminación, y en la izquierda una tabla con la fecha de la independencia estadounidense: 4 de julio de 1776. A sus pies descansan unas cadenas rotas, que refuerzan el mensaje de liberación y esperanza.`
  },
  tecnica: {
    titulo: "Técnica",
    texto: `La estatua mide 46 metros de altura (93 si se incluye el pedestal) y está construida en cobre martillado, con un grosor de apenas unos milímetros, sostenido por una estructura de hierro diseñada por Eiffel. Con el paso del tiempo, el cobre adquirió una pátina de color verde por la oxidación, lo que le otorgó su aspecto característico. La técnica utilizada combinó escultura monumental con soluciones ingenieriles pioneras para la época, permitiendo que fuera transportada desde Francia en piezas y luego ensamblada en Nueva York.`
  },
  detalles: {
    titulo: "Detalles relevantes",
    texto: `La Estatua de la Libertad fue declarada Monumento Nacional de Estados Unidos en 1924 y en 1984 se incorporó a la lista de Patrimonio de la Humanidad por la UNESCO. Más allá de su valor artístico y técnico, es reconocida como un símbolo universal de libertad, democracia y esperanza para millones de inmigrantes que llegaban a Nueva York en busca de un futuro mejor, siendo la primera imagen que muchos veían al entrar al país.`
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
