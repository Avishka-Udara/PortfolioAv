import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Interactive 3D viewer, vanilla three.js.
 *
 * The mesh is lit with a procedurally generated studio environment (no network
 * fetch) so metals and plastics read properly, auto-rotates while idle, and
 * yields the moment a pointer goes down — drag to orbit, scroll to zoom.
 *
 * Everything is built and torn down explicitly in an effect: no reconciler
 * layer in between, so mount/unmount is deterministic.
 */

export function ModelCanvas({
  src,
  className,
  metalness = 0.85,
  roughness = 0.28,
  color = "#e9e9ec",
}: {
  src: string;
  className?: string;
  metalness?: number;
  roughness?: number;
  color?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 1;
    let height = mount.clientHeight || 1;

    // -- renderer -------------------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      // keeps the drawing buffer readable between frames so the viewer can be
      // screenshotted / inspected; negligible cost for a single model
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";

    // -- scene & environment -------------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c10);
    scene.fog = new THREE.Fog(0x0c0c10, 3.4, 7);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
    scene.environment = envTex;

    // -- camera ---------------------------------------------------------
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(1.2, 0.7, 1.7);

    // -- lights ---------------------------------------------------------
    const ambient = new THREE.AmbientLight(0xffffff, 0.32);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(2.6, 3.4, 2.2);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 12;
    key.shadow.bias = -0.0002;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x8fd8ff, 0.5);
    rim.position.set(-2.6, 1.4, -2.2);
    scene.add(rim);

    // soft ground shadow
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.ShadowMaterial({ opacity: 0.45 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // -- controls -------------------------------------------------------
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.75;
    controls.minDistance = 0.9;
    controls.maxDistance = 4;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI / 1.75;

    // -- model ----------------------------------------------------------
    const objects: THREE.Object3D[] = [];
    const loader = new OBJLoader();
    let disposed = false;
    let frame = 0;

    loader.load(
      src,
      (object) => {
        if (disposed) return;

        // normalise to unit size at the origin so wildly different scales
        // all frame up identically
        const box = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        const max = Math.max(size.x, size.y, size.z);
        const scale = max > 0 ? 1 / max : 1;
        object.position.sub(center.multiplyScalar(scale));
        object.scale.setScalar(scale);

        object.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            metalness,
            roughness,
            envMapIntensity: 1.15,
          });
        });

        scene.add(object);
        objects.push(object);
        // paint immediately so the viewer shows content even if the rAF loop
        // is throttled (background tab, reduced-motion environments)
        renderer.render(scene, camera);
        setLoading(false);
      },
      undefined,
      (err) => {
        if (disposed) return;
        console.error("model failed to load:", src, err);
        setLoading(false);
      }
    );

    // -- animation loop --------------------------------------------------
    let pointerDown = false;
    const onDown = () => (pointerDown = true);
    const onUp = () => (pointerDown = false);
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    let last = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      // auto-rotate while the pointer isn't driving the camera
      if (!pointerDown) {
        for (const o of objects) o.rotation.y += delta * 0.22;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    // -- resize ----------------------------------------------------------
    const resize = () => {
      width = mount.clientWidth || 1;
      height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // -- cleanup ---------------------------------------------------------
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      controls.dispose();
      for (const o of objects) {
        o.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.geometry?.dispose();
            const mat = mesh.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat?.dispose();
          }
        });
      }
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [src, color, metalness, roughness]);

  return (
    <div className={className} ref={mountRef}>
      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-ink-2">
          <span className="mono animate-pulse text-dim">Loading model…</span>
        </div>
      )}
    </div>
  );
}
