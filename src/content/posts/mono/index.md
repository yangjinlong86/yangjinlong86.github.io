---

slug: "/mono"

description: "在 Reactive 编程中，Mono<> 可以用来处理异步操作的结果，这些操作可能会返回一个元素、一个完成信号或者一个错误。它是一个强大的工具，可用于构建响应式、非阻塞和异步的应用程序，尤其适合于现代分布式系统和高并发环境"
title: "Mono类怎么用"
date: 2025-01-15
summary: "在 Reactive 编程中，Mono<> 可以用来处理异步操作的结果，这些操作可能会返回一个元素、一个完成信号或者一个错误。它是一个强大的工具，可用于构建响应式、非阻塞和异步的应用程序，尤其适合于现代分布式系统和高并发环境"
tags: ['coding']
draft: true
---

### 一、概述
- `Mono<>` 是 Project Reactor 库中的一个类，它是 Reactive Streams 规范的实现，用于表示包含 0 或 1 个元素的异步序列。
- 在 Reactive 编程中，`Mono<>` 可以用来处理异步操作的结果，这些操作可能会返回一个元素、一个完成信号或者一个错误。它是一个强大的工具，可用于构建响应式、非阻塞和异步的应用程序，尤其适合于现代分布式系统和高并发环境。


### 二、核心特点
- **异步和非阻塞**：
  - `Mono<>` 是为异步操作设计的，允许程序在等待结果时不阻塞线程，提高系统资源的利用率。它利用回调、事件驱动和操作符链的方式，使程序能够同时处理多个操作而无需等待每个操作完成，提高了系统的吞吐量和响应性。
- **处理 0 或 1 个元素**：
  - 与 `Flux<>` 类（表示 0 到 N 个元素的序列）不同，`Mono<>` 专门用于处理可能包含零个或一个元素的情况。例如，一个 HTTP 请求可能返回一个响应（一个元素），也可能不返回任何内容（零个元素），或者产生一个错误。


### 三、创建 `Mono<>` 实例的常见方法
- **使用 `Mono.just()`**：
  - 创建一个包含单个元素的 `Mono<>`。例如：
    ```java
    Mono<String> mono = Mono.just("Hello");
    ```
  - 这个 `Mono` 包含一个元素 `"Hello"`，当订阅时，它会将该元素发送给订阅者。
- **使用 `Mono.empty()`**：
  - 创建一个不包含元素的 `Mono<>`。例如：
    ```java
    Mono<String> emptyMono = Mono.empty();
    ```
  - 这个 `Mono` 只发送完成信号，不会发送任何元素。
- **使用 `Mono.error()`**：
  - 创建一个只包含错误的 `Mono<>`。例如：
    ```java
    Mono<String> errorMono = Mono.error(new RuntimeException("Error occurred"));
    ```
  - 当订阅这个 `Mono` 时，会立即发送一个 `RuntimeException` 给订阅者。
- **使用 `Mono.fromCallable()`**：
  - 从 `Callable` 函数式接口创建 `Mono<>`。例如：
    ```java
    Mono<String> callableMono = Mono.fromCallable(() -> "Hello from Callable");
    ```
  - 当订阅时，会调用 `Callable` 中的 `call()` 方法，如果发生异常，会将异常作为错误发送给订阅者。
- **使用 `Mono.fromSupplier()`**：
  - 从 `Supplier` 函数式接口创建 `Mono<>`。例如：
    ```java
    Mono<String> supplierMono = Mono.fromSupplier(() -> "Hello from Supplier");
    ```
  - 当订阅时，会调用 `Supplier` 中的 `get()` 方法，与 `fromCallable()` 类似，但 `Supplier` 不允许抛出检查异常。


### 四、操作符
- `Mono<>` 提供了多种操作符，允许你对异步序列进行各种操作，以下是一些常见的操作符：
- **转换操作符**：
  - **`map()`**：
    - 将 `Mono` 中的元素转换为另一种类型。例如：
      ```java
      Mono<String> mono = Mono.just("Hello");
      Mono<Integer> mappedMono = mono.map(String::length);
      ```
    - `map()` 操作符将 `String` 元素的长度作为 `Integer` 元素发送出去。
  - **`flatMap()`**：
    - 将 `Mono` 中的元素转换为另一个 `Mono`，并将结果展平。例如：
      ```java
      Mono<String> mono = Mono.just("Hello");
      Mono<Integer> flatMappedMono = mono.flatMap(s -> Mono.just(s.length()));
      ```
    - `flatMap()` 操作符将 `String` 元素转换为 `Mono<Integer>`，并将其展平，使得最终结果是 `Mono<Integer>`。
- **过滤操作符**：
  - **`filter()`**：
    - 根据条件过滤元素。例如：
      ```java
      Mono<String> mono = Mono.just("Hello");
      Mono<String> filteredMono = mono.filter(s -> s.startsWith("H"));
      ```
    - 只有当元素满足条件（这里是 `s.startsWith("H")`）时，才会将元素发送给订阅者。
- **组合操作符**：
  - **`then()`**：
    - 当 `Mono` 完成时，开始另一个 `Mono`。例如：
      ```java
      Mono<Void> firstMono = Mono.fromRunnable(() -> System.out.println("First"));
      Mono<Void> secondMono = Mono.fromRunnable(() -> System.out.println("Second"));
      Mono<Void> combinedMono = firstMono.then(secondMono);
      ```
    - 当 `firstMono` 完成时，开始 `secondMono`。
  - **`zip()`**：
    - 将多个 `Mono` 组合在一起，产生一个包含组合元素的 `Mono`。例如：
      ```java
      Mono<String> mono1 = Mono.just("Hello");
      Mono<Integer> mono2 = Mono.just(5);
      Mono<Tuple2<String, Integer>> zippedMono = Mono.zip(mono1, mono2);
      ```
    - `zip()` 操作符将 `mono1` 和 `mono2` 组合在一起，产生一个包含 `Tuple2<String, Integer>` 的 `Mono`。
- **错误处理操作符**：
  - **`onErrorReturn()`**：
    - 当 `Mono` 发生错误时，返回一个默认值。例如：
      ```java
      Mono<String> mono = Mono.error(new RuntimeException("Error"))
                          .onErrorReturn("Default Value");
      ```
    - 当 `Mono` 产生错误时，会返回 `"Default Value"`。
  - **`onErrorResume()`**：
    - 当 `Mono` 发生错误时，使用另一个 `Mono` 替代。例如：
      ```java
      Mono<String> mono = Mono.error(new RuntimeException("Error"))
                          .onErrorResume(e -> Mono.just("Fallback Value"));
      ```
    - 当 `Mono` 产生错误时，会使用 `Mono.just("Fallback Value")` 替代。


### 五、订阅和消费 `Mono<>`
- 要获取 `Mono<>` 的结果，需要订阅它，例如：
  ```java
  Mono<String> mono = Mono.just("Hello");
  mono.subscribe(
        value -> System.out.println("Received: " + value),
        error -> System.out.println("Error: " + error.getMessage()),
        () -> System.out.println("Completed")
  );
  ```
- **代码解释**：
  - `subscribe()` 方法接收三个参数：
    - 第一个 Lambda 表达式 `value -> System.out.println("Received: " + value)` 处理元素。
    - 第二个 Lambda 表达式 `error -> System.out.println("Error: " + error.getMessage())` 处理错误。
    - 第三个 Lambda 表达式 `() -> System.out.println("Completed")` 处理完成信号。


### 六、使用场景
- **HTTP 请求处理**：
  - 发送一个 HTTP 请求，使用 `Mono<>` 表示可能的响应。例如，使用 Spring WebFlux 的 WebClient：
    ```java
    import org.springframework.web.reactive.function.client.WebClient;
    import reactor.core.publisher.Mono;

    public class HttpExample {
        public static void main(String[] args) {
            WebClient client = WebClient.create("http://example.com");
            Mono<String> response = client.get()
                                    .uri("/data")
                                    .retrieve()
                                    .bodyToMono(String.class);
            response.subscribe(
                  value -> System.out.println("Response: " + value),
                  error -> System.out.println("Error: " + error.getMessage()),
                  () -> System.out.println("Request completed")
            );
        }
    }
    ```
  - `bodyToMono(String.class)` 将 HTTP 响应体作为 `Mono<String>` 返回，然后可以使用 `subscribe()` 方法处理响应或错误。
- **数据库操作**：
  - 在使用响应式数据库客户端（如 R2DBC）时，`Mono<>` 可用于表示单个数据库记录的操作结果。例如：
    ```java
    import io.r2dbc.spi.ConnectionFactory;
    import reactor.core.publisher.Mono;
    import org.springframework.r2dbc.core.DatabaseClient;

    public class DatabaseExample {
        public static void main(String[] args) {
            ConnectionFactory connectionFactory =...; // 配置连接工厂
            DatabaseClient client = DatabaseClient.create(connectionFactory);
            Mono<Integer> result = client.sql("SELECT COUNT(*) FROM users")
                                    .map(row -> row.get(0, Integer.class))
                                    .one();
            result.subscribe(
                  value -> System.out.println("Count: " + value),
                  error -> System.out.println("Error: " + error.getMessage()),
                  () -> System.out.println("Query completed")
            );
        }
    }
    ```
  - `one()` 方法返回一个 `Mono<Integer>` 表示查询结果。


### 七、总结
- `Mono<>` 类是 Reactive 编程中的重要组成部分，它提供了一种强大的方式来处理可能包含零个或一个元素的异步操作。
- 通过操作符可以对 `Mono<>` 序列进行各种转换、过滤、组合和错误处理操作。
- 订阅 `Mono<>` 可以让你处理元素、错误和完成信号，从而实现非阻塞和异步的操作处理。


`Mono<>` 类是构建高性能、响应式应用程序的关键，通过合理使用 `Mono<>` 和相关操作符，可以更好地利用系统资源，提高系统的并发性能和响应速度，特别适合于现代的分布式和高并发应用场景。
