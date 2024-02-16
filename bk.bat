@echo off
mysqldump --host=localhost --user=root --password="99%%Seguro" intervia > "c:\backup.sql"
if %errorlevel% neq 0 pause
