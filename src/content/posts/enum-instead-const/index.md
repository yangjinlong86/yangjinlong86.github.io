---

slug: "/enum-instead-const"

description: "使用枚举替换常量类。"
title: 使用枚举替换常量类
date: "2017-07-14 13:00:36"
summary: "使用枚举替换常量类。"
tags: ['coding']

---

> 项目中必然会用到常量，我接触过的一些老旧项目，基本都是用常量类或接口类来定义常量。Java1.5以后，JDK中引入了枚举类，清晰又简单。

先说说为啥要替换吧。
首先，枚举常量更简单
第二，枚举有内置方法
第三，枚举可以自定义方法

看看代码，感受一下。
```java
Class Season{
	public final static int Spring = 0;
	public final static int Summer = 1;
	public final static int Autumn = 2;
	public final static int Winter = 3;
	
	public static int getComfortableSeason(){
		public static int getComfortableSeason(){
			return Spring;
		}
	}
}
```

下面这个是用枚举来定义常量：
```java
enum Season{
	Spring, Summer, Autumn, Winter;
	
	public static Season getComfortableSeason() {
		return Spring;
	}
}
```

>`Java语言规范`提倡枚举项全部大写，字母之间用下划线分隔。

```java
package org.nocoder.enumeration;

/**
 * 文档状态
 * Created by jason on 2017/7/14.
 */
public enum ArchiveStatus {
    ALL(0), DRAFT(1), PUBLISHED(2);

    private int value;

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    ArchiveStatus(int value){
        this.value = value;
    }
}
```
