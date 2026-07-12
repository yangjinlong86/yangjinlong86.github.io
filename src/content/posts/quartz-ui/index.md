---

slug: "/quartz-ui"

description: "基于Quartz的定时任务UI组件"
title: 基于Quartz的定时任务UI组件
date: "2023-07-07 17:14"
summary: "基于Quartz的定时任务UI组件"
tags: ['coding']

---

## 需求

> 我需要实现一个基于`springboot` 的`quartz-ui`组件，可以通过web界面来管理定时任务。然后打包成`jar`文件，提供给使用`quartz`的项目。

## 基本思路
1. 去github上逛一圈，有现成的就拿来试试，改改直接用，不然还能怎么样，难道自己生写
2. 好吧，如果没有我就去啃 `quartz` 的 API，然后自己生写

于是很快我就找到了 [quartz-web-ui-kit](https://github.com/zjcscut/quartz-web-ui-kit)，`Readme`在这个哥们儿的个人博客上，但链接已经访问不到了，不过找到一个cnblogs的[基于Quartz编写一个可复用的分布式调度任务管理WebUI组件](https://www.cnblogs.com/throwable/p/12670693.html)。代码拉下来研究了一下，结构清晰，命名舒服，maven的依赖也没什么多余的，直击要害，就只解决任务管理问题。模版用`freemarker`，`css`和`js`用`uikit`和`jquery`。简单明了，感谢分享，就用您这个了。

跑完SQL脚本，很顺利就运行起来了，测试了一下功能，除了禁用的任务还能点触发，后台会报错，倒也没啥影响。

接下来开始动手改：
1、这个组件需要打成`jar`，需要的项目就增加一个依赖。
2、上传到nexus私服。

## 问题和解决办法

1、项目无法直接加载`jar`中静态文件，打包时需要将静态文件放在`META-INF/resources`目录下。

在`pom.xml` 的 `build` 下增加
```xml
<resources>
	<resource>
		<directory>${basedir}/src/main/resources/templates</directory>
		<targetPath>META-INF/resources/</targetPath>
		<includes>
			<include>**/**</include>
		</includes>
	</resource>
</resources>
```

`application.yml`中也要对应修改`template-loader-path`的路径
```yml
spring:
  freemarker:
    cache: false
    charset: UTF-8
    check-template-location: true
    content-type: text/html
    expose-request-attributes: true
    expose-session-attributes: true
    request-context-attribute: request
    suffix: .ftl
    template-loader-path: classpath:/META-INF/resources/
    prefer-file-system-access: false
```

2、配置文件也需要打包进去，继续在`pom.xml` 的 `resources` 下增加
```xml
	<resource>
		<directory>${basedir}/src/main/resources/</directory>
		<includes>
			<include>**/*.yml</include>
			<include>**/*.factories</include>
		</includes>
	</resource>
```

3、发现`jar`中的配置文件不生效，被项目的`application.yml`覆盖了

将配置文件放在`src/main/resources/config`目录下即可，参考`Spring`[官方文档](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-external-config.html)

> ### 24.3 Application Property Files
>`SpringApplication` loads properties from `application.properties` files in the following locations and adds them to the Spring `Environment`:
>
>A `/config` subdirectory of the current directory
>The current directory
>A classpath `/config` package
>The classpath root

	
## 参考链接
- https://www.cnblogs.com/throwable/p/12670693.html
- https://github.com/zjcscut/quartz-web-ui-kit
- https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-external-config.html

差不多了，有啥后面再补充。今天周五，下午划水写博客，下班回家玩羊娃子喜欢的周五夜放克。