---

slug: "/apache-commons-codec"

description: "Apache Commons Codec 加密解密，Java代码示例。"
title: Apache Commons Codec 加密解密
date: "2017-07-18 11:52:08"
summary: "Apache Commons Codec 加密解密，Java代码示例。"
tags: ['coding']

---
Apache Commons Codec 提供了常见的编码器和解码器，如Base64，Hex等。

以下是使用Base64进行加密和解密示例代码：
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
Apache Commons Codec 官方网址：http://commons.apache.org/proper/commons-codec/