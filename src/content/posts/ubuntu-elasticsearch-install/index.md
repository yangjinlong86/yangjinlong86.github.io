---

slug: "/ubuntu-elasticsearch-install"

description: "ubuntu 安装 ElasticSearch 过程中的问题记录"
title: ubuntu 安装 ElasticSearch 过程中的问题记录
date: "2018-06-07 04:38:46"
summary: "ubuntu 安装 ElasticSearch 过程中的问题记录"
tags: ['coding']

---

**开放端口**

```shell
sudo iptables -I INPUT -p tcp -m tcp --dport 9200 -j ACCEPT 
```

**开启远程访问**

`elasticsearch.yml`

```shell
#Set the bind address to a specific IP (IPv4 or IPv6):
network.host: 0.0.0.0
# Set a custom port for HTTP:
http.port: 9200
```

**ERROR: bootstrap checks failed**

> max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]

`sudo vim /etc/sysctl.conf`

添加 vm.max_map_count=262144

`sudo sysctl -p`
