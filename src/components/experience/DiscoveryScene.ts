import * as THREE from "three";
import { buildFormations, FORMATION_COUNT, type FormationData } from "./formations";

export interface SceneOptions {
  particleCount: number;
  reducedMotion: boolean;
}

// Per-act camera distance / height, world yaw and particle drift amplitude.
const CAM_Z = [17.5, 15.5, 16.5, 17, 12, 16];
const CAM_Y = [0, 1.8, 0, 0.6, 0.2, 0];
const YAW = [0, 0.4, 0, 0.8, 0.45, 0.1];
const DRIFT = [1.2, 0.45, 0.8, 0.9, 0.3, 0.8];

// Hold each formation at the start/end of a segment, morph through the middle.
const plateau = (t: number) => {
  const x = Math.min(1, Math.max(0, (t - 0.18) / 0.64));
  return x * x * (3 - 2 * x);
};
const lerp = THREE.MathUtils.lerp;

const VERT = /* glsl */ `
uniform float uMix;
uniform float uTime;
uniform float uSize;
uniform float uDrift;
uniform vec3 uTint;
uniform float uTintStrength;
attribute vec3 aTo;
attribute vec3 cFrom;
attribute vec3 cTo;
attribute float aRand;
varying vec3 vColor;

void main() {
  vec3 pos = mix(position, aTo, uMix);
  float ph = aRand * 6.28318;
  pos += uDrift * (0.35 + aRand * 0.65) * 0.14 * vec3(
    sin(uTime * 0.55 + ph * 7.0),
    cos(uTime * 0.42 + ph * 11.0),
    sin(uTime * 0.63 + ph * 13.0)
  );
  vec3 col = mix(cFrom, cTo, uMix);
  float lum = max(col.r, max(col.g, col.b));
  vColor = mix(col, uTint * lum, uTintStrength);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.5 + aRand * 0.9) * (130.0 / max(1.0, -mv.z));
}
`;

const FRAG = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.1, d);
  a *= a;
  gl_FragColor = vec4(vColor, a * uOpacity);
}
`;

function makeGlowSprite(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.4)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

const PACKET_COUNT = 56;

export class DiscoveryScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private group = new THREE.Group();
  private clock = new THREE.Clock();
  private data: FormationData;
  private count: number;

  private points: THREE.Points;
  private pointsGeo: THREE.BufferGeometry;
  private pointsMat: THREE.ShaderMaterial;

  private packets: THREE.Points;
  private packetsGeo: THREE.BufferGeometry;
  private packetsMat: THREE.PointsMaterial;
  private sprite: THREE.CanvasTexture;

  private bonds: THREE.LineSegments;
  private bondsGeo: THREE.BufferGeometry;
  private bondsMat: THREE.LineBasicMaterial;
  private bondBase = new THREE.Color("#58b8ff");

  private dust: THREE.Points;
  private dustGeo: THREE.BufferGeometry;
  private dustMat: THREE.PointsMaterial;

  private f = 0;
  private pairIndex = -1;
  private spin = 0;
  private pointer = { x: 0, y: 0 };
  private pointerS = { x: 0, y: 0 };
  private tintTarget: THREE.Color | null = null;
  private tint = new THREE.Color("#ffffff");
  private tintStrength = 0;
  private reducedMotion: boolean;
  private raf = 0;
  private disposed = false;
  private container: HTMLElement;

  constructor(container: HTMLElement, opts: SceneOptions) {
    this.container = container;
    this.count = opts.particleCount;
    this.reducedMotion = opts.reducedMotion;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.renderer.domElement.style.display = "block";
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
    this.camera.position.set(0, 0, CAM_Z[0]);

    this.data = buildFormations(this.count);
    this.scene.add(this.group);

    // -- morphing particle field --
    this.pointsGeo = new THREE.BufferGeometry();
    const rand = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) rand[i] = Math.random();
    this.pointsGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(this.count * 3), 3)
    );
    this.pointsGeo.setAttribute(
      "aTo",
      new THREE.BufferAttribute(new Float32Array(this.count * 3), 3)
    );
    this.pointsGeo.setAttribute(
      "cFrom",
      new THREE.BufferAttribute(new Float32Array(this.count * 3), 3)
    );
    this.pointsGeo.setAttribute(
      "cTo",
      new THREE.BufferAttribute(new Float32Array(this.count * 3), 3)
    );
    this.pointsGeo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));

    this.pointsMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 0.6 * this.renderer.getPixelRatio() },
        uDrift: { value: opts.reducedMotion ? 0 : 1 },
        uOpacity: { value: 0.9 },
        uTint: { value: new THREE.Color("#ffffff") },
        uTintStrength: { value: 0 },
      },
    });
    this.points = new THREE.Points(this.pointsGeo, this.pointsMat);
    this.points.frustumCulled = false;
    this.group.add(this.points);
    this.applyPair(0);

    // -- data packets orbiting the engine loop --
    this.sprite = makeGlowSprite();
    this.packetsGeo = new THREE.BufferGeometry();
    this.packetsGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(PACKET_COUNT * 3), 3)
    );
    this.packetsMat = new THREE.PointsMaterial({
      size: 0.32,
      map: this.sprite,
      color: 0xbfe6ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.packets = new THREE.Points(this.packetsGeo, this.packetsMat);
    this.packets.frustumCulled = false;
    this.packets.visible = false;
    this.group.add(this.packets);

    // -- crystal bonds --
    this.bondsGeo = new THREE.BufferGeometry();
    this.bondsGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(this.data.bondSegments, 3)
    );
    this.bondsMat = new THREE.LineBasicMaterial({
      color: this.bondBase.clone(),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.bonds = new THREE.LineSegments(this.bondsGeo, this.bondsMat);
    this.bonds.frustumCulled = false;
    this.bonds.visible = false;
    this.group.add(this.bonds);

    // -- near-field dust the camera flies through during scene dives --
    const dustCount = 340;
    const dustPos = new Float32Array(dustCount * 3);
    for (let k = 0; k < dustCount; k++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 12;
      dustPos[k * 3] = Math.cos(ang) * r;
      dustPos[k * 3 + 1] = Math.sin(ang) * r * 0.7;
      dustPos[k * 3 + 2] = -8 + Math.random() * 30;
    }
    this.dustGeo = new THREE.BufferGeometry();
    this.dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    this.dustMat = new THREE.PointsMaterial({
      size: 0.22,
      map: this.sprite,
      color: 0x7f9dff,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.dust = new THREE.Points(this.dustGeo, this.dustMat);
    this.dust.frustumCulled = false;
    this.scene.add(this.dust);

    this.resize();
    this.tick();
  }

  /** Continuous act index, 0..5. */
  setScroll(f: number) {
    this.f = Math.min(FORMATION_COUNT - 1, Math.max(0, f));
  }

  /** Normalized pointer, -1..1 on both axes. */
  setPointer(x: number, y: number) {
    this.pointer.x = x;
    this.pointer.y = y;
  }

  /** Tints the crystal act toward a material's colour; null restores. */
  setCrystalTint(hex: string | null) {
    this.tintTarget = hex ? new THREE.Color(hex) : null;
  }

  resize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.pointsMat.uniforms.uSize.value = 0.6 * this.renderer.getPixelRatio();
  }

  private applyPair(i: number) {
    this.pairIndex = i;
    const from = this.pointsGeo.getAttribute("position") as THREE.BufferAttribute;
    const to = this.pointsGeo.getAttribute("aTo") as THREE.BufferAttribute;
    const cFrom = this.pointsGeo.getAttribute("cFrom") as THREE.BufferAttribute;
    const cTo = this.pointsGeo.getAttribute("cTo") as THREE.BufferAttribute;
    (from.array as Float32Array).set(this.data.positions[i]);
    (to.array as Float32Array).set(this.data.positions[i + 1]);
    (cFrom.array as Float32Array).set(this.data.colors[i]);
    (cTo.array as Float32Array).set(this.data.colors[i + 1]);
    from.needsUpdate = to.needsUpdate = cFrom.needsUpdate = cTo.needsUpdate = true;
  }

  private tick = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);

    const dt = Math.min(0.05, this.clock.getDelta());
    const el = this.clock.elapsedTime;
    const f = this.f;
    const i = Math.min(FORMATION_COUNT - 2, Math.floor(f));
    if (i !== this.pairIndex) this.applyPair(i);
    const m = plateau(f - i);

    const u = this.pointsMat.uniforms;
    u.uMix.value = m;
    u.uTime.value = el;
    u.uDrift.value = this.reducedMotion ? 0 : lerp(DRIFT[i], DRIFT[i + 1], m);

    // Act proximity weights.
    const w = (k: number) => Math.max(0, 1 - Math.abs(f - k));
    const engineW = w(2);
    const crystalW = w(4);
    const atomW = w(5);

    // Slow world spin — decays near the engine act so cores stay left/right.
    this.spin +=
      dt * (0.05 * w(0) + 0.03 * w(1) + 0.1 * w(3) + 0.22 * crystalW + 0.28 * atomW);
    this.spin -= this.spin * Math.min(1, engineW * 2.5) * dt * 2;

    this.pointerS.x += (this.pointer.x - this.pointerS.x) * 0.05;
    this.pointerS.y += (this.pointer.y - this.pointerS.y) * 0.05;
    const wobble = this.reducedMotion ? 0 : Math.sin(el * 0.06) * 0.05;
    this.group.rotation.y =
      lerp(YAW[i], YAW[i + 1], m) + this.spin + this.pointerS.x * 0.28 + wobble;
    this.group.rotation.x = this.pointerS.y * 0.12;

    // Dive through the swarm at the heart of every transition.
    const dive = this.reducedMotion ? 0 : Math.sin(Math.PI * m);
    this.camera.position.z = lerp(CAM_Z[i], CAM_Z[i + 1], m) - dive * 6.5;
    this.camera.position.y = lerp(CAM_Y[i], CAM_Y[i + 1], m) - this.pointerS.y * 0.9;
    this.camera.position.x = this.pointerS.x * 1.2;
    this.camera.fov = 50 + dive * 14;
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(0, 0, 0);
    this.camera.rotation.z += dive * 0.07;

    this.dust.rotation.z += dt * 0.012;
    this.dustMat.opacity = 0.22 + dive * 0.5;

    // Engine data packets.
    this.packets.visible = engineW > 0.02;
    if (this.packets.visible) {
      this.packetsMat.opacity = engineW * 0.95;
      const attr = this.packetsGeo.getAttribute("position") as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      const v = new THREE.Vector3();
      const speed = this.reducedMotion ? 0.008 : 0.055;
      for (let k = 0; k < PACKET_COUNT; k++) {
        const t = (el * speed + k / PACKET_COUNT) % 1;
        this.data.loopCurve.getPointAt(t, v);
        arr[k * 3] = v.x;
        arr[k * 3 + 1] = v.y;
        arr[k * 3 + 2] = v.z;
      }
      attr.needsUpdate = true;
    }

    // Crystal bonds fade in once the lattice has settled.
    const bondW = Math.max(0, (crystalW - 0.55) / 0.45);
    this.bonds.visible = bondW > 0.01;
    this.bondsMat.opacity = bondW * bondW * 0.42;

    // Material-hover tint (crystal act only).
    const targetStrength = this.tintTarget ? 0.85 * crystalW : 0;
    this.tintStrength += (targetStrength - this.tintStrength) * 0.07;
    if (this.tintTarget) this.tint.lerp(this.tintTarget, 0.08);
    u.uTintStrength.value = this.tintStrength;
    (u.uTint.value as THREE.Color).copy(this.tint);
    this.bondsMat.color.lerp(
      this.tintTarget ?? this.bondBase,
      this.tintTarget ? 0.08 : 0.05
    );

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.pointsGeo.dispose();
    this.pointsMat.dispose();
    this.packetsGeo.dispose();
    this.packetsMat.dispose();
    this.bondsGeo.dispose();
    this.bondsMat.dispose();
    this.dustGeo.dispose();
    this.dustMat.dispose();
    this.sprite.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
