import { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import Scene3D from './components/Scene3D'
import ControlPanel from './components/ControlPanel'
import { ENVELOPE_SIZES, FOLD_STEPS } from './data/envelopeSizes'

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f8f4ed 0%, #e8e0d5 100%);
  overflow: hidden;
`

const CanvasWrapper = styled.div`
  flex: 1;
  position: relative;
`

const PanelWrapper = styled.div`
  width: 360px;
  padding: 24px;
  overflow-y: auto;
  max-height: 100vh;
`

const Header = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  right: 24px;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
`

const Logo = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
`

const Hint = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  color: #718096;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  pointer-events: auto;
`

const Footer = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 12px;
  color: #718096;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 10;
`

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedSize, setSelectedSize] = useState('C5')
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const animationRef = useRef(null)
  
  const size = ENVELOPE_SIZES[selectedSize]
  
  const handleStepChange = (step) => {
    setCurrentStep(step)
  }
  
  const handleSizeChange = (sizeKey) => {
    setSelectedSize(sizeKey)
    setCurrentStep(0)
    setIsAutoPlaying(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }
  
  const handleReset = () => {
    setCurrentStep(0)
    setIsAutoPlaying(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }
  
  const handlePlayAll = () => {
    if (isAutoPlaying) return
    
    setIsAutoPlaying(true)
    setCurrentStep(0)
    
    let startTime = null
    const totalDuration = 4000
    const maxStep = FOLD_STEPS.length - 1
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / totalDuration, 1)
      const newStep = progress * maxStep
      
      setCurrentStep(newStep)
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsAutoPlaying(false)
        setCurrentStep(maxStep)
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }
  
  const handleAutoPlayChange = (checked) => {
    if (checked) {
      handlePlayAll()
    } else {
      setIsAutoPlaying(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }
  
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])
  
  return (
    <AppContainer>
      <CanvasWrapper>
        <Header>
          <Logo>📩 信封折叠结构演示</Logo>
          <Hint>拖拽旋转 · 滚轮缩放 · 右键平移</Hint>
        </Header>
        
        <Scene3D size={size} currentStep={currentStep} />
        
        <Footer>
          使用 React + Three.js + Emotion 构建 · {size.name} ({size.width}×{size.height} mm)
        </Footer>
      </CanvasWrapper>
      
      <PanelWrapper>
        <ControlPanel
          currentStep={currentStep}
          onStepChange={handleStepChange}
          selectedSize={selectedSize}
          onSizeChange={handleSizeChange}
          isAutoPlaying={isAutoPlaying}
          onAutoPlayChange={handleAutoPlayChange}
          onPlayAll={handlePlayAll}
          onReset={handleReset}
        />
      </PanelWrapper>
    </AppContainer>
  )
}

export default App
