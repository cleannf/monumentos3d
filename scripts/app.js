function esMovil() {
  return window.innerWidth <= 768;
}

const canvas = document.getElementById("renderCanvas");
canvas.setAttribute("tabindex", "0"); // permite que el canvas reciba foco
canvas.addEventListener("touchstart", () => {
  canvas.focus();
});
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
engine.getInputElement().setAttribute("touch-action", "none");

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

  // Cargar modelos según dispositivo
  const earthFile = esMovil() ? "earth_mobile.glb" : "earth.glb";
  const pinFiles = esMovil()
    ? ["Pin_1_mobile.glb", "Pin_2_mobile.glb", "Pin_3_mobile.glb", "Pin_4_mobile.glb"]
    : ["Pin_1.glb", "Pin_2.glb", "Pin_3.glb", "Pin_4.glb"];

  // --- CARGAR PLANETA ---
  await BABYLON.SceneLoader.AppendAsync("models/", earthFile, scene);

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
  for (const file of pinFiles) {
  await BABYLON.SceneLoader.AppendAsync("models/", file, scene);
  }
  console.log("=== LISTA DE MESHES EN LA ESCENA ===");
  scene.meshes.forEach(m => console.log(m.name));

  console.log("=== LISTA DE MESHES EN LA ESCENA ===");
  scene.meshes.forEach(m => console.log(m.name));

  // --- PANEL DE INFORMACIÓN ---
  const infoPanel = document.getElementById("infoPanel");
  const tituloEl = document.getElementById("monumentoTitulo");
  const paisEl = document.getElementById("monumentoPais");

  const btnVisitar = document.getElementById("btnVisitar");
  const pinInfoDesktop = {
    "Pin_1_primitive0": { pais: "Brasil", monumento: "Cristo Redentor", destino: "cristo.html" },
    "Pin_2_primitive0": { pais: "Estados Unidos", monumento: "Estatua de la Libertad", destino: "libertad.html" },
    "Pin_3_primitive0": { pais: "Francia", monumento: "Torre de París", destino: "torre.html" },
    "Pin_4_primitive0": { pais: "Japón", monumento: "Torii de Itsukushima Shrine", destino: "torii.html" }
  };

  const pinInfoMovil = {
    "Pin1movil_primitive0": { pais: "Brasil", monumento: "Cristo Redentor", destino: "cristo.html" },
    "Pin2movil_primitive0": { pais: "Estados Unidos", monumento: "Estatua de la Libertad", destino: "libertad.html" },
    "Pin3movil_primitive0": { pais: "Francia", monumento: "Torre de París", destino: "torre.html" },
    "Pin4movil_primitive0": { pais: "Japón", monumento: "Torii de Itsukushima Shrine", destino: "torii.html" }
  };
  const pinInfo = esMovil() ? pinInfoMovil : pinInfoDesktop;

console.log("=== ASIGNANDO ACCIONES A LOS PINES ===");
console.log("Usando pinInfo:", pinInfo);

Object.keys(pinInfo).forEach(pinKey => {
  const targetMesh = scene.getMeshByName(pinKey);
  if (targetMesh) {
    console.log("🎯 Asignando acciones a:", targetMesh.name);
    targetMesh.isVisible = true;
    targetMesh.setEnabled(true);
    targetMesh.isPickable = true;
    targetMesh.actionManager = new BABYLON.ActionManager(scene);

    // Hover (solo escritorio)
    if (!esMovil()) {
      targetMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOverTrigger,
          () => {
            tituloEl.textContent = pinInfo[pinKey].monumento;
            paisEl.textContent = pinInfo[pinKey].pais;
            infoPanel.style.display = "block";
            btnVisitar.style.display = "none";
          }
        )
      );

      targetMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOutTrigger,
          () => {
            infoPanel.style.display = "none";
            btnVisitar.style.display = "none";
          }
        )
      );
    }

    // Clic (móvil y escritorio)
    targetMesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        () => {
          console.log("✅ Pin tocado:", targetMesh.name);
          console.log("✅ Ejecutando OnPickTrigger para:", targetMesh.name);
          tituloEl.textContent = pinInfo[pinKey].monumento;
          paisEl.textContent = pinInfo[pinKey].pais;
          infoPanel.style.display = "block";

          if (esMovil()) {
            btnVisitar.style.display = "inline-block";
            btnVisitar.onclick = () => {
              irAMonumento(pinInfo[pinKey].destino);
            };
          } else {
            btnVisitar.style.display = "none";
            irAMonumento(pinInfo[pinKey].destino);
          }
        }
      )
    );
  } else {
    console.warn("⚠️ No se encontró el mesh para:", pinKey);
  }
});

// 🔽 Detectar clic o toque fuera de los pines
scene.onPointerObservable.add((pointerInfo) => {
  if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
    const pickedMesh = pointerInfo.pickInfo?.pickedMesh;

    // Verificar si el mesh tocado está en pinInfo
    const nombresDePines = Object.keys(pinInfo);
    const esPin = pickedMesh && nombresDePines.includes(pickedMesh.name);

    if (!esPin) {
      infoPanel.style.display = "none";
      btnVisitar.style.display = "none";
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
  scene.onPointerObservable.add((pointerInfo) => {
    console.log("📱 Evento táctil:", pointerInfo.type, pointerInfo.pickInfo?.pickedMesh?.name);
  });
  engine.runRenderLoop(() => {
    if (scene) scene.render();
  });
})();

// Ajuste al redimensionar ventana
window.addEventListener("resize", () => {
  engine.resize();
});
