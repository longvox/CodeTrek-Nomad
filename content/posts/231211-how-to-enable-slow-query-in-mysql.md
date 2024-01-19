---
title: "Cách để enable slow query log trong Mysql"
draft: false
date: 2023-12-11
description: "Mở bát cho cái blog `a-ma-tơ` của mình thì mình lại chọn bừa chủ đề viết. Mà lúc này mình đang làm với thằng SQL xong mình nghĩ thôi thì mình chọn cái liên quan tới cái log trong SQL...."
slug: "how-to-enable-slow-query-in-mysql"
categories:
  - SQL
tags:
  - SQL
  - Log
---

{{< sidenote >}}
Tại mình theo trường phái sử dụng log nhiều ít khi sử dụng công cụ debug, mình xem log từ console-log đến file log và mình thích xem log để điều tra vấn đề hơn nên mình mới nhảy số chủ đề này
{{< /sidenote >}}

Mở bát cho cái blog `a-ma-tơ` của mình thì mình lại chọn bừa chủ đề viết. Mà lúc này mình đang làm với thằng SQL xong mình nghĩ thôi thì mình chọn cái liên quan tới cái log trong SQL. Mà trong vô vàn cái log thì log câu query chậm có vẻ nhiều người quan tâm để có thể biết được câu query nào thối để có thể biết và tối ưu đựợc sớm nhất hoặc cốt là nắm được vấn đề đang bị chậm chỗ nào. Mà hệ thống hiện tại của mình đang làm thì đang sử dụng MySQL 5.6 nên mình cũng chia sẻ dựa theo version này.

Mà có đụng vào config nên mình cũng chia sẻ 2 cách để có thể cài đặt.
  - Một là cấu hình config trực tiếp bằng query nên `nhanh-gọn-lẹ`, mà chuyển đổi hệ thống hoặc hệ thống có vấn đề cần cài đặt lại mình config show log có thể bị mất phải vào để thêm lại.
  - Hai là cấu hình config bằng file cấu hình `my.cnf` của MySQL, thao tác hơi lằng một xíu mà mình có thể biết được những config này ở đâu để lần sau cài đặt bằng docker, hay thủ công, hay trên cloud có thể thêm config này như config mặc định.

Mà lang mang cũng nhiều rồi mình sẽ hướng dẫn cách cấu hình như bên dưới nhé.

## 1. Cấu hình bên trong Mysql không cần restart service.
Login vào mysql:

```bash
mysql -u root -p
```

Enable slow queries log:

```sql
SET GLOBAL slow_query_log = 'ON';
```

Setup thời gian quy định slow query: (thời gian theo đơn bị là `giây`)

```sql
SET GLOBAL long_query_time = 5;
```

Kiểm tra path của log file :

```sql
SHOW VARIABLES LIKE 'slow_query_log_file';
```

Kết quả :
```bash
+—————————————————————+———————————————————————————————————+
| Variable_name       | Value                             |
+---------------------+-----------------------------------+
| slow_query_log_file | /var/lib/mysql/localhost-slow.log |
+---------------------+-----------------------------------+
1 row in set (0,00 sec)
```

Thay đổi log file slow queries:
```sql
SET GLOBAL slow_query_log_file = '/path/filename';
```
Thực hiện bài test kiểm tra:
```
SELECT SLEEP(10);
```
Kiểm tra file lưu trữ hoặc dùng lệnh sau để kiểm tra:
```bash
mysqladmin proc stat
```
Kết quả :
```bash
+----+------+-----------+----+---------+------+-------+------------------+
| Id | User | Host      | db | Command | Time | State | Info             |
+----+------+-----------+----+---------+------+-------+------------------+
| 4  | root | localhost |    | Query   | 0    | init  | show processlist |
+----+------+-----------+----+---------+------+-------+------------------+
Uptime: 416  Threads: 1  Questions: 16  Slow queries: 1  Opens: 68
Flush tables: 1  Open tables: 61  Queries per second avg: 0.038
```

## 2. Cấu hình sửa trong file cấu hình, cần restart service
Mở file cấu hình :
```bash
vi /etc/my.cnf
```
Thêm đoạn cấu hình sau:
```md
[mysqld]

slow_query_log                  = 1
slow_query_log_file             = /var/log/mysql/slow.log
long_query_time                 = 5
````
Restart mysqld:
```bash
systemctl restart mysqld
```
Test bằng một số câu lệnh ở phần trên.
