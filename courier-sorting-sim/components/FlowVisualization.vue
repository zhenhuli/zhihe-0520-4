<template>
  <div class="flow-visualization">
    <h3 class="text-lg font-semibold mb-16">分拣流转动线</h3>
    
    <div class="flow-canvas" ref="canvasRef">
      <svg 
        class="flow-svg" 
        :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
          </marker>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3"/>
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1"/>
          </linearGradient>
        </defs>

        <rect x="0" y="0" :width="canvasWidth" :height="canvasHeight" fill="url(#flowGradient)" rx="8"/>

        <g class="connections">
          <path
            v-for="conn in connections"
            :key="conn.id"
            :d="getConnectionPath(conn)"
            :stroke="conn.active ? '#3b82f6' : '#334155'"
            :stroke-width="conn.active ? 2.5 : 1.5"
            fill="none"
            :class="{ 'active-connection': conn.active }"
            marker-end="url(#arrowhead)"
          />
        </g>

        <g class="nodes">
          <g
            v-for="node in nodes"
            :key="node.id"
            :transform="`translate(${node.x}, ${node.y})`"
            class="flow-node"
            :class="{ 'node-active': isNodeActive(node) }"
          >
            <rect
              :width="nodeWidth"
              :height="nodeHeight"
              rx="10"
              :fill="node.color"
              fill-opacity="0.15"
              :stroke="node.color"
              stroke-width="2"
            />
            <text
              :x="nodeWidth / 2"
              :y="nodeHeight / 2 - 6"
              text-anchor="middle"
              fill="#f1f5f9"
              font-size="13"
              font-weight="600"
            >
              {{ node.label }}
            </text>
            <text
              :x="nodeWidth / 2"
              :y="nodeHeight / 2 + 14"
              text-anchor="middle"
              :fill="node.color"
              font-size="18"
              font-weight="700"
            >
              {{ node.count }}
            </text>
          </g>
        </g>

        <g v-if="active" class="flow-particles">
          <circle
            v-for="particle in particles"
            :key="particle.id"
            :cx="particle.x"
            :cy="particle.y"
            r="5"
            :fill="particle.color"
            class="particle"
          />
        </g>
      </svg>
    </div>

    <div class="flow-legend">
      <div class="legend-item">
        <div class="legend-dot" style="background: #64748b"></div>
        <span>待入库</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot" style="background: #3b82f6"></div>
        <span>已扫描</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot" style="background: #f59e0b"></div>
        <span>分拣中</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot" style="background: #06b6d4"></div>
        <span>已分配</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot" style="background: #10b981"></div>
        <span>已送达</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlowNode, FlowConnection } from '~/types'

const props = defineProps<{
  nodes: FlowNode[]
  connections: FlowConnection[]
  active: boolean
}>()

const canvasWidth = 900
const canvasHeight = 520
const nodeWidth = 110
const nodeHeight = 60

interface Particle {
  id: number
  x: number
  y: number
  color: string
  progress: number
  fromX: number
  fromY: number
  toX: number
  toY: number
}

const particles = ref<Particle[]>([])
let particleId = 0
let animationFrame: number | null = null

const getNodeById = (id: string) => {
  return props.nodes.find(n => n.id === id)
}

const getConnectionPath = (conn: FlowConnection) => {
  const fromNode = getNodeById(conn.from)
  const toNode = getNodeById(conn.to)
  
  if (!fromNode || !toNode) return ''
  
  const fromX = fromNode.x + nodeWidth
  const fromY = fromNode.y + nodeHeight / 2
  const toX = toNode.x
  const toY = toNode.y + nodeHeight / 2
  
  const midX = (fromX + toX) / 2
  
  return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`
}

const isNodeActive = (node: FlowNode) => {
  return node.count > 0
}

const createParticle = () => {
  if (!props.active) return
  
  const activeConnections = props.connections.filter(c => c.active && c.count > 0)
  if (activeConnections.length === 0) return
  
  const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)]
  const fromNode = getNodeById(conn.from)
  const toNode = getNodeById(conn.to)
  
  if (!fromNode || !toNode) return
  
  const colors = ['#3b82f6', '#f59e0b', '#06b6d4', '#10b981']
  
  particles.value.push({
    id: particleId++,
    x: fromNode.x + nodeWidth,
    y: fromNode.y + nodeHeight / 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    progress: 0,
    fromX: fromNode.x + nodeWidth,
    fromY: fromNode.y + nodeHeight / 2,
    toX: toNode.x,
    toY: toNode.y + nodeHeight / 2
  })
}

const animateParticles = () => {
  particles.value = particles.value
    .map(p => {
      p.progress += 0.025
      const t = p.progress
      const midX = (p.fromX + p.toX) / 2
      p.x = (1-t)*(1-t)*p.fromX + 2*(1-t)*t*midX + t*t*p.toX
      p.y = (1-t)*(1-t)*p.fromY + 2*(1-t)*t*((p.fromY + p.toY) / 2) + t*t*p.toY
      return p
    })
    .filter(p => p.progress < 1)
  
  if (Math.random() < 0.15) {
    createParticle()
  }
  
  animationFrame = requestAnimationFrame(animateParticles)
}

watch(() => props.active, (newVal) => {
  if (newVal) {
    animateParticles()
  } else if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    particles.value = []
  }
})

onMounted(() => {
  if (props.active) {
    animateParticles()
  }
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style lang="scss" scoped>
.flow-visualization {
  background: $card-bg;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
  padding: 20px;
}

.flow-canvas {
  background: rgba(15, 23, 42, 0.5);
  border-radius: $radius-md;
  overflow: hidden;
  margin-bottom: 16px;
  width: 100%;
}

.flow-svg {
  display: block;
  width: 100%;
  height: auto;
  min-height: 400px;
}

.flow-node {
  cursor: pointer;
  transition: all $transition-fast;

  rect {
    transition: all $transition-fast;
  }

  &:hover rect {
    fill-opacity: 0.3;
    transform: scale(1.02);
    transform-origin: center;
  }

  &.node-active rect {
    filter: drop-shadow(0 0 10px currentColor);
  }
}

.active-connection {
  animation: flowPulse 2s ease-in-out infinite;
}

@keyframes flowPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.particle {
  filter: drop-shadow(0 0 6px currentColor);
}

.flow-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $text-secondary;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
