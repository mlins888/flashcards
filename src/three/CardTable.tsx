import { Suspense, useLayoutEffect, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

/** Direction the camera looks down at the table from (normalized later). */
const VIEW_DIR = new THREE.Vector3(0, 10, 6).normalize();
const FOV = 35;

/** Moves the camera back along VIEW_DIR until a `width × depth` area of table fits on screen. */
function CameraRig({ width, depth, center }: { width: number; depth: number; center?: [number, number, number] }) {
  const [cx, cy, cz] = center ?? [0, 0, 0];
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const vHalf = THREE.MathUtils.degToRad(FOV / 2);
    const hHalf = Math.atan(Math.tan(vHalf) * aspect);
    const elevation = Math.asin(VIEW_DIR.y);
    const projectedDepth = depth * Math.sin(elevation) + 0.6;
    const dist = Math.max(width / 2 / Math.tan(hHalf), projectedDepth / 2 / Math.tan(vHalf)) * 1.08 + 1;
    const target = new THREE.Vector3(cx, cy, cz);
    camera.fov = FOV;
    camera.position.copy(target).addScaledVector(VIEW_DIR, dist);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }, [camera, size, width, depth, cx, cy, cz]);
  return null;
}

export interface CardTableProps {
  children: ReactNode;
  /** Table area (world units) that must stay visible. */
  fit: { width: number; depth: number; center?: [number, number, number] };
  className?: string;
  label: string;
}

export function CardTable({ children, fit, className, label }: CardTableProps) {
  return (
    <div className={`stage ${className ?? ''}`} role="img" aria-label={label}>
      <Canvas dpr={[1, 2]} shadows={false} camera={{ fov: FOV, position: [0, 10, 6] }} gl={{ antialias: true, alpha: true }}>
        <CameraRig {...fit} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[-4, 9, 5]} intensity={1.6} />
        <directionalLight position={[5, 4, -3]} intensity={0.35} color="#ffd9b0" />
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2.2} position={[0, 6, 2]} scale={[12, 4, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={0.8} color="#ffcfa0" position={[-6, 2, 0]} scale={[4, 8, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={0.6} color="#b8c8ff" position={[6, 2, 0]} scale={[4, 8, 1]} rotation-y={-Math.PI / 2} />
        </Environment>
        <ContactShadows position={[0, 0, 0]} scale={40} opacity={0.5} blur={2.4} far={3} resolution={512} color="#0b0812" />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
