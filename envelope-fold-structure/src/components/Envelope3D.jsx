import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function PaperPanel({ position, rotation, size, color = '#fff5e6', borderColor = '#e8d5b7', children }) {
  const meshRef = useRef()
  const edgesRef = useRef()
  
  const geometry = useMemo(() => new THREE.PlaneGeometry(size[0], size[1]), [size])
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])
  
  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef}>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial
          color={color}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments ref={edgesRef}>
        <primitive object={edges} attach="geometry" />
        <lineBasicMaterial color={borderColor} linewidth={1} />
      </lineSegments>
      {children}
    </group>
  )
}

export default function Envelope3D({ size, currentStep }) {
  const groupRef = useRef()
  
  const scale = 0.01
  const w = size.width * scale
  const h = size.height * scale
  const flapH = size.flapHeight * scale
  
  const sideWingWidth = w * 0.12
  
  const bottomHeight = h * 0.35
  const bodyHeight = h * 0.5
  const bottomFoldHeight = h * 0.15
  
  const getStepProgress = (step) => {
    if (currentStep >= step + 1) return 1
    if (currentStep <= step - 1) return 0
    return currentStep - Math.floor(currentStep)
  }
  
  const leftFold = getStepProgress(1)
  const rightFold = getStepProgress(2)
  const bottomFold = getStepProgress(3)
  const topFold = getStepProgress(4)
  
  const flapOpen = currentStep >= 5 ? 0.3 : 0
  
  const leftWingRotation = leftFold * Math.PI * 0.95
  const rightWingRotation = -rightFold * Math.PI * 0.95
  const bottomRotation = bottomFold * Math.PI * 0.98
  const topRotation = topFold * (Math.PI * 0.95) - flapOpen
  
  const flapShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-w/2 + 0.05, 0)
    shape.lineTo(0, -flapH * 0.6)
    shape.lineTo(w/2 - 0.05, 0)
    shape.lineTo(w/2, 0.01)
    shape.lineTo(-w/2, 0.01)
    shape.closePath()
    return shape
  }, [w, flapH])
  
  const flapEdges = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-w/2 + 0.05, 0)
    shape.lineTo(0, -flapH * 0.6)
    shape.lineTo(w/2 - 0.05, 0)
    return new THREE.EdgesGeometry(new THREE.ShapeGeometry(shape))
  }, [w, flapH])
  
  return (
    <group ref={groupRef}>
      <PaperPanel
        position={[0, -bottomFold * bottomHeight * 0.5, 0]}
        rotation={[0, 0, 0]}
        size={[w, bodyHeight]}
      />
      
      <PaperPanel
        position={[-w/2 - sideWingWidth/2, 0, 0]}
        rotation={[0, leftWingRotation, 0]}
        size={[sideWingWidth, bodyHeight]}
      />
      
      <PaperPanel
        position={[w/2 + sideWingWidth/2, 0, 0]}
        rotation={[0, rightWingRotation, 0]}
        size={[sideWingWidth, bodyHeight]}
      />
      
      <group position={[0, -bodyHeight/2 - bottomHeight/2, 0]} rotation={[bottomRotation, 0, 0]}>
        <PaperPanel
          position={[0, 0, 0]}
          size={[w, bottomHeight]}
        />
        <PaperPanel
          position={[0, bottomHeight/2 - bottomFoldHeight/2, 0.001]}
          size={[w * 0.9, bottomFoldHeight]}
          color="#f0e6d3"
        />
      </group>
      
      <group position={[0, bodyHeight/2 + flapH/2, 0]} rotation={[-topRotation, 0, 0]}>
        <PaperPanel
          position={[0, 0, 0]}
          size={[w, flapH]}
        />
        <mesh position={[0, -flapH/2 + 0.02, 0.002]} rotation={[Math.PI, 0, 0]}>
          <shapeGeometry args={[flapShape]} />
          <meshStandardMaterial color="#fff5e6" side={THREE.DoubleSide} />
        </mesh>
        <lineSegments>
          <primitive object={flapEdges} attach="geometry" />
          <lineBasicMaterial color="#e8d5b7" />
        </lineSegments>
      </group>
    </group>
  )
}
