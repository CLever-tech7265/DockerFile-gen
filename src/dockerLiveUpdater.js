// src/dockerLiveUpdater.js
// מטרה: לעדכן תמונות Docker אוטומטית

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ============================================================
// ניהול מטמון (cache)
// ============================================================

const CACHE_FILE = path.join(process.cwd(), ".docker-image-cache.json");
// cache file location: בתיקיית הפרויקט

function loadCache() {
    // פונקציה: טוענת את קובץ המטמון
    // אם הקובץ לא קיים, מחזירה אובייקט ריק
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, "utf-8");
            return JSON.parse(data);
        }
    } catch {
        // אם קרתה שגיאה (קובץ פגום וכו') — מתחילים מחדש
        console.warn("⚠️ cache file is corrupted, starting fresh");
    }
    return {};
}

function saveCache(cache) {
    // פונקציה: שומרת את המטמון לקובץ
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function isCacheValid(key) {
    // פונקציה: בודקת אם המטמון לתמונה מסוימת עדיין תקף
    // cache תקף ל-24 שעות
    
    const cache = loadCache();
    if (!cache[key]) return false;
    
    const age = Date.now() - cache[key].timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 שעות במילישניות
    
    return age < maxAge;
}

function getCachedImage(key) {
    // פונקציה: מחזירה את התמונה מהמטמון
    const cache = loadCache();
    if (cache[key] && isCacheValid(key)) {
        return cache[key].image;
    }
    return null;
}

function setCachedImage(key, image) {
    // פונקציה: שומרת תמונה במטמון
    const cache = loadCache();
    cache[key] = {
        image: image,
        timestamp: Date.now() // הזמן הנוכחי במילישניות
    };
    saveCache(cache);
}

// ============================================================
// בדיקת Docker
// ============================================================

function isDockerInstalled() {
    // פונקציה: בודקת אם Docker מותקן על המחשב
    // מריצה "docker --version" ורואה אם זה מצליח
    
    try {
        execSync("docker --version", {
            encoding: "utf-8",
            timeout: 5000,
            stdio: "pipe"
        });
        return true;
    } catch {
        return false;
    }
}

function pullImage(imageName) {
    // פונקציה: מורידה תמונה מ-Docker Hub
    // מריצה "docker pull [imageName]"
    
    try {
        execSync(`docker pull ${imageName}`, {
            timeout: 60000 // 60 שניות — כי הורדה יכולה לקחת זמן
        });
        return true;
    } catch {
        return false;
    }
}

function verifyImage(imageName) {
    // פונקציה: בודקת אם תמונה קיימת ב-Docker
    // מריצה "docker image inspect [imageName]"
    
    try {
        execSync(`docker image inspect ${imageName}`, {
            timeout: 5000
        });
        return true;
    } catch {
        return false;
    }
}

// ============================================================
// הפונקציה הראשית — אוטומציה של עדכון תמונה
// ============================================================

function updateImageWithDocker(type, strategy, version) {
    // פונקציה: מנסה לעדכן תמונה אוטומטית
    //
    // איך זה עובד:
    // 1. בונה את שם התמונה (למשל eclipse-temurin:17)
    // 2. בונה מפתח למטמון (למשל java-17)
    // 3. בודק במטמון — אם יש תמונה עדכנית, מחזיר אותה
    // 4. אם אין במטמון — מוריד את התמונה מה-Docker Hub
    // 5. שומר במטמון לתקופה של 24 שעות
    // 6. מחזיר את התמונה שעדכנת
    
    // שלב 1: בנה את שם התמונה הבסיסי
    let imageName = null;
    let cacheKey = null;
    
    switch (type) {
        case "node": {
            const v = version || "18";
            imageName = `node:${v}-alpine`;
            cacheKey = `node-${v}`;
            break;
        }
        case "java": {
            const v = version || 17;
            if (v >= 21) {
                imageName = "eclipse-temurin:21";
                cacheKey = "java-21";
            } else {
                imageName = "eclipse-temurin:17";
                cacheKey = "java-17";
            }
            break;
        }
        case "python": {
            const v = version || "3.11";
            imageName = `python:${v}-slim`;
            cacheKey = `python-${v}`;
            break;
        }
        case "go": {
            const v = version || "1.21";
            imageName = `golang:${v}-alpine`;
            cacheKey = `go-${v}`;
            break;
        }
        case "csharp": {
            const v = version || "8.0";
            imageName = `mcr.microsoft.com/dotnet/sdk:${v}`;
            cacheKey = `csharp-${v}`;
            break;
        }
        default:
            return null; // סוג לא מוכר
    }
    
    // שלב 2: בדוק מטמון
    const cached = getCachedImage(cacheKey);
    if (cached) {
        console.warn(`📦 ${imageName} — השתמשתי במטמון (עודכן ב-24 שעות האחרונות)`);
        return cached;
    }
    
    // שלב 3: בדוק אם Docker מותקן
    if (!isDockerInstalled()) {
        console.warn("⚠️ Docker לא מותקן — משתמש בברירת מחדל");
        return null; // null = המצביע שישתמש בברירת המחדל
    
    }
    
    // שלב 4: נסה להוריד את התמונה
    console.warn(`📥 מוריד ${imageName}...`);
    const success = pullImage(imageName);
    
    if (!success) {
        console.warn(`⚠️ לא הצלחתי להוריד ${imageName} — משתמש בברירת מחדל`);
        return null;
    }
    
    // שלב 5: בדוק שהתמונה אכן נשמרה
    if (verifyImage(imageName)) {
        // שמור במטמון
        setCachedImage(cacheKey, imageName);
        console.warn(`✅ ${imageName} — הורדה והתקנה הצליחה`);
        return imageName;
    }
    
    // שלב 6: במקרה של כישלון — חזור לברירת מחדל
    return null;
}

// מייצא את הפונקציות
module.exports = { updateImageWithDocker };