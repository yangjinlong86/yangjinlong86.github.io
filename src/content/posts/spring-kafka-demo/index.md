---

slug: "/spring-kafka-demo"

description: "使用spring-kafka KafkaTemplate 向指定的 topic 发送消息"
title: "Spring-kafka简单使用示例"
date: 2025-01-06
summary: "使用spring-kafka KafkaTemplate 向指定的 topic 发送消息"
tags: ['coding']
draft: false
---

要实现向指定 topic 发送消息的功能，需要使用 Spring Kafka 提供的 `KafkaTemplate`。以下是实现步骤：

1. **添加依赖**：确保项目中包含了 Spring Kafka 的依赖。如果使用的是 Maven，可以在 `pom.xml` 中添加以下依赖：

    ```xml
    <dependency>
        <groupId>org.springframework.kafka</groupId>
        <artifactId>spring-kafka</artifactId>
    </dependency>
    ```


2. **配置 KafkaTemplate**：在 Spring 配置类中配置 `KafkaTemplate`。例如：

    ```java
    import org.apache.kafka.common.serialization.StringSerializer;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.kafka.core.DefaultKafkaProducerFactory;
    import org.springframework.kafka.core.KafkaTemplate;
    import org.springframework.kafka.core.ProducerFactory;
    import org.springframework.kafka.support.serializer.JsonSerializer;

    import java.util.HashMap;
    import java.util.Map;

    @Configuration
    public class KafkaProducerConfig {

        @Bean
        public ProducerFactory<String, Object> producerFactory() {
            Map<String, Object> configProps = new HashMap<>();
            configProps.put(org.apache.kafka.clients.producer.ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
            configProps.put(org.apache.kafka.clients.producer.ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
            configProps.put(org.apache.kafka.clients.producer.ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
            return new DefaultKafkaProducerFactory<>(configProps);
        }

        @Bean
        public KafkaTemplate<String, Object> kafkaTemplate() {
            return new KafkaTemplate<>(producerFactory());
        }
    }
    ```


3. **在 KafkaService 中使用 KafkaTemplate 发送消息**：

    ```java
    package com.example.springboot.service;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.kafka.core.KafkaTemplate;
    import org.springframework.stereotype.Service;

    @Service
    public class KafkaService {

        @Autowired
        private KafkaTemplate<String, Object> kafkaTemplate;

        public void sendMessage(String topic, Object message) {
            kafkaTemplate.send(topic, message);
        }
    }
    ```


4. **使用 KafkaService 发送消息**：可以在其他服务或控制器中注入 `KafkaService` 并调用 `sendMessage` 方法来发送消息。

    ```java
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestBody;
    import org.springframework.web.bind.annotation.RequestParam;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    public class MessageController {

        @Autowired
        private KafkaService kafkaService;

        @PostMapping("/send")
        public String sendMessage(@RequestParam String topic, @RequestBody Object message) {
            kafkaService.sendMessage(topic, message);
            return "Message sent to topic: " + topic;
        }
    }
    ```

