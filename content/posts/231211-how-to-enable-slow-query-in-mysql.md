---
title: "Cách để enable slow query log trong Mysql"
draft: false
date: 2023-12-11
description: "Trong quá trình sử dụng và vận hành hệ thống Mysql thì việc quản lý các câu truy vấn thực thi chậm trên hệ thống sẽ giúp chúng ta có thể như điều tra nhanh chóng ..."
slug: "how-to-enable-slow-query-in-mysql"
categories:
  - SQL
tags:
  - SQL
  - Log
---

Trong quá trình sử dụng và vận hành hệ thống Mysql thì việc quản lý các câu truy vấn thực thi chậm trên hệ thống sẽ giúp mình có thể điều tra nhanh chóng xem vấn đề nằm trong code hay do hệ thống chưa được tối ưu tốt, mình sẽ note lại cấu hình log slow queries trong Mysql bản 5.6.

## 1. Cấu hình bên trong Mysql không cần restart service.
Login vào mysql:

```bash
mysql -u root -p
```

Enable slow queries log:

```sql
SET GLOBAL slow_query_log = 'ON';
```

Setup thời gian quy định slow query:

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

## 2. Cấu hình sửa trong file cấu hình, cần restart dịch vụ
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
