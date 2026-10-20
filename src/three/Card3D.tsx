import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { FONT_DISPLAY, FONT_UI, INK, INK_SOFT, NEUTRAL_RIM, TINT, type Tint } from './theme';
import { useReducedMotion } from './useReducedMotion';

export const CARD_DEPTH = 0.05;
const RIM = 0.07;

export type Vec3 = [number, number, number];

export interface Card3DProps {
  /** Resting position on the table (y is height above it). */
  position: Vec3;
  /** Spin on the table, radians. */
  yaw?: number;
  width?: number;
  height?: number;
  front: ReactNode;
  back?: ReactNode;
  flipped?: boolean;
  accent?: string;
  tint?: Tint;
  /** Increment to play a "nope" shake. */
  shake?: number;
  /** Raised off the table (selected / dragging). */
  raised?: boolean;
  /** Where the card is dealt from on mount. */
  dealFrom?: Vec3;
  dealDelay?: number;
  /** Follow the pointer instantly (dragging). */
  immediate?: boolean;
  hoverable?: boolean;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerMove?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerUp?: (e: ThreeEvent<PointerEvent>) => void;
}

export function Card3D({
  position,
  yaw = 0,
  width = 2.4,
  height = 3.4,
  front,
  back,
  flipped = false,
  accent = NEUTRAL_RIM,
  tint = 'none',
  shake = 0,
  raised = false,
  dealFrom,
  dealDelay = 0,
  immediate = false,
  hoverable = true,
  onClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: Card3DProps) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [dealt, setDealt] = useState(!dealFrom || reduced);

  useEffect(() => {
    if (dealt) return;
    const t = setTimeout(() => setDealt(true), dealDelay);
    return () => clearTimeout(t);
  }, [dealt, dealDelay]);

  const target = dealt ? position : dealFrom!;
  const lift = (raised ? 0.9 : 0) + (hovered && hoverable ? 0.18 : 0);

  const { pos, rotZ } = useSpring({
    pos: [target[0], target[1] + lift + CARD_DEPTH / 2, target[2]] as Vec3,
    rotZ: dealt ? -yaw : -yaw + 1.2,
    immediate: reduced || immediate,
    config: { mass: 1, tension: 260, friction: 26 },
  });

  const { flip } = useSpring({
    flip: flipped ? 1 : 0,
    immediate: reduced,
    config: { mass: 1.2, tension: 180, friction: 22 },
  });

  // Decaying side-to-side wobble when `shake` changes.
  const shakeRef = useRef<THREE.Group>(null);
  const shakeStart = useRef<number | null>(null);
  useEffect(() => {
    if (shake > 0) shakeStart.current = performance.now();
  }, [shake]);
  useFrame(() => {
    const g = shakeRef.current;
    if (!g || shakeStart.current === null) return;
    const t = (performance.now() - shakeStart.current) / 1000;
    if (t > 0.6 || reduced) {
      g.position.x = 0;
      shakeStart.current = null;
      return;
    }
    g.position.x = Math.sin(t * 45) * 0.14 * Math.exp(-t * 7);
  });

  const face = TINT[tint];
  const z = CARD_DEPTH / 2 + 0.006;

  return (
    <animated.group position={pos as unknown as Vec3}>
      {/* Lay the card flat: local +Z (front face normal) points up. */}
      <animated.group rotation-x={-Math.PI / 2} rotation-z={rotZ}>
        <group ref={shakeRef}>
          <animated.group
            rotation-y={flip.to((v) => v * Math.PI)}
            position-z={flip.to((v) => Math.sin(v * Math.PI) * Math.min(width, height) * 0.35)}
            onClick={onClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(true);
              if (onClick || onPointerDown) document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHovered(false);
              document.body.style.cursor = '';
            }}
          >
            <RoundedBox args={[width, height, CARD_DEPTH]} radius={0.02} smoothness={3} bevelSegments={2}>
              <meshPhysicalMaterial color={accent} roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.3} />
            </RoundedBox>
            <RoundedBox args={[width - RIM * 2, height - RIM * 2, CARD_DEPTH + 0.008]} radius={0.015} smoothness={3} bevelSegments={1}>
              <meshStandardMaterial color={face} roughness={0.8} />
            </RoundedBox>
            <group position-z={z}>{front}</group>
            {back && (
              <group position-z={-z} rotation-y={Math.PI}>
                {back}
              </group>
            )}
          </animated.group>
        </group>
      </animated.group>
    </animated.group>
  );
}

export interface CardTextProps {
  children: string;
  size?: number;
  color?: string;
  y?: number;
  maxWidth?: number;
  ui?: boolean;
  colorRanges?: Record<number, string>;
  lineHeight?: number;
}

/** troika feeds colorRanges straight into vertex colors, which three treats as linear. */
function toLinear(ranges: Record<number, string>): Record<number, number> {
  const c = new THREE.Color();
  return Object.fromEntries(Object.entries(ranges).map(([k, v]) => [k, c.set(v).getHex(THREE.LinearSRGBColorSpace)]));
}

/** Text printed on a card face (local coords, origin at the card's center). */
export function CardText({ children, size = 0.34, color = INK, y = 0, maxWidth = 2, ui = false, colorRanges, lineHeight = 1.2 }: CardTextProps) {
  return (
    <Text
      font={ui ? FONT_UI : FONT_DISPLAY}
      fontSize={size}
      color={color}
      position={[0, y, 0.001]}
      anchorX="center"
      anchorY="middle"
      textAlign="center"
      maxWidth={maxWidth}
      lineHeight={lineHeight}
      {...(colorRanges ? { colorRanges: toLinear(colorRanges) } : {})}
    >
      {children}
    </Text>
  );
}

export function CardLabel({ children, y, color = INK_SOFT, maxWidth = 3 }: { children: string; y: number; color?: string; maxWidth?: number }) {
  return (
    <CardText ui size={0.15} y={y} color={color} maxWidth={maxWidth}>
      {children.toUpperCase()}
    </CardText>
  );
}
