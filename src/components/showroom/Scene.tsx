"use client";

// The corridor scene: bone-white 16:10 planes single-file on −z with
// alternating x offsets, camera dollying along z with scroll. Flat
// MeshBasicMaterial everywhere (no lights/shadows — brand + perf). The
// focused plane gets a signal-yellow backing frame (the viewport's one
// yellow element) — a slightly larger plane behind it, hard edges, no glow.

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { ShowroomItem } from "@/content/showroom";

const PLANE_W = 8;
const PLANE_H = 5;
const GAP_Z = 6;          // distance between planes on -z
const X_OFFSET = 1.7;     // alternating lateral offset
const CAM_LEAD = 4.2;     // camera distance ahead of the focused plane

function texPath(item: ShowroomItem) {
  return `/showroom/tex/${item.slug}.webp`;
}

function CorridorPlane({
  item,
  index,
  focused,
}: {
  item: ShowroomItem;
  index: number;
  focused: boolean;
}) {
  const tex = useTexture(texPath(item));
  tex.colorSpace = THREE.SRGBColorSpace;
  const x = (index % 2 === 0 ? 1 : -1) * X_OFFSET;
  const z = -index * GAP_Z;

  return (
    <group position={[x, 0, z]}>
      {/* signal-yellow frame — only on the focused plane */}
      <mesh position={[0, 0, -0.02]} scale={focused ? 1.03 : 0}>
        <planeGeometry args={[PLANE_W, PLANE_H]} />
        <meshBasicMaterial color="#EBFF00" toneMapped={false} />
      </mesh>
      {/* bone mat behind the screenshot for hard border */}
      <mesh position={[0, 0, -0.01]} scale={1.015}>
        <planeGeometry args={[PLANE_W, PLANE_H]} />
        <meshBasicMaterial color="#F5F1E8" toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[PLANE_W, PLANE_H]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function Scene({
  items,
  progressRef,
  focusIndex,
}: {
  items: ShowroomItem[];
  progressRef: MutableRefObject<number>;
  focusIndex: number;
}) {
  const { camera } = useThree();
  const targetZ = useRef(CAM_LEAD);

  const totalTravel = useMemo(
    () => (items.length - 1) * GAP_Z,
    [items.length]
  );

  useFrame(() => {
    const p = progressRef.current;
    targetZ.current = CAM_LEAD - p * totalTravel;
    // Snappy ease toward target — reads brand's --snap feel without a lib.
    camera.position.z += (targetZ.current - camera.position.z) * 0.18;
    // Slight lateral drift toward the focused plane's side.
    const focusX = (focusIndex % 2 === 0 ? 1 : -1) * X_OFFSET * 0.25;
    camera.position.x += (focusX - camera.position.x) * 0.08;
    camera.lookAt(camera.position.x, 0, camera.position.z - CAM_LEAD);
  });

  return (
    <>
      <color attach="background" args={["#0E0E0E"]} />
      {items.map((item, i) => (
        <CorridorPlane
          key={item.slug}
          item={item}
          index={i}
          focused={i === focusIndex}
        />
      ))}
    </>
  );
}
