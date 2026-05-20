import type { Question } from './types'

export const defaultQuestions: Question[] = [
  {
    id: 'q001',
    type: 'multiple_choice',
    title: '以下哪个是正确的变量命名规范？',
    level: 'elementary',
    category: '编程基础',
    options: [
      { key: 'A', text: '123abc' },
      { key: 'B', text: 'myVariable' },
      { key: 'C', text: 'my-variable' },
      { key: 'D', text: 'class' }
    ],
    correctAnswer: 'B',
    explanation: '变量名不能以数字开头，不能使用连字符，不能使用保留关键字。myVariable 符合驼峰命名规范。',
    points: 10,
    createdAt: Date.now()
  },
  {
    id: 'q002',
    type: 'multiple_choice',
    title: '在JavaScript中，以下哪个方法用于向数组末尾添加元素？',
    level: 'elementary',
    category: 'JavaScript',
    options: [
      { key: 'A', text: 'push()' },
      { key: 'B', text: 'pop()' },
      { key: 'C', text: 'shift()' },
      { key: 'D', text: 'unshift()' }
    ],
    correctAnswer: 'A',
    explanation: 'push() 方法向数组末尾添加一个或多个元素，并返回新的长度。',
    points: 10,
    createdAt: Date.now()
  },
  {
    id: 'q003',
    type: 'multiple_choice',
    title: 'HTTP状态码404表示什么？',
    level: 'elementary',
    category: '网络基础',
    options: [
      { key: 'A', text: '服务器内部错误' },
      { key: 'B', text: '请求成功' },
      { key: 'C', text: '资源未找到' },
      { key: 'D', text: '请求被拒绝' }
    ],
    correctAnswer: 'C',
    explanation: 'HTTP 404 状态码表示服务器无法找到请求的资源。',
    points: 10,
    createdAt: Date.now()
  },
  {
    id: 'q004',
    type: 'multiple_choice',
    title: 'CSS中，以下哪个属性用于设置元素的外边距？',
    level: 'elementary',
    category: 'CSS基础',
    options: [
      { key: 'A', text: 'padding' },
      { key: 'B', text: 'margin' },
      { key: 'C', text: 'border' },
      { key: 'D', text: 'spacing' }
    ],
    correctAnswer: 'B',
    explanation: 'margin 属性用于设置元素的外边距，padding 用于内边距，border 用于边框。',
    points: 10,
    createdAt: Date.now()
  },
  {
    id: 'q005',
    type: 'multiple_choice',
    title: '在Git中，以下哪个命令用于创建新分支？',
    level: 'intermediate',
    category: '版本控制',
    options: [
      { key: 'A', text: 'git new branch' },
      { key: 'B', text: 'git branch' },
      { key: 'C', text: 'git create' },
      { key: 'D', text: 'git make branch' }
    ],
    correctAnswer: 'B',
    explanation: 'git branch <branch-name> 用于创建新分支，git checkout -b 或 git switch -c 用于创建并切换到新分支。',
    points: 15,
    createdAt: Date.now()
  },
  {
    id: 'q006',
    type: 'multiple_choice',
    title: '以下哪个不是JavaScript的基本数据类型？',
    level: 'intermediate',
    category: 'JavaScript',
    options: [
      { key: 'A', text: 'Symbol' },
      { key: 'B', text: 'BigInt' },
      { key: 'C', text: 'Array' },
      { key: 'D', text: 'Undefined' }
    ],
    correctAnswer: 'C',
    explanation: 'JavaScript的基本数据类型包括：String、Number、Boolean、Undefined、Null、Symbol、BigInt。Array是引用类型。',
    points: 15,
    createdAt: Date.now()
  },
  {
    id: 'q007',
    type: 'multiple_choice',
    title: 'Vue3中，以下哪个是组合式API的核心函数？',
    level: 'intermediate',
    category: 'Vue.js',
    options: [
      { key: 'A', text: 'created()' },
      { key: 'B', text: 'setup()' },
      { key: 'C', text: 'mounted()' },
      { key: 'D', text: 'data()' }
    ],
    correctAnswer: 'B',
    explanation: 'setup() 是Vue3组合式API的入口函数，在组件创建之前执行。',
    points: 15,
    createdAt: Date.now()
  },
  {
    id: 'q008',
    type: 'multiple_choice',
    title: '以下哪个SQL语句用于更新表中的数据？',
    level: 'intermediate',
    category: '数据库',
    options: [
      { key: 'A', text: 'INSERT' },
      { key: 'B', text: 'SELECT' },
      { key: 'C', text: 'UPDATE' },
      { key: 'D', text: 'MODIFY' }
    ],
    correctAnswer: 'C',
    explanation: 'UPDATE 语句用于修改表中的现有数据，配合 SET 和 WHERE 子句使用。',
    points: 15,
    createdAt: Date.now()
  },
  {
    id: 'q009',
    type: 'multiple_choice',
    title: '在TypeScript中，以下哪个关键字用于定义接口？',
    level: 'advanced',
    category: 'TypeScript',
    options: [
      { key: 'A', text: 'type' },
      { key: 'B', text: 'interface' },
      { key: 'C', text: 'class' },
      { key: 'D', text: 'struct' }
    ],
    correctAnswer: 'B',
    explanation: 'interface 关键字用于定义接口，type 用于定义类型别名。两者都可以定义对象形状，但 interface 可以被继承和合并。',
    points: 20,
    createdAt: Date.now()
  },
  {
    id: 'q010',
    type: 'multiple_choice',
    title: '以下哪个设计模式属于创建型模式？',
    level: 'advanced',
    category: '设计模式',
    options: [
      { key: 'A', text: '观察者模式' },
      { key: 'B', text: '策略模式' },
      { key: 'C', text: '单例模式' },
      { key: 'D', text: '适配器模式' }
    ],
    correctAnswer: 'C',
    explanation: '单例模式是创建型设计模式，确保一个类只有一个实例。观察者、策略、适配器都属于行为型或结构型模式。',
    points: 20,
    createdAt: Date.now()
  },
  {
    id: 'q011',
    type: 'multiple_choice',
    title: '在Node.js中，以下哪个模块用于处理文件系统操作？',
    level: 'advanced',
    category: 'Node.js',
    options: [
      { key: 'A', text: 'http' },
      { key: 'B', text: 'path' },
      { key: 'C', text: 'fs' },
      { key: 'D', text: 'os' }
    ],
    correctAnswer: 'C',
    explanation: 'fs (File System) 模块提供了与文件系统交互的API，http用于HTTP服务器，path用于路径处理，os用于操作系统信息。',
    points: 20,
    createdAt: Date.now()
  },
  {
    id: 'q012',
    type: 'multiple_choice',
    title: '以下哪个算法的平均时间复杂度为O(n log n)？',
    level: 'advanced',
    category: '算法',
    options: [
      { key: 'A', text: '冒泡排序' },
      { key: 'B', text: '快速排序' },
      { key: 'C', text: '插入排序' },
      { key: 'D', text: '选择排序' }
    ],
    correctAnswer: 'B',
    explanation: '快速排序的平均时间复杂度为O(n log n)，而冒泡、插入、选择排序的平均时间复杂度都是O(n²)。',
    points: 20,
    createdAt: Date.now()
  },
  {
    id: 'q013',
    type: 'multiple_choice',
    title: '在微服务架构中，以下哪个组件通常用于服务发现？',
    level: 'expert',
    category: '系统架构',
    options: [
      { key: 'A', text: 'API Gateway' },
      { key: 'B', text: 'Consul' },
      { key: 'C', text: 'RabbitMQ' },
      { key: 'D', text: 'Redis' }
    ],
    correctAnswer: 'B',
    explanation: 'Consul是常用的服务发现工具。API Gateway是API网关，RabbitMQ是消息队列，Redis是缓存/数据库。',
    points: 25,
    createdAt: Date.now()
  },
  {
    id: 'q014',
    type: 'multiple_choice',
    title: 'Kubernetes中，以下哪个资源类型用于管理无状态应用？',
    level: 'expert',
    category: 'DevOps',
    options: [
      { key: 'A', text: 'StatefulSet' },
      { key: 'B', text: 'Deployment' },
      { key: 'C', text: 'DaemonSet' },
      { key: 'D', text: 'Job' }
    ],
    correctAnswer: 'B',
    explanation: 'Deployment 用于管理无状态应用，StatefulSet 用于有状态应用，DaemonSet 确保每个节点运行一个Pod，Job 用于一次性任务。',
    points: 25,
    createdAt: Date.now()
  },
  {
    id: 'q015',
    type: 'multiple_choice',
    title: '以下哪个不是CAP定理的三个特性之一？',
    level: 'expert',
    category: '分布式系统',
    options: [
      { key: 'A', text: '一致性 (Consistency)' },
      { key: 'B', text: '可用性 (Availability)' },
      { key: 'C', text: '分区容错性 (Partition tolerance)' },
      { key: 'D', text: '可扩展性 (Scalability)' }
    ],
    correctAnswer: 'D',
    explanation: 'CAP定理指出分布式系统无法同时满足一致性、可用性和分区容错性，三者只能取其二。可扩展性不是CAP定理的组成部分。',
    points: 25,
    createdAt: Date.now()
  },
  {
    id: 'p001',
    type: 'practical_essay',
    title: '请简述前端性能优化的主要策略和方法。',
    level: 'intermediate',
    category: '性能优化',
    correctAnswer: '1. 资源压缩与合并：压缩JS、CSS、HTML，合并请求\n2. 图片优化：选择合适格式、懒加载、响应式图片\n3. 缓存策略：浏览器缓存、CDN缓存、服务端缓存\n4. 代码优化：减少重排重绘、使用事件委托、合理使用节流防抖\n5. 加载优化：代码分割、按需加载、预加载\n6. 性能监控：使用Lighthouse、Performance API监控性能指标',
    explanation: '前端性能优化需要从多个维度进行，包括资源加载、渲染性能、代码质量等方面。',
    points: 30,
    createdAt: Date.now()
  },
  {
    id: 'p002',
    type: 'practical_essay',
    title: '请描述一下你对RESTful API设计规范的理解。',
    level: 'intermediate',
    category: 'API设计',
    correctAnswer: '1. 使用HTTP方法表示操作：GET(查询)、POST(创建)、PUT(更新)、DELETE(删除)\n2. 使用名词而非动词定义资源路径\n3. 资源路径使用复数形式\n4. 使用HTTP状态码表示响应结果\n5. 版本控制：通过URL或Header实现\n6. 分页、过滤、排序：通过查询参数实现\n7. 返回统一的数据格式（如JSON）\n8. 提供错误信息和文档',
    explanation: 'RESTful API是一种设计风格，通过标准HTTP方法和资源路径实现清晰、可扩展的API设计。',
    points: 30,
    createdAt: Date.now()
  },
  {
    id: 'p003',
    type: 'practical_essay',
    title: '请解释什么是跨域问题，以及常见的解决方案。',
    level: 'advanced',
    category: 'Web安全',
    correctAnswer: '跨域问题源于浏览器的同源策略，当协议、域名、端口任意一个不同时就会产生跨域。\n\n解决方案：\n1. CORS：服务端设置Access-Control-Allow-Origin等响应头\n2. JSONP：利用script标签不受同源策略限制，但只支持GET请求\n3. 代理服务器：通过同源服务器转发请求\n4. Nginx反向代理：配置Nginx将请求转发到目标服务器\n5. postMessage：用于不同窗口/iframe间通信\n6. WebSocket：不受同源策略限制',
    explanation: '跨域是前端开发中常见问题，需要根据具体场景选择合适的解决方案。',
    points: 40,
    createdAt: Date.now()
  },
  {
    id: 'p004',
    type: 'practical_essay',
    title: '请设计一个高可用的微服务架构，说明各个组件的作用。',
    level: 'expert',
    category: '系统架构',
    correctAnswer: '一个高可用微服务架构通常包含以下组件：\n\n1. 客户端层：Web、Mobile、第三方接入\n2. 网关层：API Gateway（路由、鉴权、限流、监控）\n3. 服务注册与发现：Consul/Nacos/Eureka\n4. 配置中心：Spring Cloud Config / Nacos Config\n5. 业务服务层：按领域划分的微服务\n6. 消息队列：Kafka/RabbitMQ（异步解耦、削峰填谷）\n7. 缓存层：Redis（分布式缓存）\n8. 数据层：主从复制、读写分离的数据库\n9. 监控告警：Prometheus + Grafana + AlertManager\n10. 日志系统：ELK Stack（Elasticsearch + Logstash + Kibana）\n11. 链路追踪：Jaeger / Zipkin\n\n设计原则：无状态服务、服务拆分合理、故障隔离、自动伸缩、降级熔断。',
    explanation: '高可用微服务架构需要考虑服务治理、数据一致性、故障容错等多个方面。',
    points: 50,
    createdAt: Date.now()
  }
]

export const defaultSettings = {
  duration: 60,
  passScore: 60,
  questionCount: 10,
  level: 'intermediate' as const,
  includePractical: true,
  practicalPoints: 30
}
