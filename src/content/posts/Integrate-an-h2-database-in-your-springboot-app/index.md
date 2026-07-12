---

slug: "/Integrate-an-h2-database-in-your-springboot-app"

description: "Integrate an H2 Database in Your Spring Boot App。"
title: Integrate an H2 Database in Your Spring Boot App
date: "2018-05-08 18:26:47"
summary: "Integrate an H2 Database in Your Spring Boot App。"
tags: ['coding']

---

> 原文地址 https://dzone.com/articles/integrate-h2-database-in-your-spring-boot-applicat

In this tutorial, we will be integrating the H2 database in your Spring Boot application. Note that the H2 database is in the embedded mode.

You have created a Spring Boot application and would like to integrate with an H2 database.

In pom.xml, add the below dependency:

```xml
<!-- H2 Database -->
 <dependency>
 <groupId>com.h2database</groupId>
 <artifactId>h2</artifactId>
 </dependency>
```

In the application.properties file, add the below line to enable the H2 database:

```java
# H2
spring.h2.console.enabled=true
spring.h2.console.path=/h2
# Datasource
spring.datasource.url=jdbc:h2:file:~/test
spring.datasource.username=sa
spring.datasource.password=
spring.datasource.driver-class-name=org.h2.Driver
Take a Maven build and run the application as a Spring Boot app.
```

Open a browser and type http://localhost:8080/h2 to get the below image.

![](https://raw.githubusercontent.com/jasonyang86/nocoder/master/data/images/201805/h2databasejosepraveen1.png)

The yellow highlighted lines should match your application.properties file.

![](https://raw.githubusercontent.com/jasonyang86/nocoder/master/data/images/201805/h2databasejosepraveen11.png)

That's it! If you get stuck, kindly comment below.