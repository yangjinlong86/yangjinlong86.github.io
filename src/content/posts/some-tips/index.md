---

slug: "/some-tips"

description: "2018年在云图用到的技术"
title: 云图web项目技术栈盘点
date: "2018-09-29 15:06:05"
summary: "2018年在云图用到的技术"
tags: ['coding']

---

> 记得有一次春哥笑着跟我说，“你要相信，别人能做出来的东西，你也可以。”

### 架构设计

- 领域驱动设计
- 分布式系统架构设计

### 框架应用

- eureka
- springboot
- alibaba oss
- alibaba canal应用
    - 伪装slave向mysql请求binlog，将分析结果发送到客户端，客户端获取到数据变更后，作相应数据的统计分析操作
- mysql
    - binlog
- elasticsearch
    - 全文检索，用于app搜索功能
- node.js
- vue
    - 前端框架
- pm2
    - 用于生产环境的nodejs server

### CI/CD

- jenkins pipeline
    - 从gitlab拉取项目源码
    - mvn命令打包，使用maven-dockerfile插件实现自动构建和上传到远程私有仓库

### 容器应用

- docker
    - 云图书馆所有java应用docker化
    - jenkins pipeline实现半自动化
    - docker-compose

### 中间件

- nginx
- kafka

### 设计模式应用

- 数据统计分析系统重构
	- 观察者模式
	- 责任链模式
	- 命令模式
- ARTS
	- 代理模式
		- 静态代理
		- 动态代理
	- 策略模式


### 操作系统

- ubuntu
    - 了解到我的日常工作不用依赖于windows系统后，果断换了ubuntu

### 工具

- idea
- vscode 
	- 很好用的编辑器，出自微软
- navicat
	- 数据库客户端
- xmind
	- 思维导图
- pycharm
	- python 编辑器


### 脚本语言

- python 
    - 写了一个清理docker image的小程序，从配置文件读取server信息，使用ssh登陆到server，执行shell命令

### Java

- 多线程
- 异常处理


Game stucked...