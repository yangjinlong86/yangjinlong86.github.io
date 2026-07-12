---

slug: "/wind-term-hanging-problem"
description: "WindTerm 2.5.0 输入用户名后假死卡住的解决办法"
title: WindTerm 2.5.0 输入用户名后假死卡住的解决办法
date: "2023-07-07 15:51:00"
summary: "WindTerm 2.5.0 输入用户名后假死卡住的解决办法"
tags: ['coding']

---
## 问题描述

WindTerm2.5.0，使用`SSH`用户名和密码方式登录Linux服务器。新建会话，输入IP和端口后，到输入用户名界面，输入用户名后，提示”身份验证被拒绝，请重试“，然后软件假死卡住，30秒到1分钟后又弹出身份验证失败请重试，输入密码后又跳转到登录界面，继续输入用户名，又会假死。。。

![1.jpg](./1.jpg)

![2.jpg](./2.jpg)

![3.jpg](./3.jpg)

## 解决办法

在会话的IP上右键->属性->验证，取消`勾选尝试公钥认`、`尝试键盘交互认`、`尝试gssapi-with-mic身份验证`，保存。
*（图片缺失：034b80c250eae9f2bf9b4f14c74df9cf.png）*

然后重新登录就可以了。。。

`WindTerm`开源免费又好用，有点儿小BUG能接受，希望后续版本能解决。

Game Over