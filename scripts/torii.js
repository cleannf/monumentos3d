const canvas = document.getElementById("canvasTorii");
const engine = new BABYLON.Engine(canvas, true);
let toriiMesh;

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 2, Math.PI / 2.5, 6, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1;

  await BABYLON.SceneLoader.AppendAsync("models/", "torii.glb", scene);

  toriiMesh = scene.meshes.find(m => m.name && m.name !== "__root__");
  if (toriiMesh) {
    toriiMesh.position = new BABYLON.Vector3(0, 0, 0);
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
    texto: `El Gran Torii se encuentra frente al Santuario de Itsukushima, en la isla de Miyajima, al suroeste de Japón. Su construcción original se remonta al siglo XII, durante el dominio del clan Taira, aunque la versión actual data de 1875, cuando fue reconstruido siguiendo la tradición. Este torii se ha mantenido como uno de los símbolos más importantes del sintoísmo y de la cultura japonesa, pues al estar erigido en el mar, crea la ilusión de flotar cuando sube la marea, lo que refuerza su carácter sagrado y místico.`
  },
  autor: {
    titulo: "Autor",
    texto: `No existe un autor individual, ya que se trata de una obra tradicional construida por maestros artesanos y arquitectos japoneses. La familia Taira, especialmente Taira no Kiyomori, fue la responsable de impulsar la monumentalidad del santuario y de su icónico torii durante el siglo XII.`
  },
  definicion: {
    titulo: "Definición artística",
    texto: `El torii de Itsukushima es un ejemplo de arquitectura sintoísta tradicional, donde cada elemento arquitectónico tiene un valor espiritual más que decorativo. Los torii marcan la entrada a un espacio sagrado, dividiendo el mundo profano del mundo espiritual. Este, en particular, con 16 metros de altura y pintado en color bermellón intenso, es uno de los más imponentes de Japón y un ícono visual reconocido a nivel mundial.`
  },
  tecnica: {
    titulo: "Técnica",
    texto: `El torii está construido principalmente en madera de alcanforero (camphor wood), conocida por su gran resistencia y durabilidad frente al agua. Su estructura alcanza un peso cercano a las 60 toneladas, lo que le permite sostenerse sobre el lecho marino sin necesidad de anclajes profundos. El intenso color rojo bermellón no solo lo hace resaltar frente al mar y las montañas, sino que además tiene un valor simbólico en la tradición japonesa, pues se considera un color protector contra las malas energías y los espíritus malignos.`
  },
  detalles: {
    titulo: "Detalles relevantes",
    texto: `El Gran Torii, junto con el Santuario de Itsukushima, fue declarado Patrimonio de la Humanidad por la UNESCO en 1996. Es uno de los paisajes más fotografiados de Japón y cambia radicalmente con la marea: durante la marea alta parece flotar en el agua, mientras que en la marea baja se puede llegar caminando hasta sus enormes pilares. Además de su valor estético, es considerado un umbral hacia lo divino, un símbolo de la conexión entre los humanos, la naturaleza y lo sagrado.`
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
