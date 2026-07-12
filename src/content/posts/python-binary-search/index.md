---

slug: "/python-binary-search"

description: "Python 另一个经典递归：二分法查找。"
title: Python 另一个经典递归：二分法查找
date: "2017-04-07 05:42:47"
summary: "Python 另一个经典递归：二分法查找。"
tags: ['coding']

---

先来玩个数字游戏，我从1～100中选一个整数，你来猜中这个数字。

如果你运气好的话可能十几次就猜中了，也可能是耐心的提问了我100次后。

但其实你只需要提问7次就可以找到答案。

举个例子，假设我选的数字是`86`。
- 问：这个数是否大于50？
答：是
- 问：大于75？
答：是
- 问：大于88？
答：否
- 问：大于82？
答：是
- 问：大于86？
答：否
- 问：大于84？
答：是
- 问：大于85？
答：是

最终答案锁定，大于85并且不大于86，即`86`。

> 连续将满足条件的值等分，直到找到正确答案，这就是二分法。
> 这个算法的本身就是递归的定义，也可以用递归来实现

- 如果上下限相同，那么就是数字所在的位置，返回；
- 否则找到两者的中间点，也就是上下限的平均值，查找数字在中间点的左侧还是右侧，然后继续查找数字所在的那半部分

下面实现一个二分法查找，返回查找目标数字所在序列的位置，下标。

```python
#!/usr/bin/python
'''
二分法查找
sequence 查找的序列，范围
number   查找目标
lower    下限
upper    上限    
'''
def search(sequence, number, lower, upper):
	if lower == upper:
		assert number == sequence[upper]
		return upper
	else:
		middle = (lower + upper) // 2 #找到两者的中间点
		if number > sequence[middle]: 
			#如果在中间点的右侧，就在middle+1 ～ upper的范围内继续找
			return search(sequence, number, middle+1, upper)
		else:
			#如果在中间点的左侧，就在lower～middle的范围继续找
			return search(sequence, number, lower, middle)			
#初始化一个1～100的列表
seq = []
for x in xrange(1,101):
	seq.append(x)
print search(seq, 86, 0, 100)
```