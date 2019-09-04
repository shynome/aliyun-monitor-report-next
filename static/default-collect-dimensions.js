define([], [
  {
    DisplayName: 'ECS 服务器',
    Name: 'acs_ecs_dashboard',
    Dimensions: [
      { DisplayName: "CPU", Name: "cpu_total" },
      { DisplayName: "内存", Name: "memory_usedutilization" },
      { DisplayName: "连接数", Name: "concurrentConnections" },
    ],
  },
  {
    DisplayName: '数据库',
    Name: 'acs_rds_dashboard',
    Dimensions: [
      { DisplayName: "CPU 使用率", Name: "CpuUsage" },
      { DisplayName: "内存使用率", Name: "MemoryUsage" },
      { DisplayName: "连接数使用率", Name: "ConnectionUsage" },
    ],
  },
  {
    DisplayName: 'Redis 标准版',
    Name: 'acs_kvstore_standard',
    Dimensions: [
      { DisplayName: "CPU 使用率", Name: "CpuUsage" },
      { DisplayName: "内存使用率", Name: "MemoryUsage" },
      { DisplayName: "连接数使用率", Name: "ConnectionUsage" },
    ],
  },
  {
    DisplayName: '负载均衡',
    Name: 'acs_slb_dashboard',
    Dimensions: [
      { DisplayName: "流入带宽", Name: "TrafficRXNew" },
      { DisplayName: "活跃连接数", Name: "ActiveConnection" },
      { DisplayName: "并发连接数", Name: "MaxConnection" },
    ],
  },
  {
    DisplayName: 'CDN',
    Name: 'acs_cdn',
    Dimensions: [
      { DisplayName: "宽带峰值", Name: "BPS" },
      { DisplayName: "下行流量", Name: "InternetOut" },
      { DisplayName: "QPS", Name: "QPS" },
    ],
  },
])