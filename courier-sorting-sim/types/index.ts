export interface Package {
  id: string
  trackingNumber: string
  receiverName: string
  receiverPhone: string
  address: string
  district: string
  weight: number
  size: 'small' | 'medium' | 'large'
  priority: 'normal' | 'express' | 'fragile'
  status: 'pending' | 'scanned' | 'sorted' | 'assigned' | 'delivered'
  areaId: string | null
  routeId: string | null
  scannedAt: Date | null
  sortedAt: Date | null
  assignedAt: Date | null
  createdAt: Date
}

export interface DeliveryArea {
  id: string
  name: string
  code: string
  color: string
  districts: string[]
  courierName: string
  courierPhone: string
  packageCount: number
}

export interface Route {
  id: string
  name: string
  code: string
  color: string
  areaIds: string[]
  estimatedTime: number
  packageCount: number
}

export interface SortingRule {
  id: string
  name: string
  type: 'district' | 'weight' | 'size' | 'priority'
  condition: string
  targetAreaId: string
  enabled: boolean
}

export interface SortingStats {
  totalPackages: number
  sortedPackages: number
  pendingPackages: number
  assignedPackages: number
  deliveredPackages: number
  avgSortingTime: number
  packagesPerHour: number
  efficiencyRate: number
 stuckPackages: number
  todaySorted: number
  peakHourPackages: number
}

export interface FlowNode {
  id: string
  type: 'input' | 'scan' | 'sort' | 'area' | 'route' | 'output'
  label: string
  x: number
  y: number
  count: number
  color: string
}

export interface FlowConnection {
  id: string
  from: string
  to: string
  count: number
  active: boolean
}

export interface SortingRecord {
  packageId: string
  trackingNumber: string
  fromStation: string
  toStation: string
  timestamp: Date
  duration: number
}
