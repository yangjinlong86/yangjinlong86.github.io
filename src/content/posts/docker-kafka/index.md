---

slug: "/docker-kafka"

description: "帮助在本地环境中使用 Docker 来搭建一个简单的 Kafka 服务端，包括 ZooKeeper。"
title: "使用 Docker 搭建 Kafka 服务端"
date: 2025-01-06
summary: "帮助在本地环境中使用 Docker 来搭建一个简单的 Kafka 服务端，包括 ZooKeeper。"
tags: ['coding']
draft: false
---

使用 Docker 搭建 Kafka 服务端是一个相对简单的过程，因为 Docker 提供了现成的镜像来简化部署。以下是一个基本步骤指南，帮助在本地环境中使用 Docker 来搭建一个简单的 Kafka 服务端，包括 ZooKeeper（Kafka 需要它来进行协调）。

### 步骤 1: 安装 Docker
确保系统上已经安装了 Docker。如果还没有安装，请访问 [Docker官网](https://www.docker.com/) 并根据操作系统的不同下载和安装适合的版本。

### 步骤 2: 拉取 Kafka 和 ZooKeeper 的 Docker 镜像
打开命令行工具，执行以下命令来拉取最新的 Kafka 和 ZooKeeper 镜像：

```bash
docker pull wurstmeister/zookeeper
docker pull wurstmeister/kafka
```

`wurstmeister/zookeeper` 和 `wurstmeister/kafka` 是常用的 Docker 镜像，它们配置好了所有必要的环境变量和启动脚本，以方便快速启动 Kafka 和 ZooKeeper。

### 步骤 3: 创建 Docker 网络
为了让 Kafka 和 ZooKeeper 容器能够互相通信，创建一个新的 Docker 网络：

```bash
docker network create kafka-network
```

### 步骤 4: 启动 ZooKeeper 容器
使用以下命令启动 ZooKeeper 容器，并将其连接到刚才创建的网络：

```bash
docker run -d --name zookeeper \
  --network kafka-network \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  wurstmeister/zookeeper
```

### 步骤 5: 启动 Kafka 容器
接下来，启动 Kafka 容器并连接到同一个 Docker 网络。需要指定一些环境变量来告诉 Kafka 如何找到 ZooKeeper：

```bash
docker run -d --name kafka \
  --network kafka-network \
  -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  wurstmeister/kafka
```

这里我们做了以下几件事：
- `-p 9092:9092` 将容器的 9092 端口映射到主机的 9092 端口，以便可以从主机访问 Kafka。
- `-e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181` 设置了 Kafka 连接到 ZooKeeper 的地址。
- `-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092` 告诉 Kafka 它应该对外广播的监听地址，这对于外部客户端连接非常重要。
- `-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1` 设置了偏移量主题的复制因子为 1。在单节点环境中，这是必需的，因为它默认是 3，而在单节点环境下无法满足这个要求。

### 步骤 6: 测试 Kafka 服务
为了测试 Kafka 是否正确运行，可以创建一个测试 topic 并发送一条消息。首先，进入 Kafka 容器内部：

```bash
docker exec -it kafka /bin/bash
```

然后，在容器内使用 Kafka 自带的命令行工具来创建 topic 和生产/消费消息。例如，创建一个名为 `test` 的 topic：

```bash
kafka-topics.sh --create --topic test --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1
```

发送一条消息到这个 topic：

```bash
echo "Hello, Kafka" | kafka-console-producer.sh --broker-list localhost:9092 --topic test
```

最后，从这个 topic 中消费消息：

```bash
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
```

应该能看到之前发送的消息 "Hello, Kafka"。

### 注意事项
- 如果在非 Linux 系统上运行 Docker（比如 Windows 或 Mac），请确保将 `localhost` 替换为 Docker 主机的实际 IP 地址，特别是在设置 `KAFKA_ADVERTISED_LISTENERS` 环境变量时。
- 在生产环境中，应该配置更多的选项来确保 Kafka 的高可用性和安全性，比如设置多个副本、启用 SSL/TLS 加密等。


当在使用 Docker 容器运行 Kafka 时，遇到 `ERROR: Missing environment variable KAFKA_LISTENERS. Must be specified when using KAFKA_ADVERTISED_LISTENERS` 这样的错误信息，意味着必须同时指定 `KAFKA_LISTENERS` 和 `KAFKA_ADVERTISED_LISTENERS` 环境变量。`KAFKA_LISTENERS` 指定了 Kafka broker 监听的协议和端口，而 `KAFKA_ADVERTISED_LISTENERS` 则指定了对外广播的地址，用于客户端连接。

在单机环境中，如果想要从主机（即运行 Docker 的机器）访问 Kafka 容器，可以按照以下方式设置这两个环境变量：

### 解决方案

#### 修改启动命令
更新 Kafka 容器启动命令，添加 `KAFKA_LISTENERS` 环境变量，并确保 `KAFKA_ADVERTISED_LISTENERS` 正确指向了可以被外部访问的地址。例如：

```bash
docker run -d --name kafka \
  --network kafka-network \
  -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  wurstmeister/kafka
```

在这里：
- `-e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092`：告诉 Kafka 在所有网络接口上监听 9092 端口。
- `-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092`：告诉 Kafka 对外广播 `localhost:9092` 作为其连接地址。如果是从其他机器访问这个 Kafka 实例，需要将 `localhost` 替换为实际的 IP 地址或可解析的主机名。

#### 使用 Docker Compose (推荐)
如果使用 Docker Compose 来管理多个服务（如 Kafka 和 ZooKeeper），可以在 `docker-compose.yml` 文件中定义这些环境变量。下面是一个示例配置：

```yaml
version: '3.8'

services:
  zookeeper:
    image: wurstmeister/zookeeper
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: wurstmeister/kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

在这个 `docker-compose.yml` 文件中，我们同样设置了 `KAFKA_LISTENERS` 和 `KAFKA_ADVERTISED_LISTENERS`，并且通过 `depends_on` 确保 Kafka 服务在 ZooKeeper 启动之后再启动。

### 注意事项
- **网络模式**：如果使用的是自定义 Docker 网络（如上面的例子中的 `kafka-network`），确保 `KAFKA_ADVERTISED_LISTENERS` 中的地址是能够从客户端访问的。
- **多节点集群**：如果正在搭建一个多节点的 Kafka 集群，每个节点的 `KAFKA_ADVERTISED_LISTENERS` 应该指向该节点的实际 IP 地址或可解析的主机名，而不是 `localhost`。
- **安全性和认证**：在生产环境中，考虑使用 SSL/TLS 加密通信，并配置适当的认证机制来增强安全性。

### 测试
启动 Kafka 和 ZooKeeper 服务后，可以通过以下命令测试 Kafka 是否正常工作：

```bash
# 创建一个测试 topic
docker exec -it kafka kafka-topics.sh --create --topic test --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1

# 发送一条消息到 topic
echo "Hello, Kafka" | docker exec -i kafka kafka-console-producer.sh --broker-list localhost:9092 --topic test

# 从 topic 中消费消息
docker exec -it kafka kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
```

应该能看到之前发送的消息 "Hello, Kafka"。
