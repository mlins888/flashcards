import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Card3D, type Vec3 } from './Card3D';
import { useReducedMotion } from './useReducedMotion';

const TAU = Math.PI * 2;

interface SlotReelProps {
  position: Vec3;
  width: number;
  height: number;
  spinning: boolean;
  /** Delay (ms) after `spinning` turns false before this reel lands, for a staggered stop. */
  stopDelay: number;
  /** Random faces flashed while spinning. */
  pool: string[];
  accent: string;
  render: (text: string) => ReactNode;
  final: string;
}

/** A card that tumbles end-over-end like a slot-machine reel, then lands face-up. */
export function SlotReel({ position, width, height, spinning, stopDelay, pool, accent, render, final }: SlotReelProps) {
  const reduced = useReducedMotion();
  const tumble = useRef<THREE.Group>(null);
  const angle = useRef(0);
  const target = useRef<number | null>(0);
  const [rolling, setRolling] = useState(false);
  const [face, setFace] = useState(final);

  // Start immediately when spinning begins; stop after this reel's delay.
  useEffect(() => {
    if (spinning) {
      setRolling(true);
      target.current = null;
      return;
    }
    const t = setTimeout(() => {
      setRolling(false);
      setFace(final);
      target.current = Math.ceil(angle.current / TAU) * TAU + TAU;
    }, stopDelay);
    return () => clearTimeout(t);
  }, [spinning, stopDelay, final]);

  // Flash random faces while rolling.
  useEffect(() => {
    if (!rolling) return;
    const id = setInterval(() => setFace(pool[Math.floor(Math.random() * pool.length)]), 110);
    return () => clearInterval(id);
  }, [rolling, pool]);

  useFrame((_, dt) => {
    const g = tumble.current;
    if (!g) return;
    if (reduced) {
      angle.current = 0;
    } else if (target.current === null) {
      angle.current += dt * 14;
    } else {
      angle.current = THREE.MathUtils.damp(angle.current, target.current, 6, dt);
    }
    const settled = target.current !== null && Math.abs(target.current - angle.current) < 0.002;
    g.rotation.x = settled ? 0 : angle.current;
    // Rise while tumbling so the card clears the table, settle back down when it lands.
    const lift = target.current === null ? height * 0.6 : Math.min(height * 0.6, Math.abs(target.current - angle.current) * 0.6);
    g.position.y = THREE.MathUtils.damp(g.position.y, lift, 10, dt);
  });

  return (
    <group position={position}>
      <group ref={tumble}>
        <Card3D position={[0, 0, 0]} width={width} height={height} accent={accent} hoverable={false} front={render(face)} back={render(face)} />
      </group>
    </group>
  );
}
