---

slug: "/byte-buddy"

description: "使用 Byte Buddy 操作和新建Java类，以及拦截方法调用"
title: "Byte Buddy"
date: "2024-03-13"
summary: "使用 Byte Buddy 操作和新建Java类，以及拦截方法调用"
tags: ['coding','java']

---

> 原文地址：https://www.baeldung.com/byte-buddy

## 1. 概述

简单地说，[ByteBuddy](http://bytebuddy.net/#/) 是一个用于在运行时动态生成 Java 类的框架。
 
在这篇文章中，我们将使用该框架来操作现有的类、按需创建新类，甚至拦截方法调用。

## 2. 依赖关系

让我们首先将依赖项添加到我们的项目中。在 Maven 的项目，我们需要将此依赖项添加到 pom.xml 中：

```xml
<dependency>
    <groupId>net.bytebuddy</groupId>
    <artifactId>byte-buddy</artifactId>
    <version>1.14.6</version>
</dependency>
```

在 Gradle 的项目，我们需要将相同的工件添加到 build.gradle 文件中：

```
compile net.bytebuddy:byte-buddy:1.14.6
```

最新版本可以在  [Maven Central](https://mvnrepository.com/artifact/net.bytebuddy/byte-buddy) 上找到。

## 3. 在运行时创建 Java 类

首先通过子类化现有类来创建动态类。看一下经典的 Hello World 项目。

在此示例中，我们创建一个类型 (Class)，它是 Object.class 的子类并重写 toString() 方法：

```java
DynamicType.Unloaded unloadedType = new ByteBuddy()
  .subclass(Object.class)
  .method(ElementMatchers.isToString())
  .intercept(FixedValue.value("Hello World ByteBuddy!"))
  .make();
```

我们刚刚所做的就是创建一个 ByteBuddy 的实例。然后，我们使用 subclass() API 来扩展 Object.class，并使用 ElementMatchers 选择父类 (Object.class) 的 toString()。

最后，通过intercept()方法，我们提供了toString()的实现并返回一个固定值。

make() 方法触发生成新的类。

此时，我们的类已经创建，但尚未加载到 JVM 中。它由 DynamicType.Unloaded 的实例表示，它是生成类型的二进制形式。

因此，我们需要将生成的类加载到JVM中才能使用：

```java
Class<?> dynamicType = unloadedType.load(getClass()
  .getClassLoader())
  .getLoaded();
```

现在，我们可以实例化dynamicType并调用它的toString()方法：

```java
assertEquals(
  dynamicType.newInstance().toString(), "Hello World ByteBuddy!");
```

请注意，调用dynamicType.toString() 将不起作用，因为它只会调用ByteBuddy.class 的toString() 实现。

newInstance() 是一个 Java 反射方法，用于创建此 ByteBuddy 对象表示的类型的新实例；其方式类似于将 new 关键字与无参数构造函数一起使用。

到目前为止，我们只能重写动态类型的超类中的方法并返回我们自己的固定值。在接下来的部分中，我们将研究使用自定义逻辑定义我们的方法。

## 4.方法委托和自定义逻辑

在前面的示例中，我们从 toString() 方法返回一个固定值。

实际上，应用程序需要比这更复杂的逻辑。促进和向动态类型提供自定义逻辑的一种有效方法是方法调用的委托。

让我们创建一个动态类型，它是 Foo.class 的子类，它具有 sayHelloFoo() 方法：

```java
public class Foo {
    public String sayHelloFoo() {
        return "Hello in Foo!";
    }
}
```

再创建另一个类 Bar，它具有与 sayHelloFoo() 相同的签名和返回类型的静态方法 sayHelloBar()：

```java
public class Bar {
    public static String sayHelloBar() {
        return "Hello in Bar!";
    }
}
```

现在我们使用 ByteBuddy 的 DSL 将 sayHelloFoo() 的所有调用委托给 sayHelloBar()。这允许我们在运行时向新创建的类提供用纯 Java 编写的自定义逻辑：

```java
String r = new ByteBuddy()
  .subclass(Foo.class)
  .method(named("sayHelloFoo")
    .and(isDeclaredBy(Foo.class)
    .and(returns(String.class))))        
  .intercept(MethodDelegation.to(Bar.class))
  .make()
  .load(getClass().getClassLoader())
  .getLoaded()
  .newInstance()
  .sayHelloFoo();
        
assertEquals(r, Bar.sayHelloBar());
```

调用 sayHelloFoo() 将相应地调用 sayHelloBar()。

> ByteBuddy 如何知道要调用 Bar.class 中的哪个方法呢？

它是根据方法签名、返回类型、方法名称和注释来选择匹配的方法。
  
sayHelloFoo() 和 sayHelloBar() 方法没有相同的名称，但它们具有相同的方法签名和返回类型。
 
如果 Bar.class 中有多个具有匹配签名和返回类型的可调用方法，我们可以使用 @BindingPriority 注解来解决歧义。

@BindingPriority 采用整数参数 - 整数值越大，调用特定实现的优先级越高。因此，在下面的代码片段中，sayHelloBar() 将优于 sayBar()：

```java
@BindingPriority(3)
public static String sayHelloBar() { 
    return "Holla in Bar!"; 
}

@BindingPriority(2)
public static String sayBar() { 
    return "bar"; 
}
```

## 5. 方法和字段定义

我们已经能够覆盖动态类型的超类中声明的方法。继续进一步向类添加一个新方法（或字段）。

使用 Java 反射来调用动态创建的方法：

```java
Class<?> type = new ByteBuddy()
  .subclass(Object.class)
  .name("MyClassName")
  .defineMethod("custom", String.class, Modifier.PUBLIC)
  .intercept(MethodDelegation.to(Bar.class))
  .defineField("x", String.class, Modifier.PUBLIC)
  .make()
  .load(
    getClass().getClassLoader(), ClassLoadingStrategy.Default.WRAPPER)
  .getLoaded();

Method m = type.getDeclaredMethod("custom", null);
assertEquals(m.invoke(type.newInstance()), Bar.sayHelloBar());
assertNotNull(type.getDeclaredField("x"));
```


我们创建了一个名为 MyClassName 的类，是 Object.class 的子类。然后定义一个自定义方法，返回一个字符串并具有公共访问修饰符。

就像我们在前面的示例中所做的那样，我们通过拦截对它的调用并将它们委托给我们在本教程前面创建的 Bar.class 来实现我们的方法。

## 6. 重新定义现有类

尽管我们一直在使用动态创建的类，但我们也可以使用已经加载的类。这可以通过重新定义（或变基）现有类并使用 ByteBuddyAgent 将它们重新加载到 JVM 中来完成。

首先，让我们将 ByteBuddyAgent 添加到 pom.xml 中：

```xml
<dependency>
    <groupId>net.bytebuddy</groupId>
    <artifactId>byte-buddy-agent</artifactId>
    <version>1.14.6</version>
</dependency>
```

最新版本可以从[这里](https://mvnrepository.com/artifact/net.bytebuddy/byte-buddy-agent)找。

现在，让我们重新定义之前在 Foo.class 中创建的 sayHelloFoo() 方法：

```java
ByteBuddyAgent.install();
new ByteBuddy()
  .redefine(Foo.class)
  .method(named("sayHelloFoo"))
  .intercept(FixedValue.value("Hello Foo Redefined"))
  .make()
  .load(
    Foo.class.getClassLoader(), 
    ClassReloadingStrategy.fromInstalledAgent());
  
Foo f = new Foo();
 
assertEquals(f.sayHelloFoo(), "Hello Foo Redefined");
```

## 7. 总结

在这份指南中，我们学习了 Byte Buddy 的功能以及如何使用它来高效创建动态类。

[官方文档](http://bytebuddy.net/#/tutorial) 提供了对byte buddy 内部工作原理和其他方面的深入解释。

本教程的完整代码可以在[Github](https://github.com/eugenp/tutorials/tree/master/libraries-bytecode)上找到。
