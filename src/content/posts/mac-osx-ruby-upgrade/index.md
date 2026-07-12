---

slug: "/mac-osx-ruby-upgrade"

description: "Mac下升级ruby"
title: Mac 下 ruby 升级
date: "2017-11-26 16:23:48"
summary: "Mac下升级ruby"
tags: ['coding']

---

> 当时我要安装android-platform-tools `brew install android-platform-tools`，然后这玩意就开始更新，看来我确实很久没用homebrew装软件了。

```java
Updating Homebrew...
==> Downloading https://homebrew.bintray.com/bottles-portable/portable-ruby-2.3.3.leopard_64.bottle.1.tar.gz
```

然后蹦出来个这
```java
/usr/local/Homebrew/Library/Homebrew/brew.rb:12:in `<main>': Homebrew must be run under Ruby 2.3! You're running 2.0.0. (RuntimeError)
```
用rvm来管理ruby版本，所以先把rvm安装一下，简单3步
(1)`curl -L get.rvm.io | bash -s stable`
(2)`source ~/.profile`
(3)`source ~/.bash`

折腾完看看版本号
`rvm -v`
```
rvm 1.29.3 (latest) by Michal Papis, Piotr Kuczynski, Wayne E. Seguin [https://rvm.io]
```
装完rvm，就可以更新ruby了

可以用`rvm list known`查看一下已发布的版本，我这里安装2.3.4版本

`rvm install 2.3.4`

`ruby -v`
```
ruby 2.3.4p301 (2017-03-30 revision 58214) [x86_64-darwin15]
```

更新完ruby，再来试试homebrew～
```java
brew cask install android-platform-tools
adb devices
List of devices attached
1164111025	unauthorized
```

> 其实我一开始就为了装个黑域，从安装adb到更新homebrew、再到更新ruby，我在瞎折腾的路上无法自拔。。。

Game Over！