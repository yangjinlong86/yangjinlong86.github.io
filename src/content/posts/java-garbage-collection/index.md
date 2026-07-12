---

slug: "/java-garbage-collection"

description: "Java 垃圾收集器"
title: Java 垃圾收集器
date: 2019-05-21
summary: "Java 垃圾收集器"
tags: ['coding','java']

---

**Serial收集器** 

简单高效的单线程的收集器，在它做收集工作时，会停掉所有其他的工作线程，直到它收集结束。 

**ParNew收集器** 

ParNew收集器是Serial收集器的多线程版本，多条垃圾收集线程并行工作，但此时用户线程仍然处于等待状态。 

**Parallel Scavenge收集器** 

Parallel Scavenge收集器的目标是达到一个可控制的吞吐量。parallel Scavenge 收集器提供了两个参数用于精确控制吞吐量，分别是控制最大垃圾收集停顿时间的-XX:MaxGCPauseMillis参数以及直接设置吞吐量大小的-XX:GCTimeRatio参数。 

**Serail Old 收集器**

Serail Old收集器是Serial收集器的老年代版本，是单线程的收集器，使用标记-整理算法，这个收集器的主要意义在于给Client模式下的虚拟机使用

**Parallel Old 收集器**

Parallel Old 收集器是Parallel Scavenge 收集器的老年代版本，是多线程的收集器，使用标记-整理算法，从JDK1.6开始提供。

**CMS收集器**

CMS(Concurrent Mark Sweep) 收集器是一种以获取最短回收停顿时间为目标的收集器，使用标记-清除算法，收集过程分为4个步骤，初始标记(initial mark)->并发标记(concurrent mark)->重新标记(remark)->并发清除(concurrent sweep)，其中初始标记和重新标记这两个步骤需要停止所有其他工作线程，初始标记仅标记一下GC Roots能直接关联到的对象，速度很快，并发标记阶段就是进行GC Roots Tracing的过程，而重新标记阶段则是为了修正并发标记期间因用户工作线程继续执行导致标记产生变动的那一部分对象的标记记录，这个阶段的停顿时间

**G1收集器**

G1是面向服务端应用的垃圾收集器，与其他收集器相比，有一下特点：

- 并行与并发
- 分代收集
- 空间整合
- 可预测的停顿

初始标记、并发标记、最终标记、筛选回收