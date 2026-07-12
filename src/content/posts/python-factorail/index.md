---

slug: "/python-factorail"

description: "本文 Python 两个经典递归：阶乘和幂"
title: Python 两个经典递归：阶乘和幂
date: "2017-04-09 04:49:33"
summary: "本文 Python 两个经典递归：阶乘和幂"
tags: ['coding']

---

**递归**简单说来就是调用自身的意思。

来看一个幽默的定义：

> **recursion** *\ri-'k&r-zh&n\\* n : see recursion
（递归[名词]：见递归）

## 一、计算n的阶乘

> `n`的阶乘定义为 `n \* (n-1) \* (n-2) \* ... \* 1`。

**使用循环实现**

```python
def factorial(n):
  result = n
  for i in range(1, n):
    result *= i #依次与1至n-1的数相乘
  return result
```

> 首先，把数字`n`赋值给`result`，然后`result`依次与`1`～`n-1`的数相乘，最后返回结果。

阶乘的数学定义：
- 1的阶乘是1；
- 大于1的数n的阶乘是n乘n-1的阶乘。

**使用递归实现**

```python
def factorial(n):
  if n == 1:
    return 1
  else:
    return n * factorial(n-1)
```
## 二、计算幂

python的内建函数 `pow(x, n)` 或者 `**` 运算符可以实现幂的计算。`pow(x, n)` 是 `x` 自乘 `n-1`次，例如`pow(2, 3)`是`2`乘以自身两次：`2 * 2 * 2 = 8`。

**使用循环实现**

```python
def power(x, n):
  result = 1
  for i in range(n):
    result *= x
  return result
```

**使用递归实现**

- 对于任意数字`x`来说，`power(x, 0)`是`1`；
- 对于任何大于`0`的数来说，`power(x, n)`是`x`乘以`(x, n-1)`的结果。

```python
def power(x, n):
  if n == 0:
    return 1
  else:
    return x * power(x, n-1)
```