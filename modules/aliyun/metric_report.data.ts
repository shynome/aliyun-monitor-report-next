
/**要收集的维度 */
export const DefaultCollectDimensions = {
  /**ECS */
  "acs_ecs_dashboard": [
    { DisplayName: "CPU", Name: "cpu_total" },
    { DisplayName: "内存", Name: "memory_usedutilization" },
    { DisplayName: "连接数", Name: "concurrentConnections" },
  ],
  /**RDS */
  "acs_rds_dashboard": [
    { DisplayName: "CPU 使用率", Name: "CpuUsage" },
    { DisplayName: "内存使用率", Name: "MemoryUsage" },
    { DisplayName: "连接数使用率", Name: "ConnectionUsage" },
  ],

  /**KVSTORE */
  "acs_kvstore": [
    { DisplayName: "CPU 使用率", Name: "CpuUsage" },
    { DisplayName: "内存使用率", Name: "MemoryUsage" },
    { DisplayName: "连接数使用率", Name: "ConnectionUsage" },
  ],
  /**SLB */
  "acs_slb_dashboard": [
    { DisplayName: "流入带宽", Name: "TrafficRXNew" },
    { DisplayName: "活跃连接数", Name: "ActiveConnection" },
    { DisplayName: "并发连接数", Name: "MaxConnection" },
  ],
  /**CDN */
  "acs_cdn": [
    { DisplayName: "宽带峰值", Name: "BPS" },
    { DisplayName: "下行流量", Name: "InternetOut" },
    { DisplayName: "QPS", Name: "QPS" },
  ],
}
