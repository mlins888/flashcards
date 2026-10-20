import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Lightformer } from '@react-three/drei';
import type * as THREE from 'three';
import { Card3D, CardLabel, CardText } from './Card3D';
import { TENSE_COLOR } from './theme';
import { useReducedMotion } from './useReducedMotion';

const FAN = [
  { tense: 'present', word: 'hablo', label: 'yo · presente' },
  { tense: 'preterite', word: 'hablé', label: 'yo · pretérito' },
  { tense: 'imperfect', word: 'hablaba', label: 'yo · imperfecto' },
] as const;

function Fan() {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  useFrame(({ clock }) => {
    if (group.current && !reduced) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.25;
  });
  return (
    <group ref={group} rotation={[0.2, 0, 0]}>
      {FAN.map((c, i) => (
        <Float key={c.tense} speed={reduced ? 0 : 1.4} rotationIntensity={0.15} floatIntensity={0.4}>
          <group position={[(i - 1) * 2.05, (1 - Math.abs(i - 1)) * 0.3, (1 - Math.abs(i - 1)) * 0.3]} rotation={[0, 0, (1 - i) * 0.12]}>
            <group rotation={[Math.PI / 2, 0, 0]}>
              <Card3D
                position={[0, 0, 0]}
                width={2.2}
                height={3.1}
                accent={TENSE_COLOR[c.tense]}
                hoverable={false}
                front={
                  <>
                    <CardLabel y={1.15}>{c.label}</CardLabel>
                    <CardText size={0.48}>{c.word}</CardText>
                  </>
                }
              />
            </group>
          </group>
        </Float>
      ))}
    </group>
  );
}

/** Pull the camera back on narrow screens so the whole fan fits. */
function FitCamera() {
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / s.size.height);
  useFrame(() => {
    const halfTan = Math.tan(((35 / 2) * Math.PI) / 180);
    camera.position.z = Math.max(8.5, 7.4 / 2 / (halfTan * aspect));
  });
  return null;
}

export function HeroDeck() {
  return (
    <div className="stage hero-stage" aria-hidden="true">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8.5], fov: 35 }} gl={{ alpha: true, antialias: true }}>
        <FitCamera />
        <ambientLight intensity={0.6} />
        <directionalLight position={[-3, 5, 6]} intensity={1.5} />
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2} position={[0, 4, 5]} scale={[10, 4, 1]} />
          <Lightformer form="rect" intensity={0.7} color="#ffcfa0" position={[-6, 0, 2]} scale={[4, 8, 1]} rotation-y={Math.PI / 2} />
        </Environment>
        <Suspense fallback={null}>
          <Fan />
        </Suspense>
      </Canvas>
    </div>
  );
}
