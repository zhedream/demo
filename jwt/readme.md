# jwt

1. 生成私钥

<!--
ssh-keygen -t rsa -b 1024 -f private.key  //  可能会是新的格式  BEGIN OPENSSH PRIVATE KEY
-->

ssh-keygen -m PEM -t rsa -b 1024 -f private.key // -m 指定格式 BEGIN RSA PRIVATE KEY , jsonwebtoken 需要这个格式的

2. 生成公钥

openssl rsa -in private.key -pubout -outform PEM -out public.key

# 参考

1. openssl 和 ssh-keygen 的区别
   https://www.cnblogs.com/pixy/p/4722381.html


2. 在线 RSA 加密/解密工具
   http://tools.jb51.net/password/rsa_encode
