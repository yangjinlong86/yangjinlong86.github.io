---
slug: "/arts-43"
description: "本周ARTS包含LeetCode正则表达式匹配算法解析。"
title: ARTS 第43周：正则表达式匹配算法
date: 2019-10-03
summary: "本周ARTS包含LeetCode正则表达式匹配算法解析。"
tags: ['coding','arts']

---

## Algorithm

### 10.正则表达式匹配

```java
package org.nocoder.leetcode.solution;

/**
 * 10. 正则表达式匹配
 * https://leetcode-cn.com/problems/regular-expression-matching/
 */
public class RegularExpressionMatching {
    public static boolean isMatch(String text, String pattern) {
        if (pattern.isEmpty()) {
            return text.isEmpty();
        }
        boolean first_match = (!text.isEmpty() && (pattern.charAt(0) == text.charAt(0) || pattern.charAt(0) == '.'));

        if (pattern.length() >= 2 && pattern.charAt(1) == '*') {
            return (isMatch(text, pattern.substring(2)) || (first_match && isMatch(text.substring(1), pattern)));
        } else {
            return first_match && isMatch(text.substring(1), pattern.substring(1));
        }
    }

    public static void main(String[] args) {
        System.out.println(isMatch("aa", "a*"));
    }
}
```