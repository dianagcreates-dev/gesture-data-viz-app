"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";

extend({ UnrealBloomPass });

function ParticleSwarm() {
  const meshRef = useRef();
  const count = 5000;
  const speedMult = 1;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const color = pColor; // Alias for user code compatibility

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++)
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
        ),
      );
    return pos;
  }, []);

  // Material & Geom
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0xffffff }),
    [],
  );
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), []);

  const PARAMS = useMemo(
    () => ({
      phase: 23228.93355000033,
      shock: 35,
      drift: 1.2,
      mass: 2.5,
      turb: 1.4,
    }),
    [],
  );
  const addControl = (id, l, min, max, val) => {
    return PARAMS[id] !== undefined ? PARAMS[id] : val;
  };
  const setInfo = () => {};
  const annotate = () => {};

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speedMult;

    if (material.uniforms && material.uniforms.uTime) {
      material.uniforms.uTime.value = time;
    }

    for (let i = 0; i < count; i++) {
      // USER CODE START
      // SUPERNOVA — Stellar Collapse & Nebula Expansion
      const phase = addControl("phase", "Explosion Phase", 0, 10, time * 0.3);
      const shockSize = addControl("shock", "Shockwave Radius", 5, 80, 35);
      const nebDrift = addControl("drift", "Nebula Drift", 0, 3, 1.2);
      const starMass = addControl("mass", "Progenitor Mass", 1, 5, 2.5);
      const turbulence = addControl("turb", "Turbulence", 0, 3, 1.4);

      // Time phases: 0-2 collapse, 2-4 shockwave, 4+ nebula
      const T = (time * 0.25) % 12.0;

      const coreCount = Math.floor(count * 0.08);
      const shockCount = Math.floor(count * 0.2);
      const ejectaCount = Math.floor(count * 0.45);
      const nebulaCount = Math.floor(count * 0.18);
      // rest = neutron star remnant

      let px, py, pz, h, s, l;

      // Seeded per-particle random helpers
      const seed1 = Math.sin(i * 127.1 + 311.7) * 43758.5;
      const rnd1 = seed1 - Math.floor(seed1);
      const seed2 = Math.sin(i * 269.5 + 183.3) * 43758.5;
      const rnd2 = seed2 - Math.floor(seed2);
      const seed3 = Math.sin(i * 419.2 + 74.1) * 43758.5;
      const rnd3 = seed3 - Math.floor(seed3);

      // Fibonacci sphere direction for this particle
      const golden = 2.399963;
      const fibTheta = Math.acos(1 - (2 * (i % 5000)) / 5000);
      const fibPhi = golden * (i % 5000);

      if (i < coreCount) {
        // — COLLAPSING CORE — implodes inward then bounces as neutron star
        const cn = i / coreCount;
        const pulse = Math.max(0, Math.sin(T * 1.5 - cn * 2.0));
        const collapseR = starMass * (4.0 - T * 0.8) * pulse + 0.5;
        const r = Math.max(0.3, collapseR) * (0.7 + cn * 0.6);
        const theta = cn * Math.PI * 2 * 37;
        const phi = Math.acos(1 - 2 * cn);
        const spin = time * (3.0 + cn * 5.0); // rapid spin-up
        px = r * Math.sin(phi) * Math.cos(theta + spin);
        py = r * Math.cos(phi);
        pz = r * Math.sin(phi) * Math.sin(theta + spin);
        // White-hot collapsing core -> blue neutron star
        const coreFade = Math.min(T * 0.4, 1.0);
        h = 0.55 + coreFade * 0.1;
        s = 0.6 + coreFade * 0.4;
        l = 0.5 + 0.4 * pulse;
      } else if (i < coreCount + shockCount) {
        // — SHOCKWAVE SHELL —
        const sn = (i - coreCount) / shockCount;
        const delay = rnd1 * 1.5; // stagger launch
        const tLocal = Math.max(0, T - delay);
        const expand = shockSize * Math.min(tLocal * 0.5, 1.0);
        const theta = sn * Math.PI * 2 * 200 + time * 0.5;
        const phi = Math.acos(1 - 2 * sn);
        const wobble = 1.0 + turbulence * 0.1 * Math.sin(sn * 47 + time * 3);
        const r = expand * wobble;
        // Filamentary structure - compress toward equatorial bands
        const equatBias = 1.0 + 0.3 * Math.abs(Math.cos(phi * 3));
        px = r * Math.sin(phi) * Math.cos(theta) * equatBias;
        py = r * Math.cos(phi);
        pz = r * Math.sin(phi) * Math.sin(theta) * equatBias;
        // Shockwave: blue-white leading edge, orange-red trailing
        const edgePct = Math.max(0, 1.0 - tLocal * 0.15);
        h = 0.05 + edgePct * 0.55;
        s = 1.0;
        l = 0.35 + edgePct * 0.45;
      } else if (i < coreCount + shockCount + ejectaCount) {
        // — STELLAR EJECTA (ASYMMETRIC JETS + LOBES) —
        const en = (i - coreCount - shockCount) / ejectaCount;
        const delay = rnd2 * 2.0;
        const tLocal = Math.max(0, T - delay);
        const speed = (0.5 + rnd1 * 0.8) * starMass * nebDrift;
        // Bipolar lobes: bias along polar axis
        const poleBias = Math.pow(Math.abs(Math.cos(fibTheta)), 1.5 - turbulence * 0.3);
        const r = tLocal * speed * (1.0 + poleBias * 1.5);
        const clumpAng = rnd3 * Math.PI * 2;
        const turbOff = turbulence * Math.sin(en * 73 + time * 1.5) * tLocal * 0.4;
        px = r * Math.sin(fibTheta + turbOff) * Math.cos(fibPhi + clumpAng);
        py = r * Math.cos(fibTheta) * (1.5 + poleBias);
        pz = r * Math.sin(fibTheta + turbOff) * Math.sin(fibPhi + clumpAng);
        // Heavy element coloring: oxygen=blue, sulfur=orange, hydrogen=red
        const elemBias = rnd1;
        h =
          elemBias < 0.33
            ? 0.6 + rnd2 * 0.08 // O-III blue-green
            : elemBias < 0.66
              ? 0.08 + rnd2 * 0.05 // S-II orange
              : 0.97 + rnd2 * 0.03; // H-alpha red
        s = 0.85 + rnd3 * 0.15;
        l = 0.2 + rnd2 * 0.35 * Math.min(tLocal * 0.3, 1.0);
      } else if (i < coreCount + shockCount + ejectaCount + nebulaCount) {
        // — NEBULA SHELL + PILLARS OF CREATION —
        const nn = (i - coreCount - shockCount - ejectaCount) / nebulaCount;
        const delay = rnd1 * 3.0;
        const tLocal = Math.max(0, T - delay);
        const baseR = shockSize * 0.9 + tLocal * nebDrift * 0.3;
        const theta = nn * Math.PI * 2 * 500;
        const phi2 = Math.acos(1 - 2 * nn);
        // Clumpy filaments — Rayleigh-Taylor instability
        const clump =
          1.0 +
          turbulence * 0.25 * Math.sin(nn * 89 + time * 0.4) * Math.sin(nn * 37 + time * 0.7);
        const r = baseR * clump * (0.85 + rnd2 * 0.3);
        px = r * Math.sin(phi2) * Math.cos(theta + time * 0.04);
        py = r * Math.cos(phi2) * (1.0 + 0.2 * Math.sin(nn * 13));
        pz = r * Math.sin(phi2) * Math.sin(theta + time * 0.04);
        // Emission nebula palette: pillars=teal, ionized=magenta, dust=amber
        const zonePick = rnd3;
        h =
          zonePick < 0.4
            ? 0.48 + rnd1 * 0.06 // teal pillars
            : zonePick < 0.7
              ? 0.82 + rnd1 * 0.08 // magenta ionized
              : 0.07 + rnd1 * 0.05; // amber dust lanes
        s = 0.9;
        l = 0.15 + rnd2 * 0.25 * Math.min(tLocal * 0.2, 1.0);
      } else {
        // — NEUTRON STAR REMNANT + PULSAR WIND —
        const pn =
          (i - coreCount - shockCount - ejectaCount - nebulaCount) /
          (count - coreCount - shockCount - ejectaCount - nebulaCount + 1);
        const pulsarR = 1.5 + pn * 4.0;
        const beamAng = pn * Math.PI * 2 * 60 + time * 8.0; // fast pulsar spin
        const beamH = Math.sin(time * 8 + pn * Math.PI) * 6 * pn;
        px = Math.cos(beamAng) * pulsarR * (1 - pn * 0.5);
        py = beamH;
        pz = Math.sin(beamAng) * pulsarR * (1 - pn * 0.5);
        // Pulsar: brilliant blue-white
        h = 0.58 + pn * 0.05;
        s = 0.7;
        l = 0.5 + 0.4 * (1 - pn) * Math.abs(Math.sin(time * 8 + pn * 6));
      }

      // Global gravitational dimming far from center
      const dist = Math.sqrt(px * px + py * py + pz * pz);
      l = Math.max(0, l - dist * 0.002);

      target.set(px, py, pz);
      color.setHSL(h % 1, s, Math.min(l, 0.95));

      if (i === 0) {
        setInfo(
          "Supernova Type II",
          "Core collapse of a massive star. Shockwave, bipolar ejecta jets, " +
            "emission nebula with Rayleigh-Taylor pillars, and spinning pulsar remnant.",
        );
        annotate("core", new THREE.Vector3(0, 0, 0), "NEUTRON STAR");
        annotate("jet_n", new THREE.Vector3(0, shockSize * 1.4, 0), "POLAR JET");
        annotate("nebula", new THREE.Vector3(shockSize, 0, 0), "NEBULA SHELL");
      }
      // USER CODE END

      positions[i].lerp(target, 0.1);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}

export function SupernovaSwarm({ className }) {
  return (
    <div className={className ?? "h-full w-full"}>
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={["#000000", 0.01]} />
        <ParticleSwarm />
        <OrbitControls autoRotate />
        <Effects disableGamma>
          <unrealBloomPass threshold={0} strength={1.8} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  );
}

export default SupernovaSwarm;
