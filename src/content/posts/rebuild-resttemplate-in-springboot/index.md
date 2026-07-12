---

slug: "/rebuild-resttemplate-in-springboot"

description: "Spring Bean 花样玩法，监听配置变化后销毁并重新注册Bean"
title: "在Springboot中重建RestTemplate Bean"
date: "2024-06-03 18:43:48"
summary: "Spring Bean 花样玩法，监听配置变化后销毁并重新注册Bean"
tags: ['coding', 'java']
draft: false
---

最近有个需求，用户希望RestTemplate能够绕过ssl证书验证，直接访问目标地址。虽然这并不安全，但是作为开发人员，只能有求必应啊。

需要设计一个开关，是否忽略ssl验证，默认为false。而且配置得动态刷新，也就是说，一旦修改了配置，就要重新生成一个RestTemplate。

实现思路如下：

1. 增加一个配置`rest-template.ignore-ssl-validation`，初始值为`false`。
2. 修改`RestTemplate`初始化逻辑，根据配置来决定生成的`RestTemplate`的方式。
3. 写一个`RestTempalteRebuilder`类，包含重新生成`RestTemplate`的逻辑，新建一个`RestTemplate  bean`，从`spring`中销毁旧的`bean`，再向`spring`中注册新的`bean`。
4. 实现一个`ApplicationListener`，监听`RefreshEvent`事件，如果该配置发生变化，则调用`RestTempalteRebuilder`的重建`RestTemplate`方法。

遇到的问题：

1. `ApplicationListener` 初始化完成后，注解了`@ConfigurationProperties`的类还没有初始化完，获取的值为`null` ！！！
2. `ApplicationListener` 的执行顺序在 `RefreshEventListener`之前，当监听器触发时，获取不到变化后的值，慢了整整一个八拍！！！

解决办法：

1. 实现 `InitialingBean` 和 `afterPropertiesSet()` 方法，意思时在依赖的bean全部初始化好之后执行这个方法，所以可以在这里方法里去初始化读取到的配置的值。
2. 注入 `ContextRefresher`，当自定义的监听器执行的时候，就去刷新以下缓存，就可以取到变化后的值了。


替换context中的bean

```java
DefaultSingletonBeanRegistry registry = (DefaultSingletonBeanRegistry) applicationContext.getAutowireCapableBeanFactory();
registry.destroySingleton("restTemplate");
registry.registerSingleton("restTemplate", new RestTemplate()); 
```

首先从`ApplicationContext`中获取到`DefaultSingletonBeanRegistry`，使用`destroySingleton()`来销毁`restTemplate bean`， 然后使用`registerSingleton()`将新建好的`bean`再注册进去，这个`registerSingleton()` 方法不仅会在 `ApplicationContext` 中创建 `bean`，还会自动将其注入到依赖的对象中，完美。