---
slug: "/arts-01"
title: ARTS 第1周：Two Sum、数据库优化、框架技巧与架构思考
date: 2018-07-07
description: "本周ARTS包含LeetCode算法题Two Sum的解析、MySQL查询优化的深入理解、SpringBoot与MyBatis常见问题解决技巧，以及Java设计模式和架构师成长分享。"
summary: "本周ARTS包含LeetCode算法题Two Sum的解析、MySQL查询优化的深入理解、SpringBoot与MyBatis常见问题解决技巧，以及Java设计模式和架构师成长分享。"
tags: ['coding','arts']

---

## Algorithm

### Two Sum Sulution

[Two Sum](https://leetcode.com/problems/two-sum/description/)

```java
package org.nocoder.leetcode.solution;

/**
 * 1.Two Sum 
 * 给定一个整数数组，返回两个数的索引，使它们的和等于指定目标值。
 * 假设每个输入只会有一个解决方案，且不能重复使用同一个元素。
 * 
 * Example:
 * Given nums = [2, 7, 11, 15], target = 9,
 * Because nums[0] + nums[1] = 2 + 7 = 9,
 * return [0, 1].
 *
 * @author jason
 * @date 18/7/6.
 */
public class TwoSumSolution {

    /**
     * 暴力解法：
     * 两层循环，枚举所有可能的两个数的组合，判断其和是否等于目标值。
     * 时间复杂度：O(n^2)
     * 空间复杂度：O(1)
     * @param nums 输入的整数数组
     * @param target 目标和
     * @return 满足条件的两个数的索引
     */
    public static int[] twoSum1(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                // 判断 nums[i] + nums[j] 是否等于目标值
                if ((nums[i] + nums[j]) == target) {
                    // 找到后直接返回两个索引
                    return new int[]{i, j};
                }
            }
        }
        // 如果没有找到，抛出异常
        throw new IllegalArgumentException("No solution!");
    }
    
    /**
     * 哈希表优化解法：
     * 用一个 Map 存储已遍历过的数字及其索引，查找当前数字所需的补数是否已存在。
     * 时间复杂度：O(n)
     * 空间复杂度：O(n)
     * @param nums 输入的整数数组
     * @param target 目标和
     * @return 满足条件的两个数的索引
     */
    public static int[] twoSum2(int[] nums, int target){
        Map<Integer, Integer> resultMap = new HashMap<>(); // key: 数值, value: 索引
        for (int i = 0; i < nums.length; i++) {
            int result = target - nums[i]; // 计算当前数字所需的补数
            if(resultMap.containsKey(result)){
                // 如果补数已存在，返回补数索引和当前索引
                return new int[]{resultMap.get(result), i};
            }
            // 将当前数字和索引存入 map
            resultMap.put(nums[i], i);
        }
        // 如果没有找到，抛出异常
        throw new IllegalArgumentException("No solution!");
    }
}


```

## Review

### Understanding MySQL Queries with Explain

> https://www.exoscale.com/syslog/explaining-mysql-queries/

`explain` columns:

- id (query id)
- select_type (type of statement)
- table (table referenced)
- type (join type)
- possible_keys (which keys could have been used)
- key (key that was used)
- key_len (length of used key)
- ref (columns compared to index)
- rows (amount of rows searched)
- Extra (additional information)

The main points for long-term performance summarized:

- create a sustainable data model that suits your company’s needs
- choose the right form of database
- use a software architecture that matches your product
- go through regular iterations of looking at the structure of your queries and use `explain` on the more convoluted ones, optimize usage for your chosen database(s), also with regard to database updates and how they could affect you
- choose the instances that best suit your application and database needs in accordance with performance and bandwidth

## Tip

- `Springboot`多模块项目，扫描不到另一个module的service，无法使用`@Autowired`注入。
  - 原因分析：SpringBoot默认在Application启动类的同级package开始往下扫描，另一个module的service包名在启动类包的上一级，所以扫描不到。
  - 解决办法：在springboot启动类上增加`@ComponentScan(basePackages = { "com.a.b.c" })`指定扫描的package，或者调整SpringBootApplication启动类的位置。

- `Mybatis`org.apache.ibatis.binding.BindingException: Invalid bound statement (not found)
  - 原因分析：在idea下，maven默认到`src/main/resources`目录下拷贝xml文件，而我把mapper.xml放在了`src/main/java`的package下，编译后target下找不到mapper.xml文件，故抛出该异常
  - 解决方法：在pom.xml文件的build标签下增加resources。

```xml
<resources>
    <resource>
        <directory>src/main/java</directory>
        <includes>
            <include>**/*.xml</include>
        </includes>
    </resource>
</resources>
```

## Share

### Adapter Design Pattern in Java

[Adapter Design Pattern in Java](https://www.journaldev.com/1487/adapter-design-pattern-java)

### 架构师的自我修养

[架构师的自我修养](https://mp.weixin.qq.com/s/KLDUdbo2RpXIDE4k6jR1iw)