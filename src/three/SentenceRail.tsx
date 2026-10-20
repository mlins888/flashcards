import { useMemo } from 'react';
import { Line, Text } from '@react-three/drei';
import { FONT_UI } from './theme';

/** Flat dashed drop zone printed on the table. */
export function SentenceRail({ width, depth, z, active, empty }: { width: number; depth: number; z: number; active: boolean; empty: boolean }) {
  const points = useMemo(() => {
    const r = 0.25;
    const w = width / 2;
    const d = depth / 2;
    const pts: [number, number, number][] = [];
    const corner = (cx: number, cz: number, a0: number) => {
      for (let i = 0; i <= 6; i++) {
        const a = a0 + (i / 6) * (Math.PI / 2);
        pts.push([cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r]);
      }
    };
    corner(w - r, d - r, 0);
    corner(-w + r, d - r, Math.PI / 2);
    corner(-w + r, -d + r, Math.PI);
    corner(w - r, -d + r, (3 * Math.PI) / 2);
    pts.push(pts[0]);
    return pts;
  }, [width, depth]);

  return (
    <group position={[0, 0.003, z]}>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={active ? 0.1 : 0.04} depthWrite={false} />
      </mesh>
      <Line points={points} color={active ? '#f7b267' : '#9fc9b8'} lineWidth={2} dashed dashSize={0.18} gapSize={0.12} transparent opacity={0.8} />
      {empty && (
        <Text font={FONT_UI} fontSize={0.26} color="#9fc9b8" rotation-x={-Math.PI / 2} position={[0, 0.01, 0]} anchorX="center" anchorY="middle">
          DROP WORD CARDS HERE, IN ORDER
        </Text>
      )}
    </group>
  );
}
