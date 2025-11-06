const canvas = document.getElementById("canvasTorii");
const engine = new BABYLON.Engine(canvas, true);
let toriiMesh;

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

  const modelo = esMovil() ? "torii_movil.glb" : "torii.glb";
  await BABYLON.SceneLoader.AppendAsync("models/", modelo, scene);

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
    texto: `El Torii de Itsukushima, ubicado en la isla de Miyajima, Japón, es uno de los símbolos más icónicos del país. Su estructura actual data del siglo XIX, aunque el santuario al que pertenece fue fundado en el siglo VI. El torii parece flotar sobre el agua durante la marea alta, creando una imagen espiritual y majestuosa.`
  },
  autor: {
    titulo: "Autor",
    texto: `No se conoce un autor individual del Torii de Itsukushima, ya que su diseño responde a tradiciones arquitectónicas sintoístas. La construcción fue patrocinada por clanes poderosos como los Taira, quienes impulsaron el desarrollo del santuario como lugar sagrado.`
  },
  definicion: {
    titulo: "Definición artística",
    texto: `El torii es una puerta tradicional japonesa que marca la entrada a un santuario sintoísta. Su forma simple, con dos pilares verticales y dos travesaños horizontales, representa la transición entre lo mundano y lo espiritual. El de Itsukushima destaca por su color bermellón y su ubicación sobre el mar.`
  },
  tecnica: {
    titulo: "Técnica",
    texto: `El torii está construido en madera de alcanforero, una especie resistente a la humedad. Su base no está enterrada, sino que se sostiene por su propio peso y diseño estructural. Esto permite que se mantenga firme incluso durante tifones y mareas altas.`
  },
  detalles: {
    titulo: "Detalles relevantes",
    texto: `El Torii de Itsukushima mide aproximadamente 16 metros de altura y sus pilares principales tienen un diámetro de 1 metro. Es Patrimonio de la Humanidad por la UNESCO y uno de los lugares más fotografiados de Japón. Su imagen al atardecer es considerada una de las vistas más bellas del país.`
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
