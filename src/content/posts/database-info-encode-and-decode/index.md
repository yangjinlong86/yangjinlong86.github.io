---

slug: "/database-info-encode-and-decode"

description: "一些项目会要求不能出现明文密码，简单三步，实现配置文件里的用户名和密码加密。"
title: Spring 数据库密码加密
date: "2017-07-18 12:03:42"
summary: "一些项目会要求不能出现明文密码，简单三步，实现配置文件里的用户名和密码加密。"
tags: ['coding','java']

---

> 我们一般都会把数据库的连接信息写在properties配置文件里，只要打开了配置文件，就能直接看到数据库的用户名密码等信息，一些项目会要求不能出现明文密码，接下来，简单三步，实现配置文件里的用户名和密码加密。

### 一、加密解密工具类

我以Base64为例，写个简单的加密和解密工具

```java
package org.nocoder.utils;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;

/**
 * EncryptUtil
 * Created by jason on 2017/7/18.
 */
public class EncryptUtil {

    /**
     * 加密
     * @param value
     * @return encode string value
     */
    public static String encode(String value){
        if(StringUtils.isNotBlank(value)){
            Base64 base64 = new Base64();
            return new String(base64.encode(value.getBytes()));
        }
        return null;
    }

    /**
     * 解密
     * @param value
     * @return decode string value
     */
    public static String decode(String value){
        if(StringUtils.isNotBlank(value)){
            Base64 base64 = new Base64();
            return new String(base64.decode(value.getBytes()));
        }
        return null;
    }

    public static void main(String[] args) {
        System.out.println(EncryptUtil.encode("test"));
        System.out.println(EncryptUtil.decode("dGVzdA=="));
    }
}

```
### 二、通过继承spring配置类并重写处理方法实现解密

```java
package org.nocoder.security;

import org.apache.commons.lang3.StringUtils;
import org.nocoder.utils.EncryptUtil;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;

import java.util.Properties;

/**
 * 通过继承spring配置类并重写处理方法实现密文解密
 * Created by jason on 2017/7/18.
 */
public class EncryptPropertyPlaceholderConfigurer extends PropertyPlaceholderConfigurer{
    @Override
    protected void processProperties(ConfigurableListableBeanFactory beanFactory, Properties props) throws BeansException {
        try {
            String username = props.getProperty("username");
            if(StringUtils.isNotBlank(username)){
                props.setProperty("username", EncryptUtil.decode(username));
            }

            String password = props.getProperty("password");
            if(StringUtils.isNotBlank(password)){
                props.setProperty("password",EncryptUtil.decode(password));
            }
            super.processProperties(beanFactory, props);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BeanInitializationException(e.getMessage());
        }
    }
}

```
### 三、修改配置文件

1、使用加密工具类对用户名和密码进行加密，修改properties配置文件`config.properties`
```java
driver=org.postgresql.Driver
url=jdbc:postgresql://127.0.0.1:5432/freda_db
username=加密后的用户名
password=加密后的密码
#定义初始连接数
initialSize=0
#定义最大连接数
maxActive=50
#定义最大空闲
maxIdle=50
#定义最小空闲
minIdle=1
#定义最长等待时间
maxWait=60000
```

2、修改`applicationContext.xml`，引入配置文件
```java
<!-- 引入配置文件，这里的class就是之前写的那个Spring配置类的路径 -->
<bean id="encryptPropertyConfigurer" class="org.nocoder.security.EncryptPropertyPlaceholderConfigurer">
    <property name="locations">
        <list>
            <value>classpath:config.properties</value>
        </list>
    </property>
</bean>
```

OK了，就这三步，重启服务试试看！