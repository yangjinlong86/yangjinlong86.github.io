---

slug: "/jenkins-ci"

description: "Jenkins持续集成"
title: Jenkins持续集成
date: "2018-04-03 21:16:08"
summary: "Jenkins持续集成"
tags: ['coding']

---

**使用jenkins进行持续集成**
https://www.liaoxuefeng.com/article/001463233913442cdb2d1bd1b1b42e3b0b29eb1ba736c5e000

**使用jenkins实现java web项目自动部署**
https://segmentfault.com/a/1190000007467399

**持续集成是什么**
http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html

**Jenkins Debian packages**

This is the Debian package repository of Jenkins to automate installation and upgrade. To use this repository, first add the key to your system:

```
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
```

Then add the following entry in your /etc/apt/sources.list:

```
deb https://pkg.jenkins.io/debian-stable binary/
```

Update your local package index, then finally install Jenkins:
```
sudo apt-get update
sudo apt-get install jenkins
See Wiki for more information, including notes regarding upgrade from Hudson.
```

在ubuntu上安装遇到了以下错误
```
jason@nocoder:/usr/local/java$ sudo apt-get install jenkins
Reading package lists... Done
Building dependency tree
Reading state information... Done
Some packages could not be installed. This may mean that you have
requested an impossible situation or if you are using the unstable
distribution that some required packages have not yet been created
or been moved out of Incoming.
The following information may help to resolve the situation:

The following packages have unmet dependencies:
jenkins : Depends: default-jre-headless (>= 2:1.8) but 2:1.7-51 is to be installed or
                    java8-runtime-headless but it is not installable
```


To search for a particular package by name or summary:

From the command-line, use:
```
apt-cache search keyword
```

Launchpad PPA Repositories是很有用的非ubuntu官方的第三方个人资源库，可以很方便地安装第三方软件。

但是在运行add-apt-repository命令时，有时会提示命令不存在，这个时候直接apt-get add-apt-repository是不可以的！
解决的方法是安装software-properties-common。输入命令：
apt-get install software-properties-common

**启动Jenkins报错**
```
* Starting Jenkins Automation Server jenkins    [fail]
invoke-rc.d: initscript jenkins, action "start" failed.
dpkg: error processing package jenkins (--configure):
subprocess installed post-installation script returned error exit status 7
Processing triggers for ureadahead (0.100.0-16) ...
Errors were encountered while processing:
jenkins
E: Sub-process /usr/bin/dpkg returned an error code (1)
```
还是default-jdk版本的问题，默认的还是jdk7

**解决办法**
```
sudo add-apt-repository ppa:webupd8team/java
sudo apt update
sudo apt install oracle-java8-installer
```

**启动jenkins**
```
sudo service jenkins start
```
默认是8080端口
localhost:8080访问
系统管理--全局工具配置 设置git和maven