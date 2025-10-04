"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react/jsx-runtime"; // Import JSX for type declarations

type Dice3DProps = {
  a: number;
  b: number;
  rollKey: number; // bump this to trigger a new tumble+settle animation
  className?: string;
  diceColor?: string; // new prop
  canvaClassname?: string; // new prop
};

// Map top-face result to a final orientation (Euler) for a die with:
// top=1, bottom=6, right=3, left=4, front=2, back=5.
function orientationFor(n: number): THREE.Euler {
  switch (n) {
    case 1:
      return new THREE.Euler(0, 0, 0); // top already 1
    case 2:
      return new THREE.Euler(-Math.PI / 2, 0, 0); // front -> top
    case 3:
      return new THREE.Euler(0, 0, Math.PI / 2); // right -> top
    case 4:
      return new THREE.Euler(0, 0, -Math.PI / 2); // left -> top
    case 5:
      return new THREE.Euler(Math.PI / 2, 0, 0); // back -> top
    case 6:
      return new THREE.Euler(Math.PI, 0, 0); // bottom -> top
    default:
      return new THREE.Euler(0, 0, 0);
  }
}

export function Dice3D({
  a,
  b,
  rollKey,
  className,
  diceColor,
  canvaClassname,
}: Dice3DProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0.5, 5, 1], fov: 30 }} // higher Y, closer Z
        dpr={[1, 2]}
        shadows
        onCreated={(state) => (state.gl.domElement.crossOrigin = "anonymous")}
        className={canvaClassname}
      >
        {/* Two dice */}
        <Die3D
          value={a}
          rollKey={rollKey}
          position={[-0.5, 0.5, 0.3]}
          diceColor={diceColor}
        />
        <Die3D
          value={b}
          rollKey={rollKey}
          position={[0.9, 0.6, 0]}
          diceColor={diceColor}
        />

        {/* Subtle studio environment */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

function Die3D({
  value,
  rollKey,
  position = [0, 0.5, 0],
  diceColor,
}: {
  value: number;
  rollKey: number;
  position?: [number, number, number];
  diceColor?: string;
}) {
  const group = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Mesh>(null!);
  const [target] = useState(() => new THREE.Quaternion());
  const spinRef = useRef({ t: 0, vx: 0, vy: 0, vz: 0 });
  const settling = useRef(false);

  // Precompute the final orientation for the requested value
  const targetQuat = useMemo(() => {
    const e = orientationFor(value);
    const q = new THREE.Quaternion().setFromEuler(e);
    return q;
  }, [value]);

  // When rollKey changes, start a tumble then settle to target orientation
  useEffect(() => {
    // Spin for ~0.7-1.1s with random angular velocity
    spinRef.current = {
      t: 0.7 + Math.random() * 0.4,
      vx: 6 + Math.random() * 6,
      vy: 6 + Math.random() * 6,
      vz: 6 + Math.random() * 6,
    };
    // Settle after spin
    settling.current = true;
    target.copy(targetQuat);
  }, [rollKey, targetQuat, target]);

  // Initialize to show value without animation on first mount
  useEffect(() => {
    group.current?.quaternion.copy(targetQuat);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, dt) => {
    // Phase 1: tumble
    if (spinRef.current.t > 0 && group.current) {
      const s = spinRef.current;
      group.current.rotation.x += s.vx * dt;
      group.current.rotation.y += s.vy * dt;
      group.current.rotation.z += s.vz * dt;
      s.t -= dt;
      return;
    }
    // Phase 2: slerp toward the exact target to display the value
    if (settling.current && group.current) {
      const q = group.current.quaternion;
      q.slerp(target, Math.min(1, 6 * dt));
      // Stop when close enough
      if (q.angleTo(target) < 0.005) {
        group.current.quaternion.copy(target);
        settling.current = false;
      }
    }
  });

  return (
    <group ref={group} position={position} castShadow receiveShadow>
      {/* Die body */}
      <RoundedBox
        ref={body}
        args={[1, 1, 1]} // width, height, depth
        radius={0.3} // more rounded edges
        smoothness={5} // higher for smoother
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={diceColor || "#ffffff"}
          roughness={0.45}
          metalness={0.05}
        />
      </RoundedBox>

      {/* Pips (21 total) - sized and positioned per face */}
      {createPips()}
    </group>
  );
}

// Helpers to generate pips on all faces for a standard die
function createPips(): JSX.Element[] {
  const pips: JSX.Element[] = [];
  const r = 0.06; // pip radius
  const d = 0.14; // distance from center for grid
  const s = 0.5 - 0.05; // face plane offset
  let i = 0;
  const Pip = ({ position }: { position: [number, number, number] }) => (
    <mesh key={i++} position={position} castShadow>
      <sphereGeometry args={[r, 16, 16]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
  );

  // Axis helper: axis 'x'|'y'|'z', sign +-1, coordinates in the other two axes
  const addFace = (
    axis: "x" | "y" | "z",
    sign: 1 | -1,
    coords: [number, number][]
  ) => {
    coords.forEach(([u, v]) => {
      if (axis === "x") pips.push(<Pip position={[sign * s, u, v]} />);
      if (axis === "y") pips.push(<Pip position={[u, sign * s, v]} />);
      if (axis === "z") pips.push(<Pip position={[u, v, sign * s]} />);
    });
  };

  // Top (+Y): 1
  addFace("y", +1, [[0, 0]]);

  // Bottom (-Y): 6
  addFace("y", -1, [
    [-d, d],
    [-d, 0],
    [-d, -d],
    [d, d],
    [d, 0],
    [d, -d],
  ]);

  // Right (+X): 3
  addFace("x", +1, [
    [-d, d],
    [0, 0],
    [d, -d],
  ]);

  // Left (-X): 4
  addFace("x", -1, [
    [-d, d],
    [d, d],
    [-d, -d],
    [d, -d],
  ]);

  // Front (+Z): 2
  addFace("z", +1, [
    [-d, d],
    [d, -d],
  ]);

  // Back (-Z): 5
  addFace("z", -1, [
    [-d, d],
    [d, d],
    [0, 0],
    [-d, -d],
    [d, -d],
  ]);

  return pips;
}

export default Dice3D;
