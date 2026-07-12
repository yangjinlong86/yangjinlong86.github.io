---

slug: "/java-binary-search"

description: "Java实现二分查找法。"
title: Java 二分查找法
date: "2018-04-18 17:06:19"
summary: "Java实现二分查找法。"
tags: ['coding','java']

---

> 二分查找法是一种常见的对数值列表的查找方法。使用二分查找法的前提条件是数组中的元素必须已经排好序。二分查找法首先将关键字与数组的中间元素进行比较。考虑一下三种情况：

- 如果关键字小于中间元素，只需要在数组的前一半元素中继续查找关键字。
- 如果关键字和中间元素相等，则匹配成功，查找结束。
- 如果关键字大于中间元素，只需要在数组的后一半元素中继续查找关键字。

```java
package org.nocoder.solution;

/**
 * @author jason
 * @date 18/4/19.
 */
public class BinarySearch {
    public static int binarySearch(int [] list, int key){
        int low = 0;
        int high = list.length - 1;

        while(high >= low){
            int mid = (low + high) / 2;
            if(key < list[mid]){
                high = mid - 1;
            }else if(key == list[mid]){
                return mid;
            }else{
                low = mid + 1;
            }
        }
	    // 如果关键字不在该序列中，返回-low-1，
		// 表明不在序列中，并且返回关键字应该插入的位置
        return -low-1;
    }

    public static void main(String[] args) {
        System.out.print(binarySearch(new int []{1,2,3,4,5}, 5));
    }
}

```

再附上一道【剑指offer】的编程练习题及题解

> 题目描述：二维数组中的查找
 对于一个有序数组，我们通常采用二分查找的方式来定位某一元素，请编写二分查找的算法，在数组中查找指定元素。
 给定一个整数数组A及它的大小n，同时给定要查找的元素val，请返回它在数组中的位置(从0开始)，若不存在该元素，返回-1。
 若该元素出现多次，请返回第一次出现的位置。

```java
package org.nocoder.solution;

/**
 * 题目描述
 * 对于一个有序数组，我们通常采用二分查找的方式来定位某一元素，请编写二分查找的算法，在数组中查找指定元素。
 * 给定一个整数数组A及它的大小n，同时给定要查找的元素val，请返回它在数组中的位置(从0开始)，若不存在该元素，返回-1。
 * 若该元素出现多次，请返回第一次出现的位置。
 * 测试样例：
 * [1,3,5,7,9],5,3
 * [4,4,10,21],4,4
 * 返回：1
 *
 * @author jason
 * @date 18/4/1.
 */
public class BinarySearch {
    public int getPos(int[] A, int n, int val) {
        // low:起始位置下标
        int low = 0;
        // high:结束位置下标
        int high = n - 1;

        while (high > low) {
            // mid:中间位置下标
            int mid = (low + high) / 2;
            if (val < A[mid]) {
                // 如果目标值在左侧，结束位置下标修改为mid-1
                high = mid - 1;
            } else if (val == A[mid]) {
                // 如果目标值等于中间位置下标对应的值，将结束位置下标设置为中间位置下标，继续向左查找
                high = mid;
            } else {
                // 如果目标值在右侧，起始查找的位置下标修改为mid+1
                low = mid + 1;
            }
        }
        return A[low] == val ? low : -1;
    }

    public static void main(String[] args) {
        int[] array = {10, 10, 10, 10, 10, 10, 10, 10};
        BinarySearch bs = new BinarySearch();
        System.out.println(bs.getPos(array, 8, 10));
    }
}

```