import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/** Two exact study meshes, one synchronized camera and a vertical clipping plane. */
export async function createFlaskViewer(mount) {
  const family = mount.dataset.family;
  if (family !== 'glass' && family !== 'plastic') return () => {};
  const title = family === 'glass' ? 'Pressed-baffle geometry' : 'V-fold geometry';
  const baffles = family === 'glass' ? 'Four pressed baffles' : 'Four V-fold baffles';
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const abort = new AbortController();
  const on = (element, event, callback) => element.addEventListener(event, callback, { signal: abort.signal });
  mount.innerHTML = `
    <div class="flask-viewer__stage">
      <div class="flask-viewer__labels" aria-hidden="true"><span>No baffles</span><span>${baffles}</span></div>
    </div>
    <div class="flask-viewer__tools" role="group" aria-label="${title} view controls">
      <button type="button" data-action="left" aria-label="Rotate ${title.toLowerCase()} left">↶ <span>Rotate</span></button>
      <button type="button" data-action="right" aria-label="Rotate ${title.toLowerCase()} right">↷ <span>Rotate</span></button>
      <button type="button" data-action="in" aria-label="Zoom in on ${title.toLowerCase()}">+</button>
      <button type="button" data-action="out" aria-label="Zoom out from ${title.toLowerCase()}">−</button>
      <button type="button" data-action="reset">Reset view</button>
    </div>
    <div class="flask-viewer__slice">
      <label class="flask-viewer__toggle"><input type="checkbox" data-cut checked /> Vertical cutaway</label>
      <label>Cut angle <output data-angle-output>0°</output><input type="range" data-angle min="-180" max="180" step="1" value="0" aria-label="${title} vertical cut angle" /></label>
      <label>Cut position <output data-position-output>Center</output><input type="range" data-position min="-85" max="85" step="1" value="0" aria-label="${title} vertical cut position" /></label>
    </div>
    <p class="flask-viewer__hint">Drag to rotate both · scroll or pinch to zoom · teal highlights the baffles.</p>
    <p class="flask-viewer__status" role="status">Loading the two study surfaces…</p>`;
  const stage = mount.querySelector('.flask-viewer__stage');
  const status = mount.querySelector('.flask-viewer__status');
  const cut = mount.querySelector('[data-cut]');
  const angle = mount.querySelector('[data-angle]');
  const position = mount.querySelector('[data-position]');
  const materials = [];
  const scenes = [];
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  let renderer;
  let controls;
  let resizeObserver;
  let frame;
  let disposed = false;
  let width = 1;
  let height = 1;
  let radius = 1;
  let defaultDistance = 1;
  let viewReady = false;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 10000);
  camera.up.set(0, 0, 1);

  const dispose = () => {
    disposed = true;
    abort.abort();
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    controls?.dispose();
    for (const scene of scenes) scene.traverse(object => {
      object.geometry?.dispose();
      if (object.material) {
        for (const material of [object.material].flat()) material.dispose();
      }
    });
    renderer?.dispose();
    renderer?.forceContextLoss();
  };

  function render() {
    frame = undefined;
    if (disposed || !viewReady) return;
    renderer.setScissorTest(true);
    const leftWidth = Math.floor(width / 2);
    for (let i = 0; i < 2; i++) {
      const x = i ? leftWidth : 0;
      const panelWidth = i ? width - leftWidth : leftWidth;
      camera.aspect = panelWidth / height;
      camera.updateProjectionMatrix();
      renderer.setViewport(x, 0, panelWidth, height);
      renderer.setScissor(x, 0, panelWidth, height);
      renderer.render(scenes[i], camera);
    }
    mount.dataset.azimuth = controls.getAzimuthalAngle().toFixed(3);
    mount.dataset.cut = String(cut.checked);
    mount.dataset.cutAngle = angle.value;
    mount.dataset.cutPosition = position.value;
  }
  function requestRender() {
    if (!frame && !disposed) frame = requestAnimationFrame(render);
  }
  function updateCut() {
    const radians = THREE.MathUtils.degToRad(Number(angle.value));
    plane.normal.set(Math.sin(radians), Math.cos(radians), 0);
    plane.constant = -Number(position.value) / 100 * radius;
    for (const material of materials) {
      material.clippingPlanes = cut.checked ? [plane] : [];
      material.needsUpdate = true;
    }
    angle.disabled = position.disabled = !cut.checked;
    mount.querySelector('[data-angle-output]').value = `${angle.value}°`;
    mount.querySelector('[data-position-output]').value = position.value === '0' ? 'Center' : `${Number(position.value) > 0 ? '+' : ''}${position.value}%`;
    requestRender();
  }
  function rotate(amount) {
    const offset = camera.position.clone().sub(controls.target);
    offset.applyAxisAngle(new THREE.Vector3(0, 0, 1), amount);
    camera.position.copy(controls.target).add(offset);
    controls.update();
    requestRender();
  }
  function zoom(factor) {
    const offset = camera.position.clone().sub(controls.target);
    offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance));
    camera.position.copy(controls.target).add(offset);
    controls.update();
    requestRender();
  }
  function reset() {
    camera.position.set(0.48, -0.82, 0.31).normalize().multiplyScalar(defaultDistance);
    controls.target.set(0, 0, 0);
    camera.lookAt(controls.target);
    controls.update();
    cut.checked = true;
    angle.value = position.value = '0';
    updateCut();
  }

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xf3f6f5);
    renderer.localClippingEnabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `${title}: no baffles on the left, ${baffles.toLowerCase()} on the right. Drag to rotate; arrow keys rotate, plus and minus zoom, Home resets.`);
    stage.prepend(canvas);
    controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.minPolarAngle = 0.02;
    controls.maxPolarAngle = Math.PI - 0.02;
    controls.zoomSpeed = 0.65;
    controls.addEventListener('change', requestRender);
    const loader = new GLTFLoader();
    const models = await Promise.all(['plain', 'baffled'].map(async variant => {
      const result = await loader.loadAsync(`${base}/flask-mixing/models/${family}-${variant}.glb`);
      if (disposed) {
        result.scene.traverse(object => { object.geometry?.dispose(); for (const material of [object.material ?? []].flat()) material.dispose(); });
        return null;
      }
      return result.scene;
    }));
    if (disposed) return dispose;
    const bounds = new THREE.Box3();
    for (const model of models) bounds.union(new THREE.Box3().setFromObject(model));
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3()).multiplyScalar(1000);
    radius = Math.max(size.x, size.y) / 2;
    for (const model of models) {
      // Source Z-up metres -> display millimetres; identical transform for each pair.
      const group = new THREE.Group();
      group.scale.setScalar(1000);
      group.position.copy(center).multiplyScalar(-1000);
      group.add(model);
      model.traverse(object => {
        if (!object.isMesh) return;
        const old = [object.material].flat();
        object.material = new THREE.MeshStandardMaterial({
          color: object.geometry.hasAttribute('color') ? 0xffffff : (old[0]?.color?.clone() ?? new THREE.Color(0xb8c8ca)),
          vertexColors: object.geometry.hasAttribute('color'),
          roughness: 0.57,
          metalness: 0.06,
          side: THREE.DoubleSide,
          clippingPlanes: [plane],
        });
        materials.push(object.material);
        for (const material of old) material.dispose();
      });
      const scene = new THREE.Scene();
      scene.add(group, new THREE.HemisphereLight(0xffffff, 0x45585b, 2.6));
      const key = new THREE.DirectionalLight(0xffffff, 3.3);
      key.position.set(100, -150, 220);
      const fill = new THREE.DirectionalLight(0xc6e8eb, 1.4);
      fill.position.set(-180, 100, 80);
      scene.add(key, fill);
      scenes.push(scene);
    }
    viewReady = true;
    function resize() {
      const previous = defaultDistance;
      width = Math.max(2, Math.floor(stage.clientWidth));
      height = Math.max(1, Math.floor(stage.clientHeight));
      renderer.setSize(width, height, false);
      const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const aspect = width / 2 / height;
      defaultDistance = Math.max(size.z * 0.53 / tangent, radius / (tangent * aspect)) * 1.24;
      controls.minDistance = size.z * 0.28;
      controls.maxDistance = defaultDistance * 3;
      if (previous === 1) reset();
      else {
        camera.position.sub(controls.target).multiplyScalar(defaultDistance / previous).add(controls.target);
        controls.update();
      }
      requestRender();
    }
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();
    for (const element of [cut, angle, position]) on(element, 'input', updateCut);
    on(mount.querySelector('.flask-viewer__tools'), 'click', event => {
      const action = event.target.closest('button')?.dataset.action;
      if (action === 'left') rotate(-Math.PI / 9);
      if (action === 'right') rotate(Math.PI / 9);
      if (action === 'in') zoom(0.8);
      if (action === 'out') zoom(1.25);
      if (action === 'reset') reset();
    });
    on(canvas, 'keydown', event => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key)) event.preventDefault();
      if (event.key === 'ArrowLeft') rotate(-Math.PI / 18);
      if (event.key === 'ArrowRight') rotate(Math.PI / 18);
      if (event.key === '+' || event.key === '=') zoom(0.9);
      if (event.key === '-') zoom(1.1);
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const offset = camera.position.clone().sub(controls.target);
        const right = new THREE.Vector3().crossVectors(offset, camera.up).normalize();
        offset.applyAxisAngle(right, event.key === 'ArrowUp' ? 0.12 : -0.12);
        camera.position.copy(controls.target).add(offset);
        controls.update();
      }
      if (event.key === 'Home') reset();
    });
    on(canvas, 'webglcontextlost', () => {
      status.textContent = 'The 3D view was interrupted. Reload the page to restore it.';
      mount.dataset.state = 'interrupted';
    });
    status.textContent = 'Both views share the same camera and cut. Turn off the cutaway to see the full shape.';
    mount.dataset.state = 'ready';
    requestRender();
  } catch (error) {
    dispose();
    mount.dataset.state = 'error';
    status.replaceChildren(document.createTextNode('Interactive 3D is unavailable in this browser. '));
    const link = document.createElement('a');
    link.href = `${base}/flask-mixing/geometry/${family === 'glass' ? 'duran' : 'biofil'}_geometry_comparison.png`;
    link.textContent = 'View the geometry comparison image.';
    status.append(link);
    mount.querySelectorAll('button, input').forEach(element => { element.disabled = true; });
    console.error('Flask geometry viewer:', error);
  }
  return dispose;
}
