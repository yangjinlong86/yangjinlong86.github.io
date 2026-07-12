---

slug: "/mono-and-flux"

description: "Mono 和 Flux 是 Java 中 Reactive 编程的核心元素，它们为处理异步操作提供了强大的抽象。"
title: "Java 中的 Mono 和 Flux 的详细介绍及使用场景"
date: 2025-01-15
summary: "Mono 和 Flux 是 Java 中 Reactive 编程的核心元素，它们为处理异步操作提供了强大的抽象。"
tags: ['coding']
draft: false
---

### 一、Mono 和 Flux 概述
- **Mono**：
  - `Mono` 是 Project Reactor 库中的一个类，用于表示包含 0 或 1 个元素的异步序列。它是 Reactive Streams 规范的实现，适用于处理可能有结果也可能没有结果的操作，或者仅对单个结果感兴趣的情况。
  - 例如，在进行数据库查询时，如果期望的结果是单个对象（如 `SELECT * FROM users WHERE id = 1`），使用 `Mono` 是合适的。
  - 当调用一个可能返回单个值或为空的服务时，如查找用户信息、获取单个配置项等，`Mono` 是不错的选择。
- **Flux**：
  - `Flux` 也是 Project Reactor 库中的类，它表示包含 0 到 N 个元素的异步序列。它可以用来处理多个元素的数据流，例如从数据库中查询多个记录，或者从文件中读取多行数据等场景。
  - 例如，当进行 `SELECT * FROM users` 查询时，会得到多个用户记录，使用 `Flux<User>` 来表示这些用户对象的流。


### 二、创建 Mono 和 Flux
- **创建 Mono**：
  - **使用 `Mono.just()`**：
    ```java
    import reactor.core.publisher.Mono;

    public class MonoExample {
        public static void main(String[] args) {
            Mono<String> mono = Mono.just("Hello");
            mono.subscribe(System.out::println);
        }
    }
    ```
    - `Mono.just("Hello")` 创建了一个包含单个元素 `"Hello"` 的 `Mono`，并使用 `subscribe()` 方法订阅，将元素打印出来。
  - **使用 `Mono.empty()`**：
    ```java
    Mono<String> emptyMono = Mono.empty();
    emptyMono.subscribe(
        value -> System.out.println("Received: " + value),
        error -> System.out.println("Error: " + error.getMessage()),
        () -> System.out.println("Completed")
    );
    ```
    - `Mono.empty()` 创建一个不包含元素的 `Mono`，订阅时仅触发完成信号。
  - **使用 `Mono.error()`**：
    ```java
    Mono<String> errorMono = Mono.error(new RuntimeException("Error occurred"));
    errorMono.subscribe(
        value -> System.out.println("Received: " + value),
        error -> System.out.println("Error: " + error.getMessage()),
        () -> System.out.println("Completed")
    );
    ```
    - `Mono.error()` 创建一个包含错误的 `Mono`，订阅时会处理错误信息。
- **创建 Flux**：
  - **使用 `Flux.just()`**：
    ```java
    import reactor.core.publisher.Flux;

    public class FluxExample {
        public static void main(String[] args) {
            Flux<String> flux = Flux.just("One", "Two", "Three");
            flux.subscribe(System.out::println);
        }
    }
    ```
    - `Flux.just("One", "Two", "Three")` 创建了一个包含三个元素的 `Flux`，并将元素依次打印出来。
  - **使用 `Flux.fromArray()`**：
    ```java
    String[] array = {"One", "Two", "Three"};
    Flux<String> fluxFromArray = Flux.fromArray(array);
    fluxFromArray.subscribe(System.out::println);
    ```
    - 从数组创建 `Flux`，将数组元素作为流元素。
  - **使用 `Flux.range()`**：
    ```java
    Flux<Integer> fluxRange = Flux.range(1, 5);
    fluxRange.subscribe(System.out::println);
    ```
    - `Flux.range(1, 5)` 创建一个包含从 1 到 5 的整数序列的 `Flux`。


### 三、操作符
- **Mono 操作符示例**：
  - **`map()` 操作符**：
    ```java
    Mono<String> mono = Mono.just("Hello");
    Mono<Integer> mappedMono = mono.map(String::length);
    mappedMono.subscribe(System.out::println);
    ```
    - `map()` 将 `Mono` 中的元素转换为另一种类型，这里将字符串的长度作为结果。
  - **`flatMap()` 操作符**：
    ```java
    Mono<String> mono = Mono.just("Hello");
    Mono<Integer> flatMappedMono = mono.flatMap(s -> Mono.just(s.length()));
    flatMappedMono.subscribe(System.out::println);
    ```
    - `flatMap()` 将 `Mono` 中的元素转换为另一个 `Mono` 并展平，最终结果是 `Mono<Integer>`。
- **Flux 操作符示例**：
  - **`map()` 操作符**：
    ```java
    Flux<String> flux = Flux.just("One", "Two", "Three");
    Flux<Integer> mappedFlux = flux.map(String::length);
    mappedFlux.subscribe(System.out::println);
    ```
    - 将 `Flux` 中的元素映射为元素的长度。
  - **`filter()` 操作符**：
    ```java
    Flux<String> flux = Flux.just("One", "Two", "Three");
    Flux<String> filteredFlux = flux.filter(s -> s.startsWith("T"));
    filteredFlux.subscribe(System.out::println);
    ```
    - 过滤 `Flux` 中满足条件的元素，这里只保留以 "T" 开头的元素。


### 四、使用场景
- **Mono 使用场景**：
  - **HTTP 请求响应**：
    ```java
    import org.springframework.web.reactive.function.client.WebClient;
    import reactor.core.publisher.Mono;

    public class HttpMonoExample {
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
    - 使用 `WebClient` 发送 HTTP 请求，期望得到一个响应，使用 `Mono` 表示该响应。
  - **数据库操作（单个结果）**：
    ```java
    import io.r2dbc.spi.ConnectionFactory;
    import reactor.core.publisher.Mono;
    import org.springframework.r2dbc.core.DatabaseClient;

    public class DatabaseMonoExample {
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
    - 执行 SQL 查询，期望得到单个结果，使用 `Mono` 表示。
- **Flux 使用场景**：
  - **HTTP 请求响应（多个元素）**：
    ```java
    import org.springframework.web.reactive.function.client.WebClient;
    import reactor.core.publisher.Flux;

    public class HttpFluxExample {
        public static void main(String[] args) {
            WebClient client = WebClient.create("http://example.com");
            Flux<String> response = client.get()
                                   .uri("/data")
                                   .retrieve()
                                   .bodyToFlux(String.class);
            response.subscribe(
                value -> System.out.println("Response: " + value),
                error -> System.out.println("Error: " + error.getMessage()),
                () -> System.out.println("Request completed")
            );
        }
    }
    ```
    - 使用 `WebClient` 获取多个元素的响应，使用 `Flux` 表示。
  - **数据库操作（多个结果）**：
    ```java
    import io.r2dbc.spi.ConnectionFactory;
    import reactor.core.publisher.Flux;
    import org.springframework.r2dbc.core.DatabaseClient;

    public class DatabaseFluxExample {
        public static void main(String[] args) {
            ConnectionFactory connectionFactory =...; // 配置连接系统
            DatabaseClient client = DatabaseClient.create(connectionFactory);
            Flux<String> users = client.sql("SELECT name FROM users")
                                 .map(row -> row.get(0, String.class))
                                 .all();
            users.subscribe(
                value -> System.out.println("User: " + value),
                error -> System.out.println("Error: " + error.getMessage()),
                () -> System.out.println("Query completed")
            );
        }
    }
    ```
    - 从数据库中查询多个记录，使用 `Flux` 表示用户记录的流。


### 五、组合 Mono 和 Flux
- **组合多个 Mono**：
  ```java
  import reactor.core.publisher.Mono;
  import reactor.core.publisher.MonoProcessor;

  public class MonoCombinationExample {
      public static void main(String[] args) {
          Mono<String> mono1 = Mono.just("Hello");
          Mono<String> mono2 = Mono.just("World");
          Mono<String> combinedMono = Mono.zip(mono1, mono2)
                                   .map(tuple -> tuple.getT1() + " " + tuple.getT2());
          combinedMono.subscribe(System.out::println);
      }
  }
  ```
  - 使用 `Mono.zip()` 组合两个 `Mono` 并进行操作。
- **组合 Flux 和 Mono**：
  ```java
  import reactor.core.publisher.Flux;
  import reactor.core.publisher.Mono;

  public class FluxMonoCombinationExample {
      public static void main(String[] args) {
          Flux<String> flux = Flux.just("One", "Two", "Three");
          Mono<String> mono = Mono.just("Four");
          Flux<String> combinedFlux = flux.concatWith(mono);
          combinedFlux.subscribe(System.out::println);
      }
  }
  ```
  - 使用 `concatWith()` 将 `Flux` 和 `Mono` 组合在一起，形成一个新的 `Flux`。


### 六、总结
- `Mono` 和 `Flux` 是 Java 中 Reactive 编程的核心元素，它们为处理异步操作提供了强大的抽象。
- `Mono` 适用于处理 0 或 1 个元素的情况，而 `Flux` 适用于处理多个元素的情况。
- 通过操作符可以对它们进行转换、过滤、组合等操作，以满足不同的业务需求，并且在处理 HTTP 请求、数据库操作等场景中发挥重要作用，实现非阻塞和高并发处理。


使用 `Mono` 和 `Flux` 可以让 Java 应用程序更适应现代的高并发和分布式环境，提高系统的响应性和性能，是构建响应式应用程序的重要工具。

以上代码示例展示了 `Mono` 和 `Flux` 的基本使用，通过结合操作符和订阅机制，可以灵活处理异步操作和数据流，满足各种业务需求。在实际开发中，根据不同的情况选择 `Mono` 或 `Flux` 以及相应的操作符，可以构建高效、灵活的响应式应用程序。
