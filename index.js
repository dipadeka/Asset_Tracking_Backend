const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Server is ready!");
});

app.get("/api/test", (req, res) => {
    res.json([
        { id: 1, name: "Leanne Graham", username: "Bret", email: "Sincere@april.biz" },
        { id: 2, name: "Ervin Howell", username: "Antonette", email: "Shanna@melissa.tv" },
    ]);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});
