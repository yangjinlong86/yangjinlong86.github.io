---

slug: "/windows-exe-to-service"

description: "Windows下把exe程序注册成服务"
title: Windows下把exe程序注册成服务
date: "2017-12-08 06:51:49"
summary: "Windows下把exe程序注册成服务"
tags: ['coding']

---

1、下载`instsrv.exe`和`srvany.exe`这两个文件，放在`C:\WINDOWS\SysWOW64`目录下

2、管理员权限运行命令提示符，进入`C:\WINDOWS\SysWOW64`目录

```bash
# 使用instsrv.exe将srvany.exe注册成服务,中间的srvany是服务名，完成后使用services.msc可以在服务列表里看到
instsrv.exe srvany srvany.exe
```

3、命令提示符`regedit`，打开注册表编辑器，找到刚刚注册的服务目录

```bash
计算机\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\srvany
```

在目录下新建一个项`Parameters`，在`Parameters`下新建一个`字符串值`，数值名称为`Application`，数值数据为可执行文件的路径，例如`D:\\local\\IntelliJIDEA_LicenseServer.exe`

4、命令提示符`services.msc`，找到`srvany`服务启动即可

Game Over！
