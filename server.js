const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Підключення до бази даних SQLite (файл створиться автоматично)
const db = new Database('./database.sqlite', { verbose: console.log });

// Створення таблиці та додавання тестових даних, якщо таблиця порожня
db.prepare(`
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`).run();

const countRow = db.prepare("SELECT COUNT(*) AS count FROM items").get();
if (countRow.count === 0) {
    const insert = db.prepare("INSERT INTO items (name) VALUES (?)");
    insert.run("Електрогітара Ibanez GRG121DX");
    insert.run("Комбопідсилювач Mooer Hornet 15W");
    insert.run("Комплект струн Ernie Ball 10-46");
    insert.run("Набір медіаторів Dunlop Tortex 0.88mm");
    console.log("Тестові дані успішно додано в БД!");
}

// Endpoint GET /items
app.get('/items', (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM items").all();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Бекенд запущено на http://localhost:${PORT}`);
});