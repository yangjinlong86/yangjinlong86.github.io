---

slug: "/ssh-proxy"

description: "直接使用命令行ssh开启代理服务"
title: 开启ssh代理服务
date: "2018-08-09 03:03:05"
summary: "直接使用命令行ssh开启代理服务"
tags: ['coding']

---

使用命令行ssh开启代理服务

```shell
ssh -qTfnN -D 7070 xxx@xxx.com

# 使用安静模式
-q :- be very quite, we are acting only as a tunnel.
# 不要分配tty
-T :- Do not allocate a pseudo tty, we are only acting a tunnel.
# 后台运行
-f :- move the ssh process to background, as we don’t want to interact with this ssh session directly. 
# 不执行远程命令
-N :- Do not execute remote command. 
# 从定向输出到/dev/null
-n :- redirect standard input to /dev/null. 
```
