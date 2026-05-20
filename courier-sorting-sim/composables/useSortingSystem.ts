import type { Package, DeliveryArea, Route, SortingRule, SortingStats, FlowNode, FlowConnection, SortingRecord } from '~/types'

const packages = ref<Package[]>([])
const areas = ref<DeliveryArea[]>([])
const routes = ref<Route[]>([])
const rules = ref<SortingRule[]>([])
const sortingRecords = ref<SortingRecord[]>([])
const isSimulating = ref(false)
const simulationSpeed = ref(1000)

const districts = ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '通州区', '昌平区', '大兴区']
const lastNames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '周', '吴']
const firstNames = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '洋', '艳', '勇', '军', '杰', '涛', '明']

const areaColors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899', '#f97316']
const routeColors = ['#3b82f6', '#34d399', '#fbbf24', '#f87171', '#22d3ee', '#a78bfa', '#f472b6', '#fb923c']

export function useSortingSystem() {
  const initializeData = () => {
    areas.value = [
      { id: 'area-1', name: '城东片区', code: 'A1', color: areaColors[0], districts: ['朝阳区', '通州区'], courierName: '张师傅', courierPhone: '13800138001', packageCount: 0 },
      { id: 'area-2', name: '城西片区', code: 'A2', color: areaColors[1], districts: ['海淀区', '石景山区'], courierName: '李师傅', courierPhone: '13800138002', packageCount: 0 },
      { id: 'area-3', name: '城中片区', code: 'A3', color: areaColors[2], districts: ['东城区', '西城区'], courierName: '王师傅', courierPhone: '13800138003', packageCount: 0 },
      { id: 'area-4', name: '城南片区', code: 'A4', color: areaColors[3], districts: ['丰台区', '大兴区'], courierName: '刘师傅', courierPhone: '13800138004', packageCount: 0 },
      { id: 'area-5', name: '城北片区', code: 'A5', color: areaColors[4], districts: ['昌平区', '顺义区'], courierName: '陈师傅', courierPhone: '13800138005', packageCount: 0 },
    ]

    routes.value = [
      { id: 'route-1', name: '东线1号', code: 'R1', color: routeColors[0], areaIds: ['area-1'], estimatedTime: 45, packageCount: 0 },
      { id: 'route-2', name: '西线1号', code: 'R2', color: routeColors[1], areaIds: ['area-2'], estimatedTime: 50, packageCount: 0 },
      { id: 'route-3', name: '中线1号', code: 'R3', color: routeColors[2], areaIds: ['area-3'], estimatedTime: 35, packageCount: 0 },
      { id: 'route-4', name: '南线1号', code: 'R4', color: routeColors[3], areaIds: ['area-4'], estimatedTime: 55, packageCount: 0 },
      { id: 'route-5', name: '北线1号', code: 'R5', color: routeColors[4], areaIds: ['area-5'], estimatedTime: 60, packageCount: 0 },
    ]

    rules.value = [
      { id: 'rule-1', name: '城东区域划分', type: 'district', condition: '朝阳区,通州区', targetAreaId: 'area-1', enabled: true },
      { id: 'rule-2', name: '城西区域划分', type: 'district', condition: '海淀区,石景山区', targetAreaId: 'area-2', enabled: true },
      { id: 'rule-3', name: '城中区域划分', type: 'district', condition: '东城区,西城区', targetAreaId: 'area-3', enabled: true },
      { id: 'rule-4', name: '城南区域划分', type: 'district', condition: '丰台区,大兴区', targetAreaId: 'area-4', enabled: true },
      { id: 'rule-5', name: '城北区域划分', type: 'district', condition: '昌平区,顺义区', targetAreaId: 'area-5', enabled: true },
    ]

    packages.value = []
    sortingRecords.value = []
  }

  const generateTrackingNumber = (): string => {
    const prefix = 'SF'
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `${prefix}${timestamp}${random}`
  }

  const generateRandomName = (): string => {
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    return `${lastName}${firstName}`
  }

  const generateRandomPhone = (): string => {
    return `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
  }

  const createPackage = (customData?: Partial<Package>): Package => {
    const district = districts[Math.floor(Math.random() * districts.length)]
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
    const priorities: Array<'normal' | 'express' | 'fragile'> = ['normal', 'express', 'fragile']

    const newPackage: Package = {
      id: `pkg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      trackingNumber: generateTrackingNumber(),
      receiverName: generateRandomName(),
      receiverPhone: generateRandomPhone(),
      address: `${district}某某街道${Math.floor(Math.random() * 100) + 1}号`,
      district,
      weight: Math.round((Math.random() * 10 + 0.5) * 10) / 10,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: 'pending',
      areaId: null,
      routeId: null,
      scannedAt: null,
      sortedAt: null,
      assignedAt: null,
      createdAt: new Date(),
      ...customData
    }

    packages.value.unshift(newPackage)
    return newPackage
  }

  const matchAreaByDistrict = (district: string): DeliveryArea | undefined => {
    return areas.value.find(area => area.districts.includes(district))
  }

  const matchRouteByArea = (areaId: string): Route | undefined => {
    return routes.value.find(route => route.areaIds.includes(areaId))
  }

  const scanPackage = (packageId: string): boolean => {
    const pkg = packages.value.find(p => p.id === packageId)
    if (!pkg || pkg.status !== 'pending') return false

    pkg.status = 'scanned'
    pkg.scannedAt = new Date()

    sortingRecords.value.unshift({
      packageId: pkg.id,
      trackingNumber: pkg.trackingNumber,
      fromStation: '待入库',
      toStation: '扫描台',
      timestamp: new Date(),
      duration: 0
    })

    return true
  }

  const sortPackage = (packageId: string): boolean => {
    const pkg = packages.value.find(p => p.id === packageId)
    if (!pkg || pkg.status !== 'scanned') return false

    const area = matchAreaByDistrict(pkg.district)
    if (!area) return false

    pkg.areaId = area.id
    pkg.status = 'sorted'
    pkg.sortedAt = new Date()

    area.packageCount++

    sortingRecords.value.unshift({
      packageId: pkg.id,
      trackingNumber: pkg.trackingNumber,
      fromStation: '扫描台',
      toStation: `${area.name}分拣口`,
      timestamp: new Date(),
      duration: pkg.scannedAt ? (new Date().getTime() - new Date(pkg.scannedAt).getTime()) / 1000 : 0
    })

    return true
  }

  const assignPackage = (packageId: string): boolean => {
    const pkg = packages.value.find(p => p.id === packageId)
    if (!pkg || pkg.status !== 'sorted' || !pkg.areaId) return false

    const route = matchRouteByArea(pkg.areaId)
    if (!route) return false

    pkg.routeId = route.id
    pkg.status = 'assigned'
    pkg.assignedAt = new Date()

    route.packageCount++

    sortingRecords.value.unshift({
      packageId: pkg.id,
      trackingNumber: pkg.trackingNumber,
      fromStation: `${areas.value.find(a => a.id === pkg.areaId)?.name || '未知'}分拣口`,
      toStation: `${route.name}配送车`,
      timestamp: new Date(),
      duration: pkg.sortedAt ? (new Date().getTime() - new Date(pkg.sortedAt).getTime()) / 1000 : 0
    })

    return true
  }

  const deliverPackage = (packageId: string): boolean => {
    const pkg = packages.value.find(p => p.id === packageId)
    if (!pkg || pkg.status !== 'assigned') return false

    pkg.status = 'delivered'

    sortingRecords.value.unshift({
      packageId: pkg.id,
      trackingNumber: pkg.trackingNumber,
      fromStation: `${routes.value.find(r => r.id === pkg.routeId)?.name || '未知'}配送车`,
      toStation: '已送达',
      timestamp: new Date(),
      duration: pkg.assignedAt ? (new Date().getTime() - new Date(pkg.assignedAt).getTime()) / 1000 : 0
    })

    return true
  }

  const processPackageAuto = async (pkg: Package) => {
    await new Promise(resolve => setTimeout(resolve, simulationSpeed.value * 0.3))
    if (pkg.status === 'pending') {
      scanPackage(pkg.id)
    }

    await new Promise(resolve => setTimeout(resolve, simulationSpeed.value * 0.4))
    if (pkg.status === 'scanned') {
      sortPackage(pkg.id)
    }

    await new Promise(resolve => setTimeout(resolve, simulationSpeed.value * 0.3))
    if (pkg.status === 'sorted') {
      assignPackage(pkg.id)
    }
  }

  const startSimulation = async (packageCount: number = 20) => {
    if (isSimulating.value) return
    isSimulating.value = true

    for (let i = 0; i < packageCount; i++) {
      if (!isSimulating.value) break
      const pkg = createPackage()
      processPackageAuto(pkg)
      await new Promise(resolve => setTimeout(resolve, simulationSpeed.value * 0.5))
    }

    isSimulating.value = false
  }

  const stopSimulation = () => {
    isSimulating.value = false
  }

  const stats = computed<SortingStats>(() => {
    const total = packages.value.length
    const sorted = packages.value.filter(p => p.status === 'sorted' || p.status === 'assigned' || p.status === 'delivered').length
    const pending = packages.value.filter(p => p.status === 'pending' || p.status === 'scanned').length
    const assigned = packages.value.filter(p => p.status === 'assigned').length
    const delivered = packages.value.filter(p => p.status === 'delivered').length

    const sortedPackages = packages.value.filter(p => p.sortedAt && p.scannedAt)
    const avgSortingTime = sortedPackages.length > 0
      ? sortedPackages.reduce((sum, p) => {
          if (p.sortedAt && p.scannedAt) {
            return sum + (new Date(p.sortedAt).getTime() - new Date(p.scannedAt).getTime()) / 1000
          }
          return sum
        }, 0) / sortedPackages.length
      : 0

    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 3600000)
    const lastHourPackages = packages.value.filter(p => new Date(p.createdAt) > oneHourAgo).length

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todaySorted = packages.value.filter(p => p.sortedAt && new Date(p.sortedAt) > todayStart).length

    const threeHoursAgo = new Date(now.getTime() - 10800000)
    const stuckPackages = packages.value.filter(p => 
      (p.status === 'pending' || p.status === 'scanned') && 
      new Date(p.createdAt) < threeHoursAgo
    ).length

    return {
      totalPackages: total,
      sortedPackages: sorted,
      pendingPackages: pending,
      assignedPackages: assigned,
      deliveredPackages: delivered,
      avgSortingTime: Math.round(avgSortingTime * 10) / 10,
      packagesPerHour: lastHourPackages,
      efficiencyRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
      stuckPackages,
      todaySorted,
      peakHourPackages: lastHourPackages
    }
  })

  const flowNodes = computed<FlowNode[]>(() => {
    const pendingCount = packages.value.filter(p => p.status === 'pending').length
    const scannedCount = packages.value.filter(p => p.status === 'scanned').length
    const sortedCount = packages.value.filter(p => p.status === 'sorted').length
    const assignedCount = packages.value.filter(p => p.status === 'assigned').length
    const deliveredCount = packages.value.filter(p => p.status === 'delivered').length

    const nodes: FlowNode[] = [
      { id: 'input', type: 'input', label: '快件入库', x: 40, y: 40, count: pendingCount, color: '#64748b' },
      { id: 'scan', type: 'scan', label: '扫描登记', x: 200, y: 40, count: scannedCount, color: '#3b82f6' },
      { id: 'sort', type: 'sort', label: '智能分拣', x: 360, y: 40, count: sortedCount, color: '#f59e0b' },
      { id: 'route', type: 'route', label: '线路分配', x: 520, y: 40, count: assignedCount, color: '#10b981' },
      { id: 'output', type: 'output', label: '配送出库', x: 680, y: 40, count: deliveredCount, color: '#22c55e' },
    ]

    areas.value.forEach((area, index) => {
      nodes.push({
        id: area.id,
        type: 'area',
        label: area.name,
        x: 395,
        y: 140 + index * 65,
        count: area.packageCount,
        color: area.color
      })
    })

    return nodes
  })

  const flowConnections = computed<FlowConnection[]>(() => {
    const connections: FlowConnection[] = [
      { id: 'conn-1', from: 'input', to: 'scan', count: packages.value.filter(p => p.status === 'scanned' || p.status === 'sorted' || p.status === 'assigned' || p.status === 'delivered').length, active: isSimulating.value },
      { id: 'conn-2', from: 'scan', to: 'sort', count: packages.value.filter(p => p.status === 'sorted' || p.status === 'assigned' || p.status === 'delivered').length, active: isSimulating.value },
      { id: 'conn-3', from: 'sort', to: 'route', count: packages.value.filter(p => p.status === 'assigned' || p.status === 'delivered').length, active: isSimulating.value },
      { id: 'conn-4', from: 'route', to: 'output', count: packages.value.filter(p => p.status === 'delivered').length, active: isSimulating.value },
    ]

    areas.value.forEach((area, index) => {
      connections.push({
        id: `conn-area-${index}`,
        from: 'sort',
        to: area.id,
        count: area.packageCount,
        active: isSimulating.value
      })
    })

    return connections
  })

  const recentRecords = computed(() => sortingRecords.value.slice(0, 10))

  return {
    packages,
    areas,
    routes,
    rules,
    isSimulating,
    simulationSpeed,
    stats,
    flowNodes,
    flowConnections,
    recentRecords,
    initializeData,
    createPackage,
    scanPackage,
    sortPackage,
    assignPackage,
    deliverPackage,
    startSimulation,
    stopSimulation
  }
}
