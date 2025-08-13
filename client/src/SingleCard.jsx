<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>כרטיס פרופיל</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    .card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 20px;
        width: 350px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
    }
    .header img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
    }
    .header .name {
        font-size: 1.4em;
        font-weight: bold;
    }
    .header .role {
        color: gray;
        font-size: 0.9em;
    }
    .divider {
        border-top: 1px solid #ddd;
        margin: 15px 0;
    }
    .icons {
        display: flex;
        gap: 10px;
    }
    .icons a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 35px;
        height: 35px;
        border: 1px solid #ccc;
        border-radius: 5px;
        text-decoration: none;
        color: black;
    }
    .icons svg {
        width: 20px;
        height: 20px;
    }
</style>
</head>
<body>

<div class="card">
    <div class="header">
        <img src="b50c2214-8390-4d5e-bc5f-54a767822a25.png" alt="Avatar">
        <div>
            <div class="name">שם מלא</div>
            <div class="role">תפקיד / מחלקה</div>
        </div>
    </div>
    <div class="divider"></div>
    <div class="icons">
        <a href="#"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21.75 4.5v15a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5v-15a1.5 1.5 0 0 1 1.5-1.5h16.5a1.5 1.5 0 0 1 1.5 1.5zM3.75 4.5l8.25 7.5 8.25-7.5"/></svg></a>
        <a href="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v15A1.5 1.5 0 0 0 1.5 21h21a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 22.5 3h-21zm0 1.5h21v15h-21v-15zm3.75 3a.75.75 0 0 0 0 1.5h13.5a.75.75 0 0 0 0-1.5H5.25zm0 4.5a.75.75 0 0 0 0 1.5h9.75a.75.75 0 0 0 0-1.5H5.25z"/></svg></a>
        <a href="#"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M2.25 6.75v10.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V6.75M6.75 3h10.5v3.75H6.75V3z"/></svg></a>
        <a href="#"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4.5v15m7.5-7.5h-15"/></svg></a>
    </div>
</div>

</body>
</html>
