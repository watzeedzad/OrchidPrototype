# OrchidPrototype (Backend)

## วิธีการติดตั้ง
 - ทำการ clone ตัวโปรเจคโดยใช้คำสั่ง git clone
```
git clone https://github.com/watzeedzad/OrchidPrototype.git
```
 - สร้างไฟล์ .env โดยที่สร้างตามตัวอย่างไฟล์ .env.example
 ```
 ORIGIN_URL="http://localhost:3000"
 DB_HOST="your-host/your-db-name"
 DB_USER="your-db-username"
 DB_PASS="your-db-password"
 ```
 - แก้ไขค่า environment variable ต่าง ๆ ให้ตรงตาม environment นั้น ๆ โดยที่
 ```
 ORIGIN_URL : url ของ frontend
 DB_HOST : your-host คือ ip และ post ของ database ส้วน your-db-name คือชื่อของ database ที่จะใช้
 DB_USER : username ที่ใช้ในการ authentication กับ database
 DB_PASS : password ที่ใช้ในการ authentication กับ database
 ```
 - ติดตั้ง dependentcy โดยที่ใช้คำสั่ง
 ```
 npm install
 ```
## วิธีการรัน
 - ไปที่ root folder ของ OrchidPrototype-Client ที่เป็น Frontend ซึ่ง folder OrchidPrototype และ OrchidPrototype-Client ต้องอยู่ใน Directory เดียวกัน และใช้คำสี่ง
 ```
 npm start
 ```
