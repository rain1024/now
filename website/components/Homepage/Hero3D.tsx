'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedSphereProps {
  mousePosition: { x: number; y: number };
}

// Inner glowing core
function GlowingSphere({ mousePosition }: AnimatedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Smooth rotation
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;

    // Mouse interaction - more subtle
    const targetRotationX = mousePosition.y * 0.2;
    const targetRotationY = mousePosition.x * 0.2;
    meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.03;
    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.03;

    // Breathing effect
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    meshRef.current.scale.set(scale, scale, scale);

    // Rainbow color shift
    if (materialRef.current) {
      const hue = (state.clock.elapsedTime * 0.03) % 1;
      materialRef.current.color.setHSL(hue, 0.9, 0.7);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[2.5, 128, 128]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#A78BFA"
          attach="material"
          distort={0.6}
          speed={3}
          roughness={0}
          metalness={0.9}
          emissive="#8B5CF6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </Sphere>
    </Float>
  );
}

// Outer wireframe sphere
function WireframeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = -state.clock.elapsedTime * 0.1;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <Sphere ref={meshRef} args={[3.5, 32, 32]}>
      <meshBasicMaterial
        color="#C4B5FD"
        wireframe
        transparent
        opacity={0.15}
      />
    </Sphere>
  );
}

// Orbital particles with color variation
function OrbitalParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 5 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Rainbow colors
      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.8, 0.7);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.2;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  // Create circular texture for particles
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        map={particleTexture}
        alphaTest={0.01}
      />
    </points>
  );
}

// Energy rings
function EnergyRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -state.clock.elapsedTime * 0.3;
      ring2Ref.current.rotation.x = Math.PI / 4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = state.clock.elapsedTime * 0.4;
      ring3Ref.current.rotation.y = Math.PI / 3;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[4, 0.05, 16, 100]} />
        <meshBasicMaterial color="#EC4899" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[4.5, 0.05, 16, 100]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[5, 0.05, 16, 100]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

// Main 3D Scene
interface SceneProps {
  mousePosition: { x: number; y: number };
}

function Scene({ mousePosition }: SceneProps) {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />

      {/* Colored point lights for mystical effect */}
      <pointLight position={[10, 10, 10]} intensity={2} color="#A78BFA" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#3B82F6" />
      <pointLight position={[0, 0, 10]} intensity={1} color="#EC4899" />
      <pointLight position={[0, 10, 0]} intensity={1.5} color="#8B5CF6" />

      {/* Spot lights for dramatic effect */}
      <spotLight position={[5, 5, 5]} intensity={2} angle={0.3} penumbra={1} color="#C4B5FD" />
      <spotLight position={[-5, -5, -5]} intensity={1.5} angle={0.3} penumbra={1} color="#EC4899" />

      {/* Main sphere components */}
      <GlowingSphere mousePosition={mousePosition} />
      <WireframeSphere />
      <EnergyRings />

      {/* Particles and effects */}
      <OrbitalParticles />
      <Sparkles count={100} scale={15} size={3} speed={0.5} color="#C4B5FD" />
      <Stars radius={150} depth={80} count={5000} factor={6} saturation={0.5} fade speed={2} />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

// Fallback - Beautiful gradient with animated orbs
function FallbackGradient() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Floating particles effect */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping" />
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-indigo-300 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}

// Main Hero3D Component
interface Hero3DProps {
  onInteraction: () => void;
}

export default function Hero3D({ onInteraction }: Hero3DProps) {
  const mousePosition = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mousePosition.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen cursor-pointer group"
      onClick={onInteraction}
      onMouseMove={handleMouseMove}
      data-testid="hero-3d-container"
    >
      {/* Vignette effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-black/50 z-10" />

      <Suspense fallback={<FallbackGradient />}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#0a0a1a']} />
          <fog attach="fog" args={['#0a0a1a', 15, 30]} />
          <Scene mousePosition={mousePosition.current} />
        </Canvas>
      </Suspense>
    </div>
  );
}
