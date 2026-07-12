---

slug: "/free-ssl-certs"

description: "通过 Let's Encrypt 提供的 Certbot 免费申请并自动安装SSL证书。"
title: 申请免费HTTPS证书
date: 2023-06-07
summary: "通过 Let's Encrypt 提供的 Certbot 免费申请并自动安装SSL证书。"
tags: ['coding']
---

Let's Encrypt是一个非营利性组织，旨在使HTTPS成为互联网的标准，他们提供免费HTTPS证书，以便更多的网站可以使用HTTPS加密保护用户的隐私和安全。

我们可以通过Certbot申请免费HTTPS证书，步骤如下：

1. 安装Certbot：Certbot是Let's Encrypt的官方客户端，可自动化证书颁发和安装过程
2. 运行Certbot：运行Certbot以启动证书颁发和安装过程。
3. 等待证书颁发：Certbot将与Let's Encrypt服务器通信以颁发证书，需要几秒钟或几分钟。
4. 安装证书：Certbot将自动安装证书并配置您的Web服务器以使用HTTPS。

注意，需要在每90天内更新证书。Certbot可以自动化此过程，因此无需手动更新证书。

以下是具体命令，以`Ubuntu`、`Nginx`为例：

1. 安装Certbot
```
sudo apt install certbot
```

2. 安装Certbot Nginx插件，
```
sudo apt install python3-certbot-nginx
```

> 如果用Apache，就安装Apache插件 `sudo apt install python3-certbot-apache


3. 使用certbot nginx 插件为域名申请证书
```
sudo certbot --nginx -d nocoder.org -d www.nocoder.org
```

```shell
$ sudo certbot --nginx -d nocoder.org -d www.nocoder.org
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx
Enter email address (used for urgent renewal and security notices)
 (Enter 'c' to cancel): yangjinlong86@gmail.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.3-September-21-2022.pdf. You must
agree in order to register with the ACME server. Do you agree?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: Y

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Would you be willing, once your first certificate is successfully issued, to
share your email address with the Electronic Frontier Foundation, a founding
partner of the Let's Encrypt project and the non-profit organization that
develops Certbot? We'd like to send you email about our work encrypting the web,
EFF news, campaigns, and ways to support digital freedom.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: Y
Account registered.
Requesting a certificate for nocoder.org and www.nocoder.org
Performing the following challenges:
http-01 challenge for nocoder.org
http-01 challenge for www.nocoder.org
Waiting for verification...
Cleaning up challenges
Deploying Certificate to VirtualHost /etc/nginx/conf.d/nocoder.org.conf
Deploying Certificate to VirtualHost /etc/nginx/conf.d/nocoder.org.conf
Redirecting all traffic on port 80 to ssl in /etc/nginx/conf.d/nocoder.org.conf
Redirecting all traffic on port 80 to ssl in /etc/nginx/conf.d/nocoder.org.conf

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://nocoder.org and
https://www.nocoder.org
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Subscribe to the EFF mailing list (email: yangjinlong86@gmail.com).

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/nocoder.org/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/nocoder.org/privkey.pem
   Your certificate will expire on 2023-09-05. To obtain a new or
   tweaked version of this certificate in the future, simply run
   certbot again with the "certonly" option. To non-interactively
   renew *all* of your certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
   
```

证书有效期为90天，证书到期后执行`certbot renew`续期即可，Certbot会自动更新证书，不需要手动替换文件。

> 当然，没有到期就执行续期命令，会提示没到期不需要续期，不会生成新的证书。

```
$ sudo certbot renew
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/nocoder.org.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Cert not yet due for renewal

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
The following certificates are not due for renewal yet:
  /etc/letsencrypt/live/nocoder.org/fullchain.pem expires on 2023-09-05 (skipped)
No renewals were attempted.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

使用`curl -v`测试一下，网站访问正常。

```shell
$ curl -v  https://nocoder.org
*   Trying 13.215.120.28:443...
* Connected to nocoder.org (13.215.120.28) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*  CAfile: /etc/ssl/certs/ca-certificates.crt
*  CApath: /etc/ssl/certs
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: CN=nocoder.org
*  start date: Jun  7 01:09:21 2023 GMT
*  expire date: Sep  5 01:09:20 2023 GMT
*  subjectAltName: host "nocoder.org" matched cert's "nocoder.org"
*  issuer: C=US; O=Let's Encrypt; CN=R3
*  SSL certificate verify ok.
> GET / HTTP/1.1
> Host: nocoder.org
> User-Agent: curl/7.74.0
> Accept: */*
> 
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* old SSL session ID is stale, removing
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Server: nginx/1.18.0
< Date: Wed, 07 Jun 2023 02:48:26 GMT
< Content-Type: text/html
< Content-Length: 76044
< Last-Modified: Wed, 07 Jun 2023 01:45:08 GMT
< Connection: keep-alive
< ETag: "647fe124-1290c"
< Accept-Ranges: bytes
```

最后，建议把letsencrypt生成的文件目录`/etc/letsencrypt`和Nginx的配置文件都整体备份一下，如果发生服务器迁移，就把整个文件打包迁移就可以继续工作。
```
/etc/letsencrypt# ls
accounts  cli.ini  keys  options-ssl-nginx.conf  renewal-hooks
archive   csr      live  renewal                 ssl-dhparams.pem
```