---

slug: "/java-bytecode-and-instructions"

description: "理解字节码以及理解Java编译器如何生成Java字节码与学习汇编知识对于C/C++程序员有一样的意义。"
title: Java字节码和指令集
date: "2023-06-30 10:36:19"
summary: "理解字节码以及理解Java编译器如何生成Java字节码与学习汇编知识对于C/C++程序员有一样的意义。"
tags: ['coding','java']

---


> Java 字节码是Java虚拟机执行的一种指令格式。大多数操作码都是一个字节长，而有些操作需要参数，导致了有一些多字节的操作码。而且并不是所有可能的256个操作码都被使用；其中有51个操作码被保留做将来使用。除此之外，Sun 公司额外保留了3个代码永久不使用。


## 指令

每一个字节，有256个可能的代码值（2^8=256），因此一个字节的操作码最多可能有256种不同的操作。其中，0x00、0xFE、0xCA、0xFF被指定保留。例如0xCA作为一个Java调试器的中断指令而从未被语言使用。相似地，0xFE和0xFF也未被语言使用。

指令可以基本分为以下几类：

- 存储指令 （例如：aload_0, istore）
- 算术与逻辑指令 （例如: ladd, fcmpl）
- 类型转换指令 （例如：i2b, d2i）
- 对象创建与操作指令 （例如：new, putfield）
- 堆栈操作指令 （例如：swap, dup2）
- 控制转移指令 （例如：ifeq, goto）
- 方法调用与返回指令 （例如：invokespecial, areturn)

除此之外，还有一些更特殊的指令，作为异常抛出或同步等作用。

大多数的指令有前缀和（或）后缀来表明其操作数的类型。如下表

|前/后缀|	操作数类型|
|--|--|
|i	|整数|
|l	|长整数|
|s	|短整数|
|b	|字节|
|c	|字符|
|f	|单精度浮点数|
|d	|双精度浮点数|
|z	|布尔值|
|a	|引用|

例如，"iadd"指令将两个整数相加；而"dadd"指令将两个double浮点数相加。 
此外，"const"、 "load"、 "store"等命令还会使用"_n"后缀，其中 "load"和"store"命令中的n可以为0到3之间的整数；而"const"命令中的n由类型指定。 const"指令把一个指定类型的值放入堆栈。例如"iconst_5"指令将一个整数5放入堆栈；而"dconst_1"将一个双精度浮点数1放入堆栈。
此外还有"aconst_null"指令，放入一个null进堆栈。而对于"load" "store"指令中的n，指定了变量表中的存储位置。"aload_0"指令把在变量0中的对象（通常是"this"对象）放入堆栈，"istore_1"指令把栈顶的一个整数放入变量1.对于更高的变量，后缀将被去除，而这条指令将需要操作数。

## 指令集

|助记词|说明|
|--|--|
|nop	|None|
|aconst_null|	将null推送至栈顶|
|iconst_m1|	将int型-1推送至栈顶|
|iconst_0|	将int型0推送至栈顶|
|iconst_1|	将int型1推送至栈顶|
|iconst_2|	将int型2推送至栈顶|
|iconst_3|	将int型3推送至栈顶|
|iconst_4|	将int型4推送至栈顶|
|iconst_5|	将int型5推送至栈顶|
|lconst_0|	将long型0推送至栈顶|
|lconst_1|	将long型1推送至栈顶|
|fconst_0|	将float型0推送至栈顶|
|fconst_1|	将float型1推送至栈顶|
|fconst_2|	将float型2推送至栈顶|
|dconst_0|	将double型0推送至栈顶|
|dconst_1|	将double型1推送至栈顶|
|bipush|	将单字节的常量值(-128~127)推送至栈顶|
|sipush|	将一个短整型常量(-32768~32767)推送至栈顶|
|ldc|	将int,float或String型常量值从常量池中推送至栈顶|
|ldc_w|	将int,float或String型常量值从常量池中推送至栈顶(宽索引)|
|ldc2_w|	将long或double型常量值从常量池中推送至栈顶(宽索引)|
|iload	|将指定的int型本地变量推送至栈顶|
|lload	|将指定的long型本地变量推送至栈顶|
|fload	|将指定的float型本地变量推送至栈顶|
|dload	|将指定的double型本地变量推送至栈顶|
|aload	|将指定的引用类型本地变量推送至栈顶|
|iload_0|	将第一个int型本地变量推送至栈顶|
|iload_1	|将第二个int型本地变量推送至栈顶|
|iload_2	|将第三个int型本地变量推送至栈顶|
|iload_3|	将第四个int型本地变量推送至栈顶|
|lload_0|	将第一个long型本地变量推送至栈顶|
|lload_1|	将第二个long型本地变量推送至栈顶|
|lload_2|	将第三个long型本地变量推送至栈顶|
|lload_3|	将第四个long型本地变量推送至栈顶|
|fload_0|	将第一个float型本地变量推送至栈顶|
|fload_1|	将第二个float型本地变量推送至栈顶|
|fload_2|	将第三个float型本地变量推送至栈顶|
|fload_3|	将第四个float型本地变量推送至栈顶|
|dload_0|	将第一个double型本地变量推送至栈顶|
|dload_1|	将第二个double型本地变量推送至栈顶|
|dload_2|	将第三个double型本地变量推送至栈顶|
|dload_3|	将第四个double型本地变量推送至栈顶|
|aload_0|	将第一个引用类型本地变量推送至栈顶|
|aload_1|	将第二个引用类型本地变量推送至栈顶|
|aload_2|	将第三个引用类型本地变量推送至栈顶|
|aload_3|	将第四个引用类型本地变量推送至栈顶|
|iaload	|将int型数组指定索引的值推送至栈顶|
|laload	|将long型数组指定索引的值推送至栈顶|
|faload	|将float型数组指定索引的值推送至栈顶|
|daload	|将double型数组指定索引的值推送至栈顶|
|aaload	|将引用类型数组指定索引的值推送至栈顶|
|baload	|将boolean或byte型数组指定索引的值推送至栈顶|
|caload	|将char型数组指定索引的值推送至栈顶|
|saload	|将short型数组指定索引的值推送至栈顶|
|istore	|将栈顶int型数值存入指定本地变量|
|lstore	|将栈顶long型数值存入指定本地变量|
|fstore	|将栈顶float型数值存入指定本地变量|
|dstore	|将栈顶double型数值存入指定本地变量|
|astore	|将栈顶引用类型数值存入指定本地变量|
|istore_0|	将栈顶int型数值存入第一个本地变量|
|istore_1|	将栈顶int型数值存入第二个本地变量|
|istore_2|	将栈顶int型数值存入第三个本地变量|
|istore_3|	将栈顶int型数值存入第四个本地变量|
|lstore_0|	将栈顶long型数值存入第一个本地变量|
|lstore_1|	将栈顶long型数值存入第二个本地变量|
|lstore_2|	将栈顶long型数值存入第三个本地变量|
|lstore_3|	将栈顶long型数值存入第四个本地变量|
|fstore_0|	将栈顶float型数值存入第一个本地变量|
|fstore_1|	将栈顶float型数值存入第二个本地变量|
|fstore_2|	将栈顶float型数值存入第三个本地变量|
|fstore_3|	将栈顶float型数值存入第四个本地变量|
|dstore_0|	将栈顶double型数值存入第一个本地变量|
|dstore_1|	将栈顶double型数值存入第二个本地变量|
|dstore_2|	将栈顶double型数值存入第三个本地变量|
|dstore_3|	将栈顶double型数值存入第四个本地变量|
|astore_0|	将栈顶引用型数值存入第一个本地变量|
|astore_1|	将栈顶引用型数值存入第二个本地变量|
|astore_2|	将栈顶引用型数值存入第三个本地变量|
|astore_3|	将栈顶引用型数值存入第四个本地变量|
|iastore|	将栈顶int型数值存入指定数组的指定索引位置|
|lastore|	将栈顶long型数值存入指定数组的指定索引位置|
|fastore|	将栈顶float型数值存入指定数组的指定索引位置|
|dastore|	将栈顶double型数值存入指定数组的指定索引位置|
|aastore|	将栈顶引用型数值存入指定数组的指定索引位置|
|bastore|	将栈顶boolean或byte型数值存入指定数组的指定索引位置|
|castore|	将栈顶char型数值存入指定数组的指定索引位置|
|sastore|	将栈顶short型数值存入指定数组的指定索引位置|
|pop|	将栈顶数值弹出(数值不能是long或double类型的)|
|pop2|	将栈顶的一个(对于非long或double类型)或两个数值(对于非long或double的其他类型)弹出|
|dup	|复制栈顶数值并将复制值压入栈顶|
|dup_x1	复制栈顶数值并将两个复制值压入栈顶|
|dup_x2	复制栈顶数值并将三个(或两个)复制值压入栈顶|
|dup2	|复制栈顶一个(对于long或double类型)或两个(对于非long或double的其他类型)数值并将复制值压入栈顶|
|dup2_x1	|dup_x1指令的双倍版本|
|dup2_x2|	dup_x2指令的双倍版本|
|swap	|将栈顶最顶端的两个数值互换(数值不能是long或double类型)|
|iadd	|将栈顶两int型数值相加并将结果压入栈顶|
|ladd	|将栈顶两long型数值相加并将结果压入栈顶|
|fadd	|将栈顶两float型数值相加并将结果压入栈顶|
|dadd	|将栈顶两double型数值相加并将结果压入栈顶|
|isub	|将栈顶两int型数值相减并将结果压入栈顶|
|lsub	|将栈顶两long型数值相减并将结果压入栈顶|
|fsub	|将栈顶两float型数值相减并将结果压入栈顶|
|dsub	|将栈顶两double型数值相减并将结果压入栈顶|
|imul	|将栈顶两int型数值相乘并将结果压入栈顶|
|lmul	|将栈顶两long型数值相乘并将结果压入栈顶|
|fmul	|将栈顶两float型数值相乘并将结果压入栈顶|
|dmul	|将栈顶两double型数值相乘并将结果压入栈顶|
|idiv	|将栈顶两int型数值相除并将结果压入栈顶|
|ldiv	|将栈顶两long型数值相除并将结果压入栈顶|
|fdiv	|将栈顶两float型数值相除并将结果压入栈顶|
|ddiv	|将栈顶两double型数值相除并将结果压入栈顶|
|irem	|将栈顶两int型数值作取模运算并将结果压入栈顶|
|lrem	|将栈顶两long型数值作取模运算并将结果压入栈顶|
|frem	|将栈顶两float型数值作取模运算并将结果压入栈顶|
|drem	|将栈顶两double型数值作取模运算并将结果压入栈顶|
|ineg	|将栈顶int型数值取负并将结果压入栈顶|
|lneg	|将栈顶long型数值取负并将结果压入栈顶|
|fneg	|将栈顶float型数值取负并将结果压入栈顶|
|dneg	|将栈顶double型数值取负并将结果压入栈顶|
|ishl	|将int型数值左移指定位数并将结果压入栈顶|
|lshl	|将long型数值左移指定位数并将结果压入栈顶|
|ishr	|将int型数值右(带符号)移指定位数并将结果压入栈顶|
|lshr	|将long型数值右(带符号)移指定位数并将结果压入栈顶|
|iushr	|将int型数值右(无符号)移指定位数并将结果压入栈顶|
|lushr	|将long型数值右(无符号)移指定位数并将结果压入栈顶|
|iand	|将栈顶两int型数值"按位与"并将结果压入栈顶|
|land	|将栈顶两long型数值"按位与"并将结果压入栈顶|
|ior	|将栈顶两int型数值"按位或"并将结果压入栈顶|
|lor	|将栈顶两long型数值"按位或"并将结果压入栈顶|
|ixor	|将栈顶两int型数值"按位异或"并将结果压入栈顶|
|lxor	|将栈顶两long型数值"按位异或"并将结果压入栈顶|
|iinc	|将指定int型变量增加指定值(如i++, i--, i+=2等)|
|i2l	|将栈顶int型数值强制转换为long型数值并将结果压入栈顶|
|i2f	|将栈顶int型数值强制转换为float型数值并将结果压入栈顶|
|i2d	|将栈顶int型数值强制转换为double型数值并将结果压入栈顶|
|l2i	|将栈顶long型数值强制转换为int型数值并将结果压入栈顶|
|l2f	|将栈顶long型数值强制转换为float型数值并将结果压入栈顶|
|l2d	|将栈顶long型数值强制转换为double型数值并将结果压入栈顶|
|f2i	|将栈顶float型数值强制转换为int型数值并将结果压入栈顶|
|f2l	|将栈顶float型数值强制转换为long型数值并将结果压入栈顶|
|f2d	|将栈顶float型数值强制转换为double型数值并将结果压入栈顶|
|d2i	|将栈顶double型数值强制转换为int型数值并将结果压入栈顶|
|d2l	|将栈顶double型数值强制转换为long型数值并将结果压入栈顶|
|d2f	|将栈顶double型数值强制转换为float型数值并将结果压入栈顶|
|i2b	|将栈顶int型数值强制转换为byte型数值并将结果压入栈顶|
|i2c	|将栈顶int型数值强制转换为char型数值并将结果压入栈顶|
|i2s	|将栈顶int型数值强制转换为short型数值并将结果压入栈顶|
|lcmp	|比较栈顶两long型数值大小, 并将结果(1, 0或-1)压入栈顶|
|fcmpl	|比较栈顶两float型数值大小, 并将结果(1, 0或-1)压入栈顶; 当其中一个数值为NaN时, 将-1压入栈顶|
|fcmpg	|比较栈顶两float型数值大小, 并将结果(1, 0或-1)压入栈顶; 当其中一个数值为NaN时, 将1压入栈顶|
|dcmpl	|比较栈顶两double型数值大小, 并将结果(1, 0或-1)压入栈顶; 当其中一个数值为NaN时, 将-1压入栈顶|
|dcmpg	|比较栈顶两double型数值大小, 并将结果(1, 0或-1)压入栈顶; 当其中一个数值为NaN时, 将1压入栈顶|
|ifeq	|当栈顶int型数值等于0时跳转|
|ifne	|当栈顶int型数值不等于0时跳转|
|iflt	|当栈顶int型数值小于0时跳转|
|ifge	|当栈顶int型数值大于等于0时跳转|
|ifgt	|当栈顶int型数值大于0时跳转|
|ifle	|当栈顶int型数值小于等于0时跳转|
|if_icmpeq	|比较栈顶两int型数值大小, 当结果等于0时跳转|
|if_icmpne	|比较栈顶两int型数值大小, 当结果不等于0时跳转|
|if_icmplt	|比较栈顶两int型数值大小, 当结果小于0时跳转|
|if_icmpge	|比较栈顶两int型数值大小, 当结果大于等于0时跳转|
|if_icmpgt	|比较栈顶两int型数值大小, 当结果大于0时跳转|
|if_icmple	|比较栈顶两int型数值大小, 当结果小于等于0时跳转|
|if_acmpeq	|比较栈顶两引用型数值, 当结果相等时跳转|
|if_acmpne	|比较栈顶两引用型数值, 当结果不相等时跳转|
|goto	|无条件跳转|
|jsr	|跳转至指定的16位offset位置, 并将jsr的下一条指令地址压入栈顶|
|ret	|返回至本地变量指定的index的指令位置(一般与jsr或jsr_w联合使用)|
|tableswitch	|用于switch条件跳转, case值连续(可变长度指令)|
|lookupswitch	|用于switch条件跳转, case值不连续(可变长度指令)|
|ireturn	|从当前方法返回int|
|lreturn	|从当前方法返回long|
|freturn	|从当前方法返回float|
|dreturn	|从当前方法返回double|
|areturn	|从当前方法返回对象引用|
|return|	从当前方法返回void|
|getstatic|	获取指定类的静态域, 并将其压入栈顶|
|putstatic|	为指定类的静态域赋值|
|getfield	|获取指定类的实例域, 并将其压入栈顶|
|putfield	|为指定类的实例域赋值|
|invokevirtual	|调用实例方法|
|invokespecial|	调用超类构建方法, 实例初始化方法, 私有方法|
|invokestatic	|调用静态方法|
|invokeinterface	|调用接口方法|
|invokedynamic	|调用动态方法|
|new	|创建一个对象, 并将其引用引用值压入栈顶|
|newarray	|创建一个指定的原始类型(如int, float, char等)的数组, 并将其引用值压入栈顶|
|anewarray	|创建一个引用型(如类, 接口, 数组)的数组, 并将其引用值压入栈顶|
|arraylength	|获取数组的长度值并压入栈顶|
|athrow|	将栈顶的异常抛出|
|checkcast|检验类型转换, 检验未通过将抛出 ClassCastException|
|instanceof	|检验对象是否是指定类的实际, 如果是将1压入栈顶, 否则将0压入栈顶|
|monitorenter|	获得对象的锁, 用于同步方法或同步块|
|monitorexit	|释放对象的锁, 用于同步方法或同步块|
|wide	|扩展本地变量的宽度|
|multianewarray	|创建指定类型和指定维度的多维数组(执行该指令时, 操作栈中必须包含各维度的长度值), 并将其引用压入栈顶|
|ifnull|	为null时跳转|
|ifnonnull	|不为null时跳转|
|goto_w	|无条件跳转(宽索引)|
|jsr_w	|跳转至指定的32位offset位置, 并将jsr_w的下一条指令地址压入栈顶|

## 计算模型

Java字节码的计算模型是面向堆栈结构计算机的。例如，一个x86处理器的汇编代码如下

```shell
mov eax, byte [ebp-4]
mov edx, byte [ebp-8]
add eax, edx
mov ecx, eax
```

这段代码将两个数值相加，并存入另一个地址。相似的反汇编字节码如下
```java
0 iload_1
1 iload_2
2 iadd
3 istore_3
```

在这里，需要相加的两个操作数被放入堆栈，而相加操作就在栈中进行，其结果也被放入堆栈。存储指令之后把栈顶的数据放入一个变量地址。在每条指令前面的数字仅仅是表示这条指令到方法开始处的偏移值。这种堆栈结构也可以推广到面向对象模型上。例如，有一个"getName"方法如下

```java
 Method java.lang.String getName()
 0 aload_0       // "this"对象被存入变量0
 1 getfield #5 <Field java.lang.String name>
                 // 这个指令从栈顶取出一个对象，并从中搜索一个指定的域
                 // 并将相应的数据存入栈顶。
                 // 这个例子中，"name"域对应于该类中的第五个常量。
 
 4 areturn  	 // 返回栈顶的对象作为函数的返回值
```


## 例子

考虑如下Java代码

```java
  outer:
  for (int i = 2; i < 1000; i++) {
      for (int j = 2; j < i; j++) {
          if (i % j == 0)
              continue outer;
      }
      System.out.println (i);
  }
```

假设上述代码位于一个函数中，Java编译器可能将代码翻译成下述的Java字节码。

```java
  0:   iconst_2
  1:   istore_1
  2:   iload_1
  3:   sipush  1000
  6:   if_icmpge       44
  9:   iconst_2
  10:  istore_2
  11:  iload_2
  12:  iload_1
  13:  if_icmpge       31
  16:  iload_1
  17:  iload_2
  18:  irem
  19:  ifne    25
  22:  goto    38
  25:  iinc    2, 1
  28:  goto    11
  31:  getstatic       #84; //Field java/lang/System.out:Ljava/io/PrintStream;
  34:  iload_1
  35:  invokevirtual   #85; //Method java/io/PrintStream.println:(I)V
  38:  iinc    1, 1
  41:  goto    2
  44:  return
```

## 基于Java字节码的语言

Groovy, 一种基于Java的脚本语言
Scala,一种类型安全的通用编程语言，支持面向对象编程和函数式编程
Clojure, 一种函数式的通用编程语言，提供优秀的并发性。是一种LISP方言

## 对动态语言的支持

Java虚拟机对动态类型语言提供了一定的支持。但绝大多数的Java虚拟机指令集是基于静态类型语言的。在静态类型机制下，方法调用中的类型分析都是在编译时执行的，而且缺乏一种机制在运行时确定一个类型已经确定相应的方法。

JSR292中，在Java虚拟机层次增加了一种支持动态类型的指令`invokedynamic`，以支持在动态类型检测中的方法调用。 达芬奇机器则是一种支持这种动态类型调用的虚拟机。 而所有支持JSE 7的Java虚拟机都应支持`invokedynamic`操作码。


## 参考连接

- https://en.wikipedia.org/wiki/List_of_Java_bytecode_instructions
- https://zh.wikipedia.org/wiki/Java%E5%AD%97%E8%8A%82%E7%A0%81#cite_note-5
