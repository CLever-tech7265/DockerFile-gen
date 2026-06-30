// src/dockerLiveUpdater.js
// Purpose: Automatically update Docker images

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ============================================================
// Cache management
// ============================================================

const CACHE_FILE = path.join(process.cwd(), ".docker-image-cache.json");
// cache file location: inside the project directory

function loadCache() {
    // Loads the cache file
    // If it doesn't exist, returns an empty object
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, "utf-8");
            return JSON.parse(data);
        }
    } catch {
        // If an error occurs (corrupted file, etc.) — start fresh
        console.warn("⚠️ cache file is corrupted, starting fresh");
    }
    return {};
}

function saveCache(cache) {
    // Saves cache to file
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function isCacheValid(key) {
    // Checks if a cached image is still valid
    // Cache is valid for 24 hours

    const cache = loadCache();
    if (!cache[key]) return false;

    const age = Date.now() - cache[key].timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    return age < maxAge;
}

function getCachedImage(key) {
    // Returns cached image if valid
    const cache = loadCache();
    if (cache[key] && isCacheValid(key)) {
        return cache[key].image;
    }
    return null;
}

function setCachedImage(key, image) {
    // Stores image in cache
    const cache = loadCache();
    cache[key] = {
        image: image,
        timestamp: Date.now() // current time in milliseconds
    };
    saveCache(cache);
}

// ============================================================
// Docker checks
// ============================================================

function isDockerInstalled() {
    // Checks if Docker is installed on the system
    // Runs "docker --version" and verifies success

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
    // Pulls a Docker image from Docker Hub
    // Runs "docker pull [imageName]"

    try {
        execSync(`docker pull ${imageName}`, {
            timeout: 60000 // 60 seconds — pull may take time
        });
        return true;
    } catch {
        return false;
    }
}

function verifyImage(imageName) {
    // Checks if a Docker image exists locally
    // Runs "docker image inspect [imageName]"

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
// Main logic — automated image updater
// ============================================================

function updateImageWithDocker(type, strategy, version) {
    // Tries to automatically update a Docker image
    //
    // Flow:
    // 1. Build image name (e.g. node:18-alpine)
    // 2. Build cache key (e.g. node-18)
    // 3. Check cache — if valid, return cached image
    // 4. If not cached — pull image from Docker Hub
    // 5. Store result in cache for 24 hours
    // 6. Return final image name

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
            return null;
    }

    // Step 2: Check cache
    const cached = getCachedImage(cacheKey);
    if (cached) {
        console.warn(`📦 ${imageName} — using cached version (updated within 24h)`);
        return cached;
    }

    // Step 3: Check Docker availability
    if (!isDockerInstalled()) {
        console.warn("⚠️ Docker is not installed — falling back to default");
        return null;
    }

    // Step 4: Pull image
    console.warn(`📥 Pulling ${imageName}...`);
    const success = pullImage(imageName);

    if (!success) {
        console.warn(`⚠️ Failed to pull ${imageName} — using fallback`);
        return null;
    }

    // Step 5: Verify image exists locally
    if (verifyImage(imageName)) {
        setCachedImage(cacheKey, imageName);
        console.warn(`✅ ${imageName} — successfully pulled and installed`);
        return imageName;
    }

    // Step 6: fallback
    return null;
}

// Export functions
module.exports = { updateImageWithDocker };