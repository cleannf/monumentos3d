const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

  // Cámara
  const camera = new BABYLON.ArcRotateCamera(
    "cam",
    Math.PI / 2,
    Math.PI / 2.2,
    8,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.wheelDeltaPercentage = 0.01;
  camera.lowerRadiusLimit = 1.5;
  camera.upperRadiusLimit = 80;
  camera.attachControl(canvas, true);

  // Luces
  const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
  hemi.intensity = 0.95;
  const dir = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(-0.5, -1, 0.3), scene);
  dir.position = new BABYLON.Vector3(5, 10, -5);
  dir.intensity = 1.0;

  // Fondo
  const bgSphere = BABYLON.MeshBuilder.CreateSphere("backgroundSphere", { diameter: 200, sideOrientation: BABYLON.Mesh.BACKSIDE }, scene);
  const bgMat = new BABYLON.StandardMaterial("bgMat", scene);
  bgMat.backFaceCulling = false;
  bgMat.specularColor = new BABYLON.Color3(0, 0, 0);
  bgMat.diffuseTexture = new BABYLON.Texture("assets/background.jpg", scene, true, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
  bgMat.diffuseTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
  bgSphere.material = bgMat;
  bgSphere.isPickable = false;

  // --- CARGAR PLANETA ---
  await BABYLON.SceneLoader.AppendAsync("models/", "earth.glb", scene);

  // Ajustar cámara al planeta
  const earth = scene.meshes.find(m => m.name && m.name !== "__root__" && m.name !== "backgroundSphere");
  if (earth) {
    earth.refreshBoundingInfo(true);
    const bs = earth.getBoundingInfo().boundingSphere;
    const r = bs.radiusWorld || bs.radius;
    camera.target = BABYLON.Vector3.Zero();
    camera.radius = Math.max(2, r * 2.2);
    camera.lowerRadiusLimit = Math.max(1, r * 0.6);
    camera.upperRadiusLimit = Math.max(r * 12, 80);
  }

  // --- CARGAR PINES ---
  const pinFiles = ["Pin_1.glb", "Pin_2.glb", "Pin_3.glb", "Pin_4.glb"];
  for (const file of pinFiles) {
    await BABYLON.SceneLoader.AppendAsync("models/", file, scene);
  }
  console.log("=== LISTA DE MESHES EN LA ESCENA ===");
  scene.meshes.forEach(m => console.log(m.name));

  // --- PANEL DE INFORMACIÓN ---
  const infoPanel = document.getElementById("infoPanel");
  const tituloEl = document.getElementById("monumentoTitulo");
  const paisEl = document.getElementById("monumentoPais");

  const pinInfo = {
  "Pin_1_primitive0": { pais: "Brasil", monumento: "Cristo Redentor", destino: "cristo.html" },
  "Pin_2_primitive0": { pais: "Estados Unidos", monumento: "Estatua de la Libertad", destino: "libertad.html" },
  "Pin_3_primitive0": { pais: "Francia", monumento: "Torre de París", destino: "torre.html" },
  "Pin_4_primitive0": { pais: "Japón", monumento: "Torii de Itsukushima Shrine", destino: "torii.html" }
  };

  // Asignar acciones a cada pin
  Object.keys(pinInfo).forEach(pinName => {
    const pinMesh = scene.getMeshByName(pinName);
    if (pinMesh) {
      pinMesh.isPickable = true;
      pinMesh.actionManager = new BABYLON.ActionManager(scene);

      // Mostrar info al pasar el cursor
      pinMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOverTrigger,
          () => {
            tituloEl.textContent = pinInfo[pinName].monumento;
            paisEl.textContent = pinInfo[pinName].pais;
            infoPanel.style.display = "block";
          }
        )
      );

      // Ocultar info al salir el cursor
      pinMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOutTrigger,
          () => {
            infoPanel.style.display = "none";
          }
        )
      );
    } else {
      console.warn("No se encontró el mesh:", pinName);
    }
  });

  scene.meshes.forEach(mesh => {
  for (const key in pinInfo) {
    if (mesh.name.includes(key)) {
      mesh.isPickable = true;
      mesh.actionManager = new BABYLON.ActionManager(scene);

      // Hover: mostrar panel
      mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOverTrigger,
          () => {
            tituloEl.textContent = pinInfo[key].monumento;
            paisEl.textContent = pinInfo[key].pais;
            infoPanel.style.display = "block";
          }
        )
      );

      // Salida del cursor: ocultar panel
      mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOutTrigger,
          () => {
            infoPanel.style.display = "none";
          }
        )
      );

      //  Clic: redirigir a la página del monumento
      mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          () => {
            irAMonumento(pinInfo[key].destino);
          }
        )
      );
    }
  }
});

  // --- Función de transición ---
const overlay = document.querySelector(".transition-overlay");

function irAMonumento(url) {
  overlay.classList.add("active"); // activa el fade-out
  setTimeout(() => {
    window.location.href = url; // redirige después de la animación
  }, 800); // mismo tiempo que el transition en CSS
}

  return scene;
};

// --- INICIAR ESCENA ---
(async function () {
  const scene = await createScene();
  engine.runRenderLoop(() => {
    if (scene) scene.render();
  });
})();

// Ajuste al redimensionar ventana
window.addEventListener("resize", () => {
  engine.resize();
});
