/**
 * SiteMap3D — Axiom OS V5
 * 3D property massing via react-three-fiber.
 * Install: npm install @react-three/fiber @react-three/drei three
 */

// Lazy-loaded to avoid bundling Three.js unless on 3D-enabled routes
import { Suspense, lazy } from 'react';

const C = { bg: '#0d0d1a', border: 'rgba(255,255,255,0.07)', textMid: '#7a8494' };

// Dynamically import Three.js canvas to keep initial bundle small
const ThreeCanvas = lazy(() =>
  import('@react-three/fiber').then((m) => ({
    default: function ThreeScene({ lat, lng }: { lat: number; lng: number }) {
      const { Canvas } = m;
      return (
        <Canvas style={{ width: '100%', height: 360 }} camera={{ position: [0, 5, 10], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {/* Building massing placeholder — replace with real parcel geometry */}
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#e8b84b" wireframe />
          </mesh>
          <gridHelper args={[20, 20, '#2e3444', '#1a1a2e']} />
        </Canvas>
      );
    },
  })),
);

interface Props {
  lat?: number;
  lng?: number;
  projectId?: string;
}

export function SiteMap3D({ lat = 27.3364, lng = -82.5307, projectId }: Props) {
  return (
    <div style={{
      background: C.bg, border: `1px solid ${C.border}`,
      borderRadius: 12, overflow: 'hidden',
    }}>
      <Suspense fallback={
        <div style={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMid, fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
          Loading 3D view...
        </div>
      }>
        <ThreeCanvas lat={lat} lng={lng} />
      </Suspense>
      <div style={{ padding: '10px 16px', fontFamily: 'DM Mono, monospace', fontSize: 11, color: C.textMid }}>
        {lat.toFixed(4)}, {lng.toFixed(4)} {projectId ? `· ${projectId}` : ''}
      </div>
    </div>
  );
}
