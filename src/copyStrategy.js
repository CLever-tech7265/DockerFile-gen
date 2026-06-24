const { detectBuildFiles } = require("./buildLayerDetector");

function getCopyStrategy(type) {

    const files = detectBuildFiles();

    // 🟢 Node.js (cache optimization)
    if (type === "node" && files.node) {
        return [
            "COPY package*.json ./",
            "RUN npm install",
            "COPY . ."
        ];
    }

    // 🟢 Python
    if (type === "python" && files.python) {
        return [
            "COPY requirements.txt ./",
            "RUN pip install -r requirements.txt",
            "COPY . ."
        ];
    }

    // 🟢 Go
    if (type === "go" && files.go) {
        return [
            "COPY go.mod go.sum ./",
            "RUN go mod download",
            "COPY . ."
        ];
    }

    // 🟢 Java
    if (type === "java") {
        return [
            "COPY . .",
            "RUN mvn clean install -DskipTests"
        ];
    }

    // 🟢 C#
    if (type === "csharp") {
        return [
            "COPY . .",
            "RUN dotnet restore"
        ];
    }

    // fallback
    return [
        "COPY . ."
    ];
}

module.exports = { getCopyStrategy };