---

slug: "/open-mysql-binlog-for-mac"

description: "Mac 下 MySQL 开启 binlog"
title: Mac 下 MySQL 开启 binlog
date: "2018-07-23 17:51:00"
summary: "Mac 下 MySQL 开启 binlog"
tags: ['coding']

---

MySQL for Mac 默认 binlog 是关闭的，使用以下命令查看 binlog 是否开启：

```sql
SHOW VARIABLES LIKE 'log_bin';
```

|Variable_name|Value|
|----|----|
|log_bin|OFF|

修改/etc/my.conf，没有`my.conf`文件就新建一个，添加以下配置：

```shell
[mysqld]
log-bin=mysql-bin #添加这一行就ok
binlog-format=ROW #选择row模式
server_id=1 #配置mysql replaction需要定义，不能和canal的slaveId重复
```

重启MySQL`系统偏好设置->MySQL->Stop MySQL Server -> Start MySQL Server`，再次查看 bin log 状态：

```sql
SHOW VARIABLES LIKE 'log_bin';
```

|Variable_name|Value|
|----|----|
|log_bin|ON|
