---

slug: "/java-http-url-connection-post"

description: " JAVA HttpURLConnection Post方式提交传递参数"
title: JAVA HttpURLConnection Post方式提交传递参数
date: "2018-05-08 16:46:13"
summary: " JAVA HttpURLConnection Post方式提交传递参数"
tags: ['coding','java']

---

```java
public class HttpURLConnectionPost {  
  
	/**  
	* @param args  
	* @throws IOException  
	*/  
	public static void main(String[] args) throws IOException {  
		readContentFromPost();  
	}  
	public static void readContentFromPost() throws IOException {  
		// Post请求的url，与get不同的是不需要带参数  
		URL postUrl = new URL("http://www.xxxxxxx.com");  
		// 打开连接  
		HttpURLConnection connection = (HttpURLConnection) postUrl.openConnection();       
		// 设置是否向connection输出，因为这个是post请求，参数要放在http正文内，因此需要设为true  
		connection.setDoOutput(true);  
		connection.setDoInput(true);  
		// 默认是 GET方式  
		connection.setRequestMethod("POST");        
		// Post 请求不能使用缓存  
		connection.setUseCaches(false);    
		//设置本次连接是否自动重定向   
		connection.setInstanceFollowRedirects(true);        
		// 配置本次连接的Content-type，配置为application/x-www-form-urlencoded的  
		// 意思是正文是urlencoded编码过的form参数  
		connection.setRequestProperty("Content-Type","application/x-www-form-urlencoded");  
		// 连接，从postUrl.openConnection()至此的配置必须要在connect之前完成，  
		// 要注意的是connection.getOutputStream会隐含的进行connect。  
		connection.connect();  
		DataOutputStream out = new DataOutputStream(connection.getOutputStream());  
		// 正文，正文内容其实跟get的URL中 '? '后的参数字符串一致  
		String content = "字段名=" + URLEncoder.encode("字符串值", "编码");  
		// DataOutputStream.writeBytes将字符串中的16位的unicode字符以8位的字符形式写到流里面  
		out.writeBytes(content);  
		out.flush();  
		out.close();  
		BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));  
		String line;  
		while ((line = reader.readLine()) != null){  
			System.out.println(line);  
		}  
		reader.close();  
		//断开连接 
		connection.disconnect();  
	}  
  
}
```