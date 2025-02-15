@echo off
@REM ovde se koeisti tačna putanja iza /d ukoliko putanja sadrži razmak koristiti navodne znakove
cd /d "C:\Users\drres\Desktop\web blog"
"C:\Users\drres\Desktop\web blog\venv\Scripts\python.exe" manage.py delete_inactive_users

