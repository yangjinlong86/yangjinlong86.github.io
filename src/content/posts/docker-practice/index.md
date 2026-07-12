---

slug: "/docker-practice"

description: "Docker的基本用法。"
title: Docker的基本用法
date: "2018-07-13 18:37:12"
summary: "Docker的基本用法。"
tags: ['coding']

---
## Docker的三个基本概念

- 镜像（Image）
- 容器（Container）
- 仓库（Repository）

## Docker 镜像
Docker镜像是一个特殊的文件系统，除了提供和容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

### 分层存储

镜像是一个虚拟的概念，由一组文件系统组成，或者说由多层文件系统联合组成。

分层存储的特征使得镜像的服用、定制变得更为容易。甚至可以用之前构建好的镜像作为基础层，然后进一步添加新的层，以定制自己所需的内容，构建新的镜像。

## Docker 容器

镜像和容器的关系，就像是面向对象中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的命名空间。容器内的进程是运行在一个隔离的环境里，使用起来就好像是在一个独立于宿主的系统下操作一样。这种特性使得容器封装的应用比直接在宿主运行更加安全。

容器也是使用分层存储，每一个容器运行时，是以镜像为基础层，在其上创建一个当前容器的存储层，我们可以称这个为容器运行时读写而准备的存储层为**容器存储层**。

任何保存于容器存储层的信息都会随容器删除而丢失。

按照Docker最佳实践的要求，容器不应该向其存储层内写入任何数据，容器存储层要保持无状态化。所有的文件写入操作，都应该使用数据卷（Volume）、或者绑定宿主目录，在这些位置的读写会跳过容器存储层，直接对宿主发生读写，其性能和稳定性更高。

数据卷的生存周期独立于容器，容器消亡，数据卷不会消亡，因此，使用数据卷后，容器删除或者重新运行之后，数据却不会丢失。


## Docker Registry
如果需要在其他的服务器上使用在基于当前宿主机上构建完成的镜像，我们就需要一个集中的存储、分发镜像的服务，Docker Registry就是这样的服务。

一个Docker Registry中可以包含多个仓库（Repository），每个仓库可以包含多个标签(Tag)，每个标签对应一个镜像。

通常一个仓库会包含一个软件不同版本的镜像，而标签就常用于对应该软件的各个版本。我们可以通过仓库名：标签的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以latest作为默认标签。

以Ubuntu镜像为例，Ubuntu是仓库的名字，仓库内包含有不同的版本标签，如`14.04`,`16.04`。我们可以通过`ubuntu:1404`来具体指定所需要的版本的镜像。如果忽略了标签，例如`ubuntu`,那就视为`ubuntu:latest`。

仓库名经常以两段式路径形式出现，比如jwilder/nginx-proxy，前者往往意味着Docker Registry多用户环境下的用户名，后者则是对应的软件名。但非绝对，取决于所使用的具体Docker Registry的软件或服务。

### Docker Registry 公开服务
开放为用户使用、允许用户管理镜像的Registry服务。一般这类公开服务允许用户免费上传、下载公开的镜像，并可能提供收费服务供用户管理私有镜像。

Registry Mirror， 使用加速器会直接从国内的地址下载Docker Hub的镜像。
国内的类似于Docker Hub的公开服务，时速云镜像仓库、网易云镜像服务、DaoCloud镜像市场、阿里云镜像库等。

### 私有Docker Registry

用户可以在本地搭建私有Docker Registry。可以使用官方提供的Docker Registry镜像作为私有Registry服务。

## 安装Docker

官方的安装指南 https://docs.docker.com/install/

### CentOS 安装Docker CE
https://docs.docker.com/install/linux/docker-ce/centos/

> 警告：切勿在没有配置Docker YUM源的情况下直接使用yum命令安装Docker。

准备工作

#### 系统要求

CentOS 7 内核版本不低于3.10， CentOS 7满足最低内核的要求，但由于内核版本比较低，部分功能无法使用，并且部分功能可能不太稳定。

#### 卸载旧版本

旧版本的Docker称谓docker或者docker-engine，使用以下命令卸载旧版本：
```
“$ sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine”
```

#### 使用yum安装

执行以下命令安装依赖包

```
“$ sudo yum install -y yum-utils \
           device-mapper-persistent-data \
           lvm2”
```

添加yum软件源

```
“$ sudo yum-config-manager \
    --add-repo \
    https://mirrors.ustc.edu.cn/docker-ce/linux/centos/docker-ce.repo”
```
#### 安装Docker CE

```shell
$ sudo yum makecache fast
$ sudo yum install docker-ce
```
#### 使用脚本自动安装

```shell
$ curl -fsSL get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh --mirror Aliyun
```
执行这个命令后，脚本就会自动的将一切准备工作做好，并且把Docker CE的Edge版本安装在系统中。

#### 启动Docker CE
```shell
$ sudo systemctl enable docker
$ sudo systemctl start docker
```

#### 建立docker 用户组

建立docker组
```
$ sudo groupadd docker
```

将当前用户加入docker组
```shell
$ sudo usermod -aG docker $USER
```

退出当前终端并重新登录

#### 测试Docker是否安装正确

```shell
$ docker run hello-world
```

使用国内镜像加速

使用systemd的系统，在/etc/docker/daemon.json中写入如下内容，不存在就新建该文件

```json
{
	"registry-mirrors": [
			"https://registry.docker-cn.com"
	]
}
```

之后重新启动服务

```shell
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```
