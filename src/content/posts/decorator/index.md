---

slug: "/decorator"

description: "本文以西游记中的“真假美猴王”为例，一起温习一下装饰器模式的使用场景及具体实现过程。"
title: "装饰器模式之真假美猴王"
date: "2018-05-19 18:37:12"
summary: "本文以西游记中的“真假美猴王”为例，一起温习一下装饰器模式的使用场景及具体实现过程。"
tags: ['coding']

---

> 本文以西游记中的“真假美猴王”为例，一起温习一下装饰器模式的使用场景及具体实现过程。   

真假美猴王的故事就不讲了，就算我标题党了吧。
我们的目的是要把一个猴子类包装成孙悟空和六耳猕猴，但是不能改变猴子类本身的结构。
简单描述一下装饰过程：
- 首先定义一个猴子接口类，猴子具有`introduce()`方法，用于让猴子嗞哩哇啦的说话介绍自己；
- 定义一个普通的猴子类，实现猴子接口类，重载`introduce()`方法，介绍一下自己，例如：“我是个会说话的猴子！”；
- 定义一个抽象类，实现猴子接口，作为抽象装饰器类，因为要装饰猴子，所以需要有一个接收猴子类的构造方法；
- 定义具体的装饰器类，继承抽象装饰器类，实现具体的装饰方法，这里我们需要定义两个具体的装饰器类，一个是孙悟空装饰器，一个是六耳猕猴装饰器，在各自的类里增加展示自己技能的描述方法，例如“我会七十二变”等；

过程大概就上面这么几步，接着咱们就开始coding！

1、首先是定义一个猴子接口，泛代表各种猴类。`IMonkey.java`
```java
public interface IMonkey{
    /**
     * 猴子自我介绍
    /*
    void introduce();
}
```

2、定义猴子实现类，表示一个普通的猴子。`Monkey.java`
```java
public class Monkey implements IMonkey{
    @Override
    public void introduce(){
        System.out.print("我是一个会说话的猴子！");
    }
}
```

3、定义抽象装饰器类。`AbstractMonkeyDecorator.java`
```java
public abstract class AbstractMonkeyDecorator implements IMonkey{
    protected IMonkey monkey;
    public AbstractMonkeyDecorator(IMonkey monkey){
        this.monkey = monkey;
    }

    @Override
    public void introduce(){
        monkey.introduce();
    }
}
```

4、定义具体的装饰类，用于将普通的猴子包装成孙悟空或六耳猕猴。
- 先来一个孙悟空的装饰类`SunWuKongDecorator.java`
```java
public class SunWuKongDecorator extends AbstractMonkeyDecorator{
    public SunWuKongDecorator(IMonkey monkey){
        super(monkey);
    }
    
    @Override
    public void introduce(){
        // 调用monkey自身的方法
        monkey.introduce();
        // 调用装饰方法
        decorate(monkey);
    }

    private void decorate(IMonkey monkey){
        System.out.print("我是美猴王，我会七十二变！");
        System.out.print("我师傅是大唐高僧！");
    }
}
```

- 再来一个六耳猕猴的装饰类`SixEarsMonkeyDecorator.java`
```java
public class SixEarsMonkeyDecorator extends AbstractMonkeyDecorator{
    public SixEarsMonkeyDecorator(IMonkey monkey){
        super(monkey);
    }
    
    @Override
    public void introduce(){
        // 调用monkey自身的方法
        monkey.introduce();
        // 调用装饰方法
        decorate(monkey);
    }

    // 具体的装饰方法实现逻辑
    private void decorate(IMonkey monkey){
        System.out.print("我才是美猴王，我会七十二变！");
        System.out.print("大唐高僧是我师傅！");
    }
}
```

5、测试程序
```java
public static void main(String[] args){
    // 首先看看一个普通的猴子的自我介绍
    System.out.print("使用装饰器前的猴子：");
    Monkey monkey = new Monkey();
    monkey.introduce();

    System.out.println();

    // 使用孙悟空装饰器装饰猴子
    System.out.print("使用孙悟空装饰器装饰后的猴子：");
    SunWuKongDecorator swkDecorator = new SunWuKongDecorator(new Monkey());
    swkDecorator.introduce();

    System.out.println();

    // 使用六耳猕猴装饰器装饰猴子
    System.out.print("使用六耳猕猴装饰器装饰后的猴子：");
    SixEarsMonkeyDecorator semDecorator = new SixEarsMonkeyDecorator(new Monkey());
    semDecorator.introduce();
}

```

6、输出结果
```java
使用装饰器前的猴子：我是一个会说话的猴子！
使用孙悟空装饰器装饰后的猴子：我是一个会说话的猴子！我是美猴王，我会七十二变！我师傅是大唐高僧！
使用六耳猕猴装饰器装饰后的猴子：我是一个会说话的猴子！我才是美猴王，我会七十二变！大唐高僧是我师傅！
```

总结：上面的例子中，我们并没有对Monkey类本身进行改造，而是采用装饰器包装的方式为Monkey增加了新的功能，这种方式可以动态的为实体类增加功能，比继承更灵活，且装饰类和被装饰类互不影响，可以各自扩展。