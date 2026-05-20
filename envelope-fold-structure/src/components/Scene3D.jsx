import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import Envelope3D from './Envelope3D'

export default function Scene3D({ size, currentStep }) {
  return (
    <Canvas
      camera={{ position: [4, 3, 4], fov: 45 }}
      shadows
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#f8f4ed']} />
      
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, -3]} intensity={0.4} />
      <pointLight position={[0, 4, 0]} intensity={0.5} color="#fff8e7" />
      
      <Envelope3D size={size} currentStep={currentStep} />
      
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.3}
        scale={8}
        blur={2}
        far={4}
      />
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2 + 0.2}
      />
      
      <Environment preset="city" />
    </Canvas>
  )
}
