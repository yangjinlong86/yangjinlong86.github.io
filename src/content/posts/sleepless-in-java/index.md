---

slug: "/sleepless-in-java"

description: "这本书很有意思，虽然有点旧，还是推荐阅读一下"
title: 读《Java夜未眠》部分笔记
date: "2018-04-23 19:41:22"
summary: "这本书很有意思，虽然有点旧，还是推荐阅读一下"
tags: ['coding']

---

编程是我的一大兴趣爱好，写程序让我觉得很开心。就像蔡学镛老师说的：“我承认我很幸运，现在的我同时把程序设计当成茶余饭后的休闲活动、学习的题材，以及赚钱的工作。”

今晚失眠了，想起蔡老师的《Java夜未眠》，翻出来再读一读，做了一些笔记，供自己和程序员朋友们参考。

## 《Java夜未眠》部分笔记

> 蔡学镛 
台湾台南县人，于1999年获得台湾清华大学计算机硕士学位，曾经担任创新工场首席布道师。
蔡学镛从小开始学习编写程序，至今已经27年，涉猎极广，相关领域有：
编程语言（BASIC、BaseIII+、LIPPER、86汇编语言、C++、Java、C#、VB .net），
DSL（领域特定语言）、软件工程、操作系统、虚拟机器等。
蔡学镛担任过华硕集团软件工程师、技术总监、元智大学讲师、美商欧莱礼出版社技术编辑、台湾微软杂志专栏作家、CTO、阿里巴巴集团支付宝架构师、创新工场架构师、银联移动支付首席产品架构师。
著有《Java夜未眠》《编程ING》，
译有《深入浅出设计模式》、《随意搜索》、《超越Java：探讨程式语言的未来（台湾版）》、《Ajax快速上手》、《Java虚拟机器（台湾版）》。

### 学习，是一条漫长的道路

- 先深后广
- 阅读英文技术资料

### 写程序，好好玩

- policy tool 安全设定《Java 安全防护》
- refactoring
- You’ve got the whole world in your hand

### 如何进入程序设计的领域

- 培养兴趣
- 慎选程序语言
	- REBOL
	- Python
	- Java
		- A Jack of all trades is master of none
		- 学精某种程序语言，然后再学另一个程序语言

- 使用适当的开发工具

- 多读好书，少上课
	- 找志同道合的朋友组织“读书会”

- 加强英文阅读能力
    
- 求人之前，先求自己
	- 自己应该尝试先查书、写程序测试、甚至阅读源代码来找答案

- 多写程序练习
	-  由小到大，由简单到复杂
	-  找一些有趣的题目（比如：计算器、踩地雷、小画家、俄罗斯方块等）

- 向上延伸、向下延伸、向旁延伸
	- 向上延伸：学习对象导向分析设计、设计模式、重构以及软件工程。让自己具有做大型项目的能力
	- 向下延伸：升入了解内部底层的运作机制，例如数据结构、操作系统原理、计算机组织与结构
	- 向旁延伸：学习不同应用领域的API，例如：多媒体、数据库、分布式运算等

- 写程序是很有趣的事情，可以把自己的想法付诸实现
- 每隔半年检阅自己这段时间的进步

### 职业敏感度

- 把职业融入生活
-  培养高度的职业敏感度
    - 让自己暴露再大量相关的信息下


### 程序员的生涯规划

### 软件产业的知识经济
- Know-What 认知性的只是 cognitive knowledge
- Know-How 进阶技能 advanced skills
- Know-why 对整个系统的掌握度 System understanding，了解各种知识背后复杂交错的因果关系
- Care-Why 自发性的创意 self-motivated creativity
- 时间和努力见证知识经济

### 偶像崇拜
- 适当地崇拜优质的偶像，可以激励起自己“有为者亦若是”的精神
- David Flanagan ：《Java in Nutshell》
- Jonathan Knudsen：《Java密码学》 《Java 2D图形技术》 《乐高可编程积木》
- Bruce Eckel：《Thinking in java》
- Elliotte Rusty Harold：《Java Network Programming》《java I/O》《XML Bible》
- Martin Fowler：《Refactoring》 《UML Distilled》 《Analysis Patterns》
- Bill Day：JMF Java Media Framework
- James Gosling
- Bertrand meyer 《Object oriented software construction，2nd ed》
- Carl sassenrath rebol
- charles petzold《code》

### 学习java
- java 的原理     
- 学会java 语言
     《The Java spacification 》
     《inside in java virtual machine》
- 面相对象的思维
     多看相关书 design pattern refactoring
     多看java API design 与implementation
     多写程序
- API
- 开发工具的用法
- 垃圾回收
	- 改用一个内存管理方式好一点的虚拟机
	- 少制造垃圾，能用数组的就不要用vector，能用Stringbuffer的就不要用String
	- 不再使用的对象要尽早设置为null

- 变量的种类
	- 根据声明方式，分为7种变量

```java
class MyClass{
	  //class variable 声明在class内，method之外，且用static修饰的变量             
     static int a;
     
     //instance variable 声明在class内，method之外，未用static修饰的变量
     int b;
     
     //method parameter声明在method小括号内的变量
     public static void MyMethod(int c){
          try{
             // local variable 狭义的局部变量 声明在method内的变量
             int d;
             
          }catch(Exception e){
             // exception-handler parameter 声明在catch小括号内的变量  
          }
     }
     
     // constructor parameter 声明在constructor小括号内的变量
     MyClass(int f){
          // local variable 狭义的局部变量 声明在method内的变量
          int[] g = new int[100];
     }
}

```

- 根据变量的内存，分为2种变量
     heap variable 占用的内存在heap中，包括了 class variable，instance variable，array compnent，即上一程序的a b g[0]，这类变量会自动被JVM初始化成默认值
     stack variable 通常称为广义的局部变量 pan-local variable，占用的内存在stack中，这类变量包括了狭义的局部变量，exception-handler parameter，method parameter，constructor parameter 即上面程序的cdef，狭义的局部变量不会被JVM初始化默认值，使用者必须自行初始化该变量，但是 parameter类的变量会被JVM初始化成传入的值。

- 根据使用方式为变量分类
     class variable
     instance variable
     广义的局部变量 包含上例的cdef
     数组视为对象，array compenent 视为对象的instance variable
     

















