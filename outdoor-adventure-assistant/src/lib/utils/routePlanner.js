export const nodeTypes = [
  { id: 'start', name: '起点', icon: '🚩', color: '#22c55e' },
  { id: 'waypoint', name: '途经点', icon: '📍', color: '#3b82f6' },
  { id: 'rest', name: '休息点', icon: '☕', color: '#eab308' },
  { id: 'camp', name: '营地', icon: '⛺', color: '#f97316' },
  { id: 'summit', name: '顶峰', icon: '🏔️', color: '#8b5cf6' },
  { id: 'water', name: '水源', icon: '💧', color: '#06b6d4' },
  { id: 'danger', name: '危险点', icon: '⚠️', color: '#ef4444' },
  { id: 'end', name: '终点', icon: '🏁', color: '#10b981' }
];

export const activityTypesAtNode = [
  { id: 'hike', name: '徒步', icon: '🥾' },
  { id: 'climb', name: '攀登', icon: '🧗' },
  { id: 'rest', name: '休息', icon: '😴' },
  { id: 'eat', name: '用餐', icon: '🍽️' },
  { id: 'camp', name: '露营', icon: '⛺' },
  { id: 'swim', name: '涉水', icon: '🏊' },
  { id: 'explore', name: '探索', icon: '🔍' },
  { id: 'photo', name: '拍照', icon: '📷' }
];

export function generateNodeId() {
  return 'node_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

export function createRouteNode(options = {}) {
  return {
    id: generateNodeId(),
    name: options.name || '途经点',
    type: options.type || 'waypoint',
    latitude: options.latitude || 0,
    longitude: options.longitude || 0,
    altitude: options.altitude || 0,
    distanceFromPrev: options.distanceFromPrev || 0,
    elevationGain: options.elevationGain || 0,
    estimatedTime: options.estimatedTime || 60,
    activityType: options.activityType || 'hike',
    notes: options.notes || '',
    supplies: options.supplies || [],
    hazards: options.hazards || []
  };
}

export function calculateRouteStats(nodes) {
  if (!nodes || nodes.length === 0) {
    return {
      totalDistance: 0,
      totalElevation: 0,
      totalTime: 0,
      maxAltitude: 0,
      minAltitude: Infinity,
      nodeCount: 0,
      campCount: 0,
      waterCount: 0
    };
  }

  const validNodes = nodes.filter(n => n);
  let totalDistance = 0;
  let totalElevation = 0;
  let totalTime = 0;
  let maxAltitude = 0;
  let minAltitude = Infinity;
  let campCount = 0;
  let waterCount = 0;

  for (let i = 0; i < validNodes.length; i++) {
    const node = validNodes[i];
    totalDistance += node.distanceFromPrev || 0;
    totalElevation += node.elevationGain || 0;
    totalTime += node.estimatedTime || 0;
    if (node.altitude > maxAltitude) maxAltitude = node.altitude;
    if (node.altitude < minAltitude) minAltitude = node.altitude;
    if (node.type === 'camp') campCount++;
    if (node.type === 'water') waterCount++;
  }

  return {
    totalDistance,
    totalElevation,
    totalTime,
    maxAltitude,
    minAltitude: minAltitude === Infinity ? 0 : minAltitude,
    nodeCount: validNodes.length,
    campCount,
    waterCount
  };
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}分钟`;
  if (mins === 0) return `${hours}小时`;
  return `${hours}小时${mins}分钟`;
}

export function getNodeTypeInfo(typeId) {
  return nodeTypes.find(t => t.id === typeId) || nodeTypes[1];
}

export function getActivityInfo(activityId) {
  return activityTypesAtNode.find(a => a.id === activityId) || activityTypesAtNode[0];
}

export function estimateTravelTime(distanceKm, elevationM, pace = 4) {
  const baseTime = (distanceKm / pace) * 60;
  const elevationTime = (elevationM / 100) * 10;
  return Math.round(baseTime + elevationTime);
}

export function generateRouteTimeline(nodes) {
  const timeline = [];
  let cumulativeTime = 0;
  let cumulativeDistance = 0;
  let cumulativeElevation = 0;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    cumulativeTime += node.estimatedTime || 0;
    cumulativeDistance += node.distanceFromPrev || 0;
    cumulativeElevation += node.elevationGain || 0;

    timeline.push({
      index: i,
      node,
      cumulativeTime,
      cumulativeDistance,
      cumulativeElevation
    });
  }

  return timeline;
}

export function validateRoute(nodes) {
  const issues = [];

  if (!nodes || nodes.length < 2) {
    issues.push({ level: 'error', message: '路线至少需要起点和终点两个节点' });
    return issues;
  }

  const hasStart = nodes.some(n => n.type === 'start');
  const hasEnd = nodes.some(n => n.type === 'end');

  if (!hasStart) {
    issues.push({ level: 'warning', message: '建议设置一个起点' });
  }
  if (!hasEnd) {
    issues.push({ level: 'warning', message: '建议设置一个终点' });
  }

  const stats = calculateRouteStats(nodes);
  if (stats.totalDistance === 0) {
    issues.push({ level: 'info', message: '建议为各节点设置距离信息' });
  }

  const dangerNodes = nodes.filter(n => n.type === 'danger');
  if (dangerNodes.length > 0) {
    issues.push({ level: 'warning', message: `路线包含${dangerNodes.length}个危险点，请做好准备` });
  }

  if (stats.campCount === 0 && stats.totalTime > 480) {
    issues.push({ level: 'info', message: '行程超过8小时，建议设置营地或考虑过夜' });
  }

  return issues;
}

export function generateRouteSummary(nodes, routeStats) {
  const stats = routeStats || calculateRouteStats(nodes);
  const nodeTypeCounts = {};

  for (const node of nodes) {
    nodeTypeCounts[node.type] = (nodeTypeCounts[node.type] || 0) + 1;
  }

  const segments = [];
  for (let i = 1; i < nodes.length; i++) {
    segments.push({
      from: nodes[i - 1].name,
      to: nodes[i].name,
      distance: nodes[i].distanceFromPrev,
      elevation: nodes[i].elevationGain,
      time: nodes[i].estimatedTime
    });
  }

  return {
    stats,
    nodeTypeCounts,
    segments,
    difficulty: estimateDifficulty(stats)
  };
}

function estimateDifficulty(stats) {
  let score = 0;

  if (stats.totalDistance > 30) score += 3;
  else if (stats.totalDistance > 20) score += 2;
  else if (stats.totalDistance > 10) score += 1;

  if (stats.totalElevation > 2000) score += 3;
  else if (stats.totalElevation > 1000) score += 2;
  else if (stats.totalElevation > 500) score += 1;

  if (stats.totalTime > 720) score += 3;
  else if (stats.totalTime > 480) score += 2;
  else if (stats.totalTime > 240) score += 1;

  if (stats.maxAltitude > 5000) score += 3;
  else if (stats.maxAltitude > 3500) score += 2;
  else if (stats.maxAltitude > 2000) score += 1;

  if (score >= 8) return { level: 'expert', name: '专家级', color: '#ef4444' };
  if (score >= 5) return { level: 'difficult', name: '困难级', color: '#f97316' };
  if (score >= 3) return { level: 'challenging', name: '进阶级', color: '#eab308' };
  if (score >= 1) return { level: 'moderate', name: '入门级', color: '#84cc16' };
  return { level: 'easy', name: '休闲级', color: '#22c55e' };
}
