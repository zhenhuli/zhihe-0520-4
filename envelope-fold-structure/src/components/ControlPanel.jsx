import styled from '@emotion/styled'
import { FOLD_STEPS, ENVELOPE_SIZES } from '../data/envelopeSizes'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 320px;
`

const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
`

const Section = styled.div`
  margin-bottom: 24px;
`

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const StepButton = styled.button`
  padding: 12px 16px;
  border: 2px solid ${props => props.active ? '#3182ce' : '#e2e8f0'};
  background: ${props => props.active ? '#ebf8ff' : 'white'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    border-color: #3182ce;
    background: #f7fafc;
    transform: translateX(4px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const StepName = styled.div`
  font-weight: 600;
  color: ${props => props.active ? '#2b6cb0' : '#2d3748'};
  font-size: 14px;
`

const StepDesc = styled.div`
  font-size: 12px;
  color: #718096;
  margin-top: 2px;
`

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`

const SizeButton = styled.button`
  padding: 12px;
  border: 2px solid ${props => props.active ? '#38a169' : '#e2e8f0'};
  background: ${props => props.active ? '#f0fff4' : 'white'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #38a169;
    background: #f7fafc;
  }
`

const SizeName = styled.div`
  font-weight: 600;
  color: ${props => props.active ? '#276749' : '#2d3748'};
  font-size: 13px;
`

const SizeDesc = styled.div`
  font-size: 11px;
  color: #718096;
  margin-top: 2px;
`

const SizeDim = styled.div`
  font-size: 11px;
  color: #a0aec0;
  margin-top: 4px;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`

const ActionButton = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  background: ${props => props.primary ? '#3182ce' : '#edf2f7'};
  color: ${props => props.primary ? 'white' : '#4a5568'};
  
  &:hover {
    background: ${props => props.primary ? '#2b6cb0' : '#e2e8f0'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
`

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3182ce, #38a169);
  border-radius: 3px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`

const AutoPlayToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 0;
  font-size: 14px;
  color: #4a5568;
`

const ToggleInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`

export default function ControlPanel({
  currentStep,
  onStepChange,
  selectedSize,
  onSizeChange,
  isAutoPlaying,
  onAutoPlayChange,
  onPlayAll,
  onReset
}) {
  const progress = (currentStep / (FOLD_STEPS.length - 1)) * 100
  const currentStepInfo = FOLD_STEPS[Math.floor(currentStep)] || FOLD_STEPS[0]
  
  return (
    <Container>
      <Title>📩 信封折叠演示</Title>
      
      <Section>
        <SectionTitle>当前进度</SectionTitle>
        <div style={{ fontSize: '14px', color: '#2d3748', fontWeight: 500 }}>
          {currentStepInfo.name}
        </div>
        <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
          {currentStepInfo.description}
        </div>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        <div style={{ fontSize: '12px', color: '#a0aec0', marginTop: '4px', textAlign: 'right' }}>
          {Math.floor(currentStep) + 1} / {FOLD_STEPS.length}
        </div>
      </Section>
      
      <Section>
        <SectionTitle>折叠步骤</SectionTitle>
        <StepList>
          {FOLD_STEPS.map((step) => (
            <StepButton
              key={step.id}
              active={Math.floor(currentStep) === step.id}
              onClick={() => onStepChange(step.id)}
            >
              <StepName active={Math.floor(currentStep) === step.id}>
                步骤 {step.id + 1}: {step.name}
              </StepName>
              <StepDesc>{step.description}</StepDesc>
            </StepButton>
          ))}
        </StepList>
        
        <AutoPlayToggle>
          <ToggleInput
            type="checkbox"
            checked={isAutoPlaying}
            onChange={(e) => onAutoPlayChange(e.target.checked)}
          />
          自动播放所有步骤
        </AutoPlayToggle>
        
        <ButtonRow>
          <ActionButton onClick={onReset}>
            重置
          </ActionButton>
          <ActionButton primary onClick={onPlayAll} disabled={isAutoPlaying}>
            {isAutoPlaying ? '播放中...' : '播放全部'}
          </ActionButton>
        </ButtonRow>
      </Section>
      
      <Section>
        <SectionTitle>信封尺寸</SectionTitle>
        <SizeGrid>
          {Object.entries(ENVELOPE_SIZES).map(([key, size]) => (
            <SizeButton
              key={key}
              active={selectedSize === key}
              onClick={() => onSizeChange(key)}
            >
              <SizeName active={selectedSize === key}>{size.name}</SizeName>
              <SizeDesc>{size.description}</SizeDesc>
              <SizeDim>{size.width} × {size.height} mm</SizeDim>
            </SizeButton>
          ))}
        </SizeGrid>
      </Section>
    </Container>
  )
}
