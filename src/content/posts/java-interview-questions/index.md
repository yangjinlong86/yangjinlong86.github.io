---

slug: "/java-interview-questions"

description: "这些是我被问到的面试题，比较基础。"
title: 几道Java相关的面试题
date: "2018-04-11 21:19:10"
summary: "这些是我被问到的面试题，比较基础。"
tags: ['coding']

---
### 1. 数据库编码和服务端代码编码一致情况下，Get请求可能产生乱码的原因及解决办法？

- 检查中间键tomcat、jetty对get请求的解码格式，默认是iso-8859-1的话，可能会产生乱码，解决办法修改中间键配置文件中URIEncoding解码格式。

### 2. Struts2和SpringMVC的区别？

- Struts2入口是`Filter`，SpringMVC是`Servlet`
- Spring MVC是基于方法的设计，而Struts2是基于类
- Spring MVC的方法之间基本上是独立的，独享request和response，而Struts2所有Action变量是共享的
- Struts2有自己的interceptor机制，Spring MVC用的是独立的AOP方式

### 3. Spring MVC的Controller是单例的吗，有什么影响吗？

- Spring MVC 的 Controller 是单例的
- 如果在controller中定义了非静态成员变量，会导致属性重复使用

```java
// 非静态成员变量j的属性值会重复利用，不会累加
// 解决办法：不要定义非静态成员变量，或者使用多例 @Scope("prototype")
@Controller
@RequestMapping("/test")
public class IndexController{
	private static int i = 0;
	private int j = 0;
	public String test(){
		System.out.println((i++) + "|" + (j++));
		return "test";
	}
}

```

### 4. MyBatis如何防止sql注入？

Mybatis中的`#{}`和`${}`的区别

- `#{}`使用的是PreparedStatement，会有类型转换, 将传入的数据都当成一个字符串，会对自动传入的数据加一个双引号。如：order by #user_id#，如果传入的值是111,那么解析成sql时的值为order by "111", 如果传入的值是id，则解析成的sql为order by "id"
- `${}`将传入的数据直接显示生成在sql中。如：order by $user_id$，如果传入的值是111,那么解析成sql时的值为order by user_id,  如果传入的值是id，则解析成的sql为order by id
- `#{}`方式能够很大程度防止sql注入
- `${}`方式无法防止Sql注入
- `${}`方式一般用于传入数据库对象，例如传入表名
- 尽量使用`#{}`代替`${}`
- 参考文献
	- https://segmentfault.com/a/1190000010107964
	- https://my.oschina.net/chuibilong/blog/638950
	- https://blog.csdn.net/kakaxi_77/article/details/46007239

### 5. Hibernate一级缓存、二级缓存？
- 一级缓存
	- 第一级缓存是 Session 缓存并且是一种强制性的缓存，所有的要求都必须通过它。Session 对象在它自己的权利之下，在将它提交给数据库之前保存一个对象。
	- 如果你对一个对象发出多个更新，Hibernate 会尝试尽可能长地延迟更新来减少发出的 SQL 更新语句的数目。如果你关闭 session,所有缓存的对象丢失，或是存留，或是在数据库中被更新。

- 二级缓存
	- 第二级缓存是一种可选择的缓存并且第一级缓存在任何想要在第二级缓存中找到一个对象前将总是被询问。
	- 第二级缓存可以在每一个类和每一个集合的基础上被安装，并且它主要负责跨会话缓存对象。
	- 任何第三方缓存可以和 Hibernate 一起使用。org.hibernate.cache.CacheProvider 接口被提供，它必须实现来给 Hibernate 提供一个缓存实现的解决方法。

- 参考文献
	- http://wiki.jikexueyuan.com/project/hibernate/caching.html
	- https://blog.csdn.net/xlgen157387/article/details/40071651 

### 6. 使用过哪些Socket框架？

- Socket
  - netty
  - java sockets 
    - [A Guide to Java Sockets](https://www.baeldung.com/a-guide-to-java-sockets)
- WebSocket 
  - [阮一峰的WebSocket教程]([http://www.ruanyifeng.com/blog/2017/05/websocket.html](http://www.ruanyifeng.com/blog/2017/05/websocket.html))

### 7. Spring MVC 请求-响应流程
![](https://raw.githubusercontent.com/jasonyang86/nocoder/master/data/images/201804/springmvc%E8%AF%B7%E6%B1%82%E8%B7%9F%E8%B8%AA.png)

1. 浏览器发送请求的url以及其他信息

2. DispatcherServlet先会查询处理器映射（handler mapping），来确定发送给哪个控制器。

3. 确定合适的控制器后，将请求发送给选中的控制器

4. 控制器完成逻辑处理后，将模型数据打包，并标示出输出的视图名，将请求连同模型和视图名发送回DispatcherServlet

5. DispatcherServlet使用视图解析器（view resolver）来将逻辑视图名匹配一个特定的视图实现（jsp或其它）

6. DispatcherServlet匹配到对应的视图实现

7. 视图使用模型数据渲染输出，这个输出通过响应对象传递给客户端

### 8. 对 HTTP 协议无状态的理解
对**无状态**的理解

- 协议对于事务处理没有记忆能力
- 对同一个url请求没有上下文关系
- 每次的请求都是独立的，它的执行情况和结果与前面的请求和之后的请求是无直接关系的，它不会受前面的请求应答情况直接影响，也不会直接影响后面的请求应答情况
- 服务器中没有保存客户端的状态，客户端必须每次带上自己的状态去请求服务器
- 人生若只如初见

**状态**的含义：客户端和服务器在某次会话中产生的数据。

**无状态**就意味着，这些数据不会被保留，但是通过增加cookie和session机制，现在的网络请求其实是有状态的。

在没有状态的http协议下，服务器也一定会保留你每次网络请求对数据的修改，但这跟保留每次访问的数据是不一样的，保留的只是会话产生的结果，而没有保留会话。

知乎上有个哥们儿举的一个例子：

> **有状态：**
> 
> A：你今天中午吃的啥？
> B：吃的大盘鸡。
> A：味道怎么样呀？
> B：还不错，挺好吃的。
> 
> **无状态：**
> 
> A：你今天中午吃的啥？
> B：吃的大盘鸡。
> A：味道怎么样呀？
> B：？？？啊？啥？啥味道怎么样？
> 
> 所以需要cookie这种东西：
> 
> A：你今天中午吃的啥？
> B：吃的大盘鸡。
> A：你今天中午吃的大盘鸡味道怎么样呀？
> B：还不错，挺好吃的。

### 9. Redis 存储机制

- RDB
- AOF

### 10. AOP的原理

- AOP 术语
- 代理模式
- Spring AOP

### 11.分布式事务解决方案

- 两阶段提交
- TCC补偿
- 最终一致性
	- 可靠性消息服务
- 最大努力通知型事务

### 12. Object 对象的方法有哪些？分别有什么作用？该什么场景用？ 

```java 
Object o = new Object(); 

o.equals(); 

o.hashCode(); 

o.toString(); 

o.getClass(); 

o.wait(); 

o.notify(); 

o.notifyAll(); 

```