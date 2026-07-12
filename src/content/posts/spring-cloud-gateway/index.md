---

slug: "/spring-cloud-gateway"

description: "Spring Cloud Gateway 是基于 Spring 6、Spring Boot 3 和 Project Reactor 的网关，本文探索其主要功能。"
title: "Spring Cloud Gateway"
date: 2025-05-22
summary: "Spring Cloud Gateway 是基于 Spring 6、Spring Boot 3 和 Project Reactor 的网关，本文探索其主要功能。"
tags: ['coding']
draft: false
---

#### 1. 概述  

Spring Cloud Gateway 是基于 Spring 6、Spring Boot 3 和 Project Reactor 的网关，本文探索其主要功能。

#### 2. 路由处理器（Routing Handler）  

Spring Cloud Gateway 的核心是路由请求，其将请求转发至 **Gateway Handler Mapping**——该组件决定如何处理匹配特定路由的请求。以下是一个使用 `RouteLocator` 配置路由的示例：

```java
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("r1", r -> r.host("**.baeldung.com")
            .and()
            .path("/baeldung")
            .uri("http://baeldung.com"))
        .route(r -> r.host("**.baeldung.com")
            .and()
            .path("/myOtherRouting")
            .filters(f -> f.prefixPath("/myPrefix"))
            .uri("http://othersite.com")
            .id("myOtherID"))
        .build();
}
```

此处展示了 API 的核心组件：  

- **Route**：网关的主要 API，由 ID、目标 URI、断言（Predicates）和过滤器（Filters）组成。  
- **Predicate**：基于 Java 8 的 `Predicate`，用于匹配 HTTP 请求的头部、方法或参数。  
- **Filter**：标准的 Spring `WebFilter`。

#### 3. 动态路由  

与 Zuul 类似，Spring Cloud Gateway 支持将请求路由到不同服务。路由配置可通过纯 Java（如 `RouteLocator`）或属性文件定义：

```yaml
spring:
  application:
    name: gateway-service
  cloud:
    gateway:
      routes:
        - id: baeldung
          uri: baeldung.com
        - id: myOtherRouting
          uri: localhost:9999
```

---

#### 4. 路由工厂  

Spring Cloud Gateway 使用 Spring WebFlux 的 `HandlerMapping` 进行路由匹配，并内置多种 **Route Predicate Factories**。这些断言通过逻辑“与”组合，支持编程或配置文件方式定义路由规则。

#### 4.1. Before 路由断言工厂

匹配指定时间之前的请求：

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: before_route
          uri: http://baeldung.com
          predicates:
            - Before=2017-09-11T17:42:47.789-07:00[America/Alaska]
```

Java 配置：

```java
.route(r -> r.before(LocalDateTime.now().atZone(ZoneId.systemDefault()))
    .id("before_route").uri("http://baeldung.com"))
```

#### 4.2. Between 路由断言工厂  

匹配两个时间点之间的请求：

```yaml
predicates:
  - Between=2017-09-10T17:42:47.789-07:00[America/Alaska], 2017-09-11T17:42:47.789-07:00[America/Alaska]
```

Java 配置：

```java
ZonedDateTime datetime1 = LocalDateTime.now().minusDays(1).atZone(ZoneId.systemDefault());
ZonedDateTime datetime2 = LocalDateTime.now().atZone(ZoneId.systemDefault());
.route(r -> r.between(datetime1, datetime2)).id("between_route").uri("http://baeldung.com")
```

#### 4.3. Header 路由断言工厂  

匹配包含特定头部且符合正则表达式的请求：

```yaml
predicates:
  - Header=X-Request-Id, \d+
```

Java 配置：

```java
.route(r -> r.header("X-Request-Id", "\\d+").id("header_route").uri("http://baeldung.com"))
```

#### 4.4. Host 路由断言工厂  

匹配 Host 头部符合 Ant 风格模式的请求：

```yaml
predicates:
  - Host=**.baeldung.com
```

Java 配置：

```java
.route(r -> r.host("**.baeldung.com").id("host_route").uri("http://baeldung.com"))
```

#### 4.5. Method 路由断言工厂  

匹配指定 HTTP 方法的请求：

```yaml
predicates:
  - Method=GET
```

Java 配置：

```java
.route(r -> r.method("GET").id("method_route").uri("http://baeldung.com"))
```

#### 4.6. Path 路由断言工厂  

匹配路径符合 `PathMatcher` 模式的请求：

```yaml
predicates:
  - Path=/articles/{articleId}
```

Java 配置：

```java
.route(r -> r.path("/articles/"+articleId).id("path_route").uri("http://baeldung.com"))
```

#### 4.7. Query 路由断言工厂

匹配包含指定查询参数的请求：

```yaml
predicates:
  - Query=articleId, \w
```

Java 配置：

```java
.route(r -> r.query("articleId", "\w").id("query_route").uri("http://baeldung.com"))
```

#### 4.8. RemoteAddr 路由断言工厂  

匹配指定 IP 范围的请求：

```yaml
predicates:
  - RemoteAddr=192.168.1.1/24
```

Java 配置：

```java
.route(r -> r.remoteAddr("192.168.1.1/24").id("remoteaddr_route").uri("http://baeldung.com"))
```

#### 5. WebFilter 工厂  

WebFilter 用于修改请求或响应。Spring Cloud Gateway 提供多种内置工厂：

#### 5.1. AddRequestHeader WebFilter 工厂

添加请求头：

```yaml
filters:
  - AddRequestHeader=X-SomeHeader, bael
```

Java 配置：

```java
.filters(f -> f.addRequestHeader("X-TestHeader", "rewrite_request"))
```

#### 5.2. AddRequestParameter WebFilter 工厂

添加请求参数：

```yaml
filters:
  - AddRequestParameter=foo, bar
```

Java 配置：

```java
.filters(f -> f.addRequestParameter("foo", "bar"))
```

#### 5.3. AddResponseHeader WebFilter 工厂  

添加响应头：

```yaml
filters:
  - AddResponseHeader=X-SomeHeader, Bar
```

Java 配置：

```java
.filters(f -> f.addResponseHeader("X-SomeHeader", "Bar"))
```

#### 6. 服务发现支持  

Spring Cloud Gateway 可与 Eureka 和 Consul 集成：

```java
@Configuration
@EnableDiscoveryClient
public class GatewayDiscoveryConfiguration {
    @Bean
    public DiscoveryClientRouteDefinitionLocator discoveryClientRouteLocator(DiscoveryClient discoveryClient) {
        return new DiscoveryClientRouteDefinitionLocator(discoveryClient);
    }
}
```

#### 7. 监控  

通过 Actuator API 监控网关：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"
```

#### 8. 实现示例  

依赖配置：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

路由配置：

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: baeldung_route
          uri: http://baeldung.com
          predicates:
            - Path=/baeldung/
```

应用启动后，访问 `http://localhost/baeldung` 将重定向至 `http://baeldung.com`。

#### 9. 结论  

Spring Cloud Gateway 提供了强大的网关和代理功能，支持动态路由、断言、过滤器及服务发现集成。通过 Actuator 可轻松监控网关状态。

#### 参考文献

```text
https://www.baeldung.com/spring-cloud-gateway
```
