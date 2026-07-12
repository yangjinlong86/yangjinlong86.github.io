---

slug: "/Introduction-to-spring-cloud-load-balancer"

description: "Spring Cloud Load Balancer 简介"
title: Spring Cloud Load Balancer 简介
date: "2024-01-30 21:05:19"
summary: "Spring Cloud Load Balancer 简介"
tags: ['coding']

---

原文链接：https://www.baeldung.com/spring-cloud-load-balancer

## 1. 引言

随着微服务架构变得越来越流行，在不同服务器上运行多个服务变得越来越普遍。在本快速教程中，我们将了解如何使用 Spring Cloud Load Balancer 创建应用程序。

## 2.什么是负载均衡

负载均衡是在同一应用程序的不同实例之间分配流量的过程。

要创建容错系统，通常要运行每个应用程序的多个实例。因此，每当一个服务需要与另一个服务通信时，它都需要选择一个特定的实例来发送其请求。

在负载均衡方有许多算法：

- 随机选择(Random)：随机选择实例
- 循环(Round-robin)：每次以相同的顺序选择实例
- 最少连接数(Least connections)：选择当前连接数最少的实例
- 加权指标(Weight metric)：使用加权指标选择最佳实例（例如，CPU 或内存使用率）
- IP 哈希(IP hash)：使用客户端 IP 的哈希映射到实例

这些只是负载均衡算法的几个示例，每种算法都有其优点和缺点。

随机选择和循环很容易实现，但可能无法以最佳方式使用服务。

最少连接和加权指标更复杂，但通常会产生更优化的服务利用率。

当服务器粘性很重要时，IP 哈希值很棒，但它的容错能力不是很强。

## 3. Spring Cloud Load Balancer 简介

Spring Cloud Load Balancer 允许我们创建以负载均衡方式与其他应用程序通信的应用程序。使用我们想要的任何算法，我们都可以在进行远程服务调用时轻松实现负载均衡。

为了说明这一点，让我们看一些示例代码。我们将从一个简单的服务器应用程序开始。服务器将具有单个 HTTP 终结点，可以作为多个实例运行。

然后，我们将创建一个客户端应用程序，该应用程序使用 Spring Cloud Load Balancer 在服务器的不同实例之间交替请求。

### 3.1. 示例服务器

对于我们的示例服务器，我们从一个简单的 Spring Boot 应用程序开始：

```java
@SpringBootApplication
@RestController
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    @Value("${server.instance.id}")
    String instanceId;

    @GetMapping("/hello")
    public String hello() {
        return String.format("Hello from instance %s", instanceId);
    }
}
```

我们首先注入一个名为 instanceId 的可配置变量。这使我们能够区分多个正在运行的实例。接下来，我们添加一个 HTTP GET 端点，该端点回显消息和实例 ID。

默认实例将在 ID 为 1 的端口 8080 上运行。要运行第二个实例，我们只需要添加几个程序参数：

```shell
--server.instance.id=2 --server.port=8081
```



现在，让我们看一下客户端代码。这是我们使用 Spring Cloud Load Balancer 的地方，所以让我们首先将它包含在我们的应用程序中：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

接下来，我们创建一个 ServiceInstanceListSupplier 的实现。这是 Spring Cloud Load Balancer 中的关键接口之一。它定义了我们如何查找可用的服务实例。

对于我们的示例应用程序，我们将对示例服务器的两个不同实例进行硬编码。它们在同一台计算机上运行，但使用不同的端口：

```java
class DemoInstanceSupplier implements ServiceInstanceListSupplier {
    private final String serviceId;

    public DemoInstanceSupplier(String serviceId) {
        this.serviceId = serviceId;
    }

    @Override
    public String getServiceId() {
        return serviceId;
    }

    @Override
        public Flux<List<ServiceInstance>> get() {
          return Flux.just(Arrays
            .asList(new DefaultServiceInstance(serviceId + "1", serviceId, "localhost", 8080, false),
              new DefaultServiceInstance(serviceId + "2", serviceId, "localhost", 8081, false)));
    }
}
```

在实际系统中，我们希望使用不对服务地址进行硬编码的实现。我们稍后会对此进行更多研究。

现在，我们创建一个 LoadBalancerConfiguration 类：

```java
@Configuration
@LoadBalancerClient(name = "example-service", configuration = DemoServerInstanceConfiguration.class)
class WebClientConfig {
    @LoadBalanced
    @Bean
    WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
```

此类有一个角色：创建负载均衡的 WebClient 构建器以发出远程请求。请注意，我们的注释使用服务的伪名称。



这是因为我们可能无法提前知道运行实例的实际主机名和端口。因此，我们使用伪名称作为占位符，框架在选择正在运行的实例时将替换实际值。



接下来，让我们创建一个 Configuration 类来实例化我们的服务实例供应商。请注意，我们使用与上述相同的伪名称：

```java
@Configuration
class DemoServerInstanceConfiguration {
    @Bean
    ServiceInstanceListSupplier serviceInstanceListSupplier() {
        return new DemoInstanceSupplier("example-service");
    }
}
```

现在，我们可以创建实际的客户端应用程序。让我们使用上面的 WebClient Bean 向示例服务器发送 10 个请求：

```java
@SpringBootApplication
public class ClientApplication {

    public static void main(String[] args) {

        ConfigurableApplicationContext ctx = new SpringApplicationBuilder(ClientApplication.class)
          .web(WebApplicationType.NONE)
          .run(args);

        WebClient loadBalancedClient = ctx.getBean(WebClient.Builder.class).build();

        for(int i = 1; i <= 10; i++) {
            String response =
              loadBalancedClient.get().uri("http://example-service/hello")
                .retrieve().toEntity(String.class)
                .block().getBody();
            System.out.println(response);
        }
    }
}
```

查看输出，我们可以确认我们在两个不同的实例之间进行负载均衡：

```shell
Hello from instance 2
Hello from instance 1
Hello from instance 2
Hello from instance 1
Hello from instance 2
Hello from instance 1
Hello from instance 2
Hello from instance 1
Hello from instance 2
Hello from instance 1
```

## 4. 其他功能

示例服务器和客户端显示了 Spring Cloud Load Balancer 的非常简单的用法。但其他库功能也值得一提。

首先，示例客户端使用默认的 RoundRobinLoadBalancer 策略。该库还提供了一个 RandomLoadBalancer 类。我们还可以使用我们想要的任何算法创建自己的 ReactorServiceInstanceLoadBalancer 实现。

此外，该库还提供了一种动态发现服务实例的方法。我们使用 DiscoveryClientServiceInstanceListSupplier 接口执行此操作。这对于与服务发现系统（如 Eureka 或 Zookeeper）集成非常有用。

除了不同的负载均衡和服务发现功能外，该库还提供基本的重试功能。在后台，它最终依赖于 Spring Retry 库。这允许我们重试失败的请求，可能在一段时间后使用相同的实例。

另一个内置功能是指标，它建立在千分尺库之上。开箱即用，我们可以获得每个实例的基本服务级别指标，但我们也可以添加自己的指标。

最后，Spring Cloud Load Balancer 库提供了一种使用 LoadBalancerCacheManager 接口缓存服务实例的方法。这很重要，因为在现实中，查找可用的服务实例可能涉及远程调用。这意味着查找不经常更改的数据可能成本很高，并且它还代表了应用程序中可能的故障点。通过使用服务实例的缓存，我们的应用程序可以解决其中的一些缺点。

## 5. 结论

负载均衡是构建现代容错系统的重要组成部分。使用 Spring Cloud Load Balancer，我们可以轻松创建应用程序，这些应用程序使用各种负载均衡技术将请求分发到不同的服务实例。



这里的所有示例代码都可以在 [GitHub](https://github.com/eugenp/tutorials/tree/master/spring-cloud-modules/spring-cloud-loadbalancer) 上找到。