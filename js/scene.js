/** Three.js hero sahnesi: parçacıklar, tel kafes geometri ve düşük maliyetli paralaks. */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  var mount = document.getElementById('hero-3d-scene');
  if (!mount) return;
  if (!window.THREE) { mount.classList.add('webgl-fallback'); return; }

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia('(max-width: 768px)').matches;
  var particleCount = mobile ? 260 : (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4 ? 450 : 850);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.z = 7;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: 'high-performance' });
  } catch (error) {
    mount.classList.add('webgl-fallback');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(mount.clientWidth, mount.clientHeight, false);
  mount.appendChild(renderer.domElement);

  var particleGeometry = new THREE.BufferGeometry();
  var particlePositions = new Float32Array(particleCount * 3);
  for (var i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 14;
    particlePositions[i + 1] = (Math.random() - 0.5) * 8;
    particlePositions[i + 2] = (Math.random() - 0.5) * 8;
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  var particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x67e8f9, size: mobile ? 0.035 : 0.045, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending }));
  scene.add(particles);

  var group = new THREE.Group();
  var icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 1), new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.45 }));
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(2.15, 20, 14), new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.13 }));
  var ring = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.012, 8, 96), new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.55 }));
  ring.rotation.x = Math.PI / 2.8;
  group.add(icosahedron, sphere, ring);
  group.position.set(2.2, 0.2, 0);
  scene.add(group);

  var pointer = { x: 0, y: 0 };
  var target = { x: 0, y: 0 };
  var running = true;
  var lastTime = 0;
  function resize() {
    if (!mount.clientWidth || !mount.clientHeight) return;
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
  }
  function animate(time) {
    if (!running) return;
    requestAnimationFrame(animate);
    var delta = Math.min((time - lastTime) / 1000 || 0.016, 0.05);
    lastTime = time;
    if (!reducedMotion) {
      pointer.x += (target.x - pointer.x) * 0.035;
      pointer.y += (target.y - pointer.y) * 0.035;
      group.rotation.y += delta * 0.18;
      group.rotation.x += delta * 0.07;
      particles.rotation.y += delta * 0.012;
      group.position.x = 2.2 + pointer.x * 0.35;
      group.position.y = 0.2 + pointer.y * 0.25;
      camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.025;
      camera.position.y += (-pointer.y * 0.25 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);
    }
    renderer.render(scene, camera);
  }
  window.addEventListener('pointermove', function (event) { target.x = (event.clientX / window.innerWidth - 0.5) * 2; target.y = (event.clientY / window.innerHeight - 0.5) * 2; }, { passive: true });
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) { lastTime = performance.now(); animate(lastTime); } });
  resize();
  animate(performance.now());
});
