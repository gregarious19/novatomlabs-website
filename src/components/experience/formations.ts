import * as THREE from "three";

// Six particle formations, one per scroll "act":
// 0 nebula · 1 search-space lattice · 2 LLM⇄LQM engine · 3 screening funnel
// 4 zincblende crystal (NexCon-03) · 5 NovAtom atom mark
export const FORMATION_COUNT = 6;

export interface FormationData {
  positions: Float32Array[];
  colors: Float32Array[];
  /** Line-segment endpoints for the crystal's tetrahedral bonds. */
  bondSegments: Float32Array;
  /** Closed curve the engine's data packets travel along. */
  loopCurve: THREE.CatmullRomCurve3;
}

const DIM = new THREE.Color("#16294f");
const BLUE = new THREE.Color("#2f6bf0");
const ELECTRON = new THREE.Color("#5b8cff");
const CYAN = new THREE.Color("#59d8ff");
const VIOLET = new THREE.Color("#9d7bff");
const TEAL = new THREE.Color("#37e6a0");
const FUSION = new THREE.Color("#ffb02e");
const PHOTON = new THREE.Color("#ff5c9d");
const WHITE = new THREE.Color("#f2f6ff");

const LEMNISCATE_A = 6.4;

function lemniscate(s: number, out: THREE.Vector3) {
  const den = 1 + Math.sin(s) * Math.sin(s);
  out.set(
    (LEMNISCATE_A * Math.cos(s)) / den,
    (LEMNISCATE_A * Math.sin(s) * Math.cos(s)) / den,
    0
  );
  return out;
}

export function buildFormations(count: number): FormationData {
  const positions: Float32Array[] = [];
  const colors: Float32Array[] = [];
  for (let k = 0; k < FORMATION_COUNT; k++) {
    positions.push(new Float32Array(count * 3));
    colors.push(new Float32Array(count * 3));
  }

  const col = new THREE.Color();
  const v = new THREE.Vector3();

  const put = (k: number, i: number, x: number, y: number, z: number) => {
    positions[k][i * 3] = x;
    positions[k][i * 3 + 1] = y;
    positions[k][i * 3 + 2] = z;
  };
  const putC = (k: number, i: number, c: THREE.Color, mul = 1) => {
    colors[k][i * 3] = c.r * mul;
    colors[k][i * 3 + 1] = c.g * mul;
    colors[k][i * 3 + 2] = c.b * mul;
  };

  // ---- 0 · Nebula — the unexplored dark ----------------------------------
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.55) * 9.5;
    const theta = Math.random() * Math.PI * 2 + r * 0.32;
    const y = (Math.random() - 0.5) * Math.max(0.4, 1 - r / 12) * 4.6;
    put(0, i, Math.cos(theta) * r, y, Math.sin(theta) * r * 0.85 - 1);
    const t = Math.random();
    col.copy(DIM).lerp(ELECTRON, t * t);
    if (Math.random() < 0.14) col.lerp(VIOLET, 0.7);
    const spark = Math.random();
    if (spark < 0.01) col.copy(PHOTON);
    else if (spark < 0.04) col.copy(WHITE);
    putC(0, i, col, 0.9);
  }

  // ---- 1 · Search space — a vast candidate lattice ------------------------
  {
    const nx = 25;
    const ny = 11;
    const nz = Math.ceil(count / (nx * ny));
    const s = 1.15;
    for (let i = 0; i < count; i++) {
      const ix = i % nx;
      const iy = Math.floor(i / nx) % ny;
      const iz = Math.floor(i / (nx * ny));
      const j = () => (Math.random() - 0.5) * 0.16;
      put(
        1,
        i,
        (ix - (nx - 1) / 2) * s + j(),
        (iy - (ny - 1) / 2) * s + j(),
        (iz - (nz - 1) / 2) * s * 1.2 - 2 + j()
      );
      const roll = Math.random();
      if (roll < 0.004) putC(1, i, WHITE, 1.2);
      else if (roll < 0.012) putC(1, i, FUSION, 1.1);
      else if (roll < 0.032) putC(1, i, CYAN, 1.0);
      else putC(1, i, DIM, 0.55 + Math.random() * 0.35);
    }
  }

  // ---- 2 · The engine — LLM core ⇄ LQM core + hypothesis loop -------------
  {
    const nLeft = Math.floor(count * 0.42);
    const nRight = Math.floor(count * 0.84);
    for (let i = 0; i < count; i++) {
      if (i < nRight) {
        const left = i < nLeft;
        const cx = left ? -4.5 : 4.5;
        v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
          .normalize()
          .multiplyScalar(2.25 * Math.pow(Math.random(), 0.32));
        put(2, i, cx + v.x, v.y, v.z);
        const shell = v.length() / 2.25;
        col.copy(left ? BLUE : VIOLET).lerp(ELECTRON, Math.random() * 0.5);
        putC(2, i, col, 0.45 + shell * 0.75);
      } else {
        const s = Math.random() * Math.PI * 2;
        lemniscate(s, v);
        put(
          2,
          i,
          v.x + (Math.random() - 0.5) * 0.2,
          v.y + (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.35
        );
        col.copy(CYAN).lerp(WHITE, Math.random() * 0.5);
        putC(2, i, col, 1.1);
      }
    }
  }

  // ---- 3 · The loop — millions screened down to the validated few ---------
  for (let i = 0; i < count; i++) {
    const h = Math.random();
    const ang =
      (i % 6) * ((Math.PI * 2) / 6) +
      h * Math.PI * 7 +
      (Math.random() - 0.5) * 0.35;
    const rad = THREE.MathUtils.lerp(7.2, 0.25, Math.pow(h, 0.85));
    put(3, i, Math.cos(ang) * rad, 5.4 - h * 10.8, Math.sin(ang) * rad);
    if (h > 0.985) putC(3, i, WHITE, 1.3);
    else {
      // Dark ember at the mouth of the funnel, blazing amber at the tip.
      col.copy(FUSION).multiplyScalar(0.18 + Math.pow(h, 1.4) * 0.95);
      putC(3, i, col, 1);
    }
  }

  // ---- 4 · NexCon-03 — a zincblende semiconductor crystal -----------------
  const bonds: number[] = [];
  {
    const a = 1.9;
    const fcc = [
      [0, 0, 0],
      [0, 0.5, 0.5],
      [0.5, 0, 0.5],
      [0.5, 0.5, 0],
    ];
    const sitesA: THREE.Vector3[] = [];
    const sitesB: THREE.Vector3[] = [];
    for (let ix = -3; ix <= 2; ix++)
      for (let iy = -3; iy <= 2; iy++)
        for (let iz = -3; iz <= 2; iz++)
          for (const [ox, oy, oz] of fcc) {
            const pa = new THREE.Vector3(
              (ix + ox + 0.25) * a,
              (iy + oy + 0.25) * a,
              (iz + oz + 0.25) * a
            );
            if (pa.length() <= 4.5) sitesA.push(pa);
            const pb = new THREE.Vector3(
              pa.x + 0.25 * a,
              pa.y + 0.25 * a,
              pa.z + 0.25 * a
            );
            if (pb.length() <= 4.5) sitesB.push(pb);
          }

    const bondMax = 0.5 * a;
    for (const b of sitesB)
      for (const s of sitesA)
        if (b.distanceTo(s) <= bondMax)
          bonds.push(s.x, s.y, s.z, b.x, b.y, b.z);

    const sites = [
      ...sitesA.map((p) => ({ p, b: false })),
      ...sitesB.map((p) => ({ p, b: true })),
    ];
    const perSite = Math.max(
      1,
      Math.floor((count * 0.62) / Math.max(1, sites.length))
    );
    let idx = 0;
    outer: for (const site of sites) {
      for (let k = 0; k < perSite; k++) {
        if (idx >= count) break outer;
        put(
          4,
          idx,
          site.p.x + (Math.random() - 0.5) * 0.12,
          site.p.y + (Math.random() - 0.5) * 0.12,
          site.p.z + (Math.random() - 0.5) * 0.12
        );
        col.copy(site.b ? TEAL : ELECTRON).lerp(WHITE, Math.random() * 0.25);
        putC(4, idx, col, 0.9);
        idx++;
      }
    }
    // Leftovers become distant ambient dust so the crystal reads clean.
    for (; idx < count; idx++) {
      v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(9 + Math.random() * 6);
      put(4, idx, v.x, v.y, v.z);
      putC(4, idx, DIM, 0.25 + Math.random() * 0.2);
    }
  }

  // ---- 5 · Horizon — the NovAtom mark: nucleus + three orbits -------------
  {
    const nNucleus = Math.floor(count * 0.16);
    const nRings = Math.floor(count * 0.88);
    const ringColors = [ELECTRON, CYAN, PHOTON];
    for (let i = 0; i < count; i++) {
      if (i < nNucleus) {
        v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
          .normalize()
          .multiplyScalar(1.25 * Math.pow(Math.random(), 0.7));
        put(5, i, v.x, v.y, v.z);
        col.copy(WHITE).lerp(ELECTRON, Math.random() * 0.6);
        putC(5, i, col, 1.1);
      } else if (i < nRings) {
        const ring = i % 3;
        const ang = Math.random() * Math.PI * 2;
        v.set(Math.cos(ang) * 5.8, Math.sin(ang) * 5.8 * 0.38, 0);
        v.applyAxisAngle(new THREE.Vector3(0, 0, 1), ring * (Math.PI / 3));
        v.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.38);
        put(
          5,
          i,
          v.x + (Math.random() - 0.5) * 0.14,
          v.y + (Math.random() - 0.5) * 0.14,
          v.z + (Math.random() - 0.5) * 0.14
        );
        putC(5, i, ringColors[ring], 0.85 + Math.random() * 0.3);
      } else {
        v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
          .normalize()
          .multiplyScalar(10 + Math.random() * 6);
        put(5, i, v.x, v.y, v.z);
        putC(5, i, DIM, 0.25);
      }
    }
  }

  const curvePts: THREE.Vector3[] = [];
  for (let k = 0; k < 96; k++)
    curvePts.push(lemniscate((k / 96) * Math.PI * 2, new THREE.Vector3()).clone());

  return {
    positions,
    colors,
    bondSegments: new Float32Array(bonds),
    loopCurve: new THREE.CatmullRomCurve3(curvePts, true),
  };
}
