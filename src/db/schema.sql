PRAGMA foreign_keys = ON;

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
    category_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name   TEXT NOT NULL UNIQUE,
    status          TEXT NOT NULL DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- 2. Foods
CREATE TABLE IF NOT EXISTS foods (
    food_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id     INTEGER NOT NULL,
    food_name       TEXT NOT NULL,
    price           INTEGER NOT NULL CHECK (price >= 0),
    image           TEXT,
    status          TEXT NOT NULL DEFAULT 'AVAILABLE'
                    CHECK (status IN ('AVAILABLE', 'UNAVAILABLE')),

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
);

-- 3. Restaurant tables
CREATE TABLE IF NOT EXISTS tables (
    table_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    table_number    INTEGER NOT NULL UNIQUE,
    capacity        INTEGER NOT NULL CHECK (capacity > 0),
    status          TEXT NOT NULL DEFAULT 'AVAILABLE'
                    CHECK (status IN ('AVAILABLE', 'OCCUPIED'))
);

-- 4. Bills
CREATE TABLE IF NOT EXISTS bills (
    bill_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    table_id        INTEGER NOT NULL,
    opened_at       TEXT NOT NULL,
    closed_at       TEXT,
    status          TEXT NOT NULL DEFAULT 'OPEN'
                    CHECK (status IN ('OPEN', 'CLOSED')),

    FOREIGN KEY (table_id)
        REFERENCES tables(table_id)
        ON DELETE RESTRICT
);

-- 5. Order rounds
CREATE TABLE IF NOT EXISTS order_rounds (
    round_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    bill_id         INTEGER NOT NULL,
    round_number    INTEGER NOT NULL CHECK (round_number > 0),
    ordered_at      TEXT NOT NULL,
    UNIQUE (bill_id, round_number),

    FOREIGN KEY (bill_id)
        REFERENCES bills(bill_id)
        ON DELETE RESTRICT
);

-- 6. Order items
CREATE TABLE IF NOT EXISTS order_items (
    item_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    round_id        INTEGER NOT NULL,
    food_id         INTEGER NOT NULL,
    quantity        INTEGER NOT NULL CHECK (quantity > 0),
    unit_price      INTEGER NOT NULL CHECK (unit_price >= 0),
    note            TEXT,
    status          TEXT NOT NULL DEFAULT 'WAITING'
                    CHECK (
                        status IN ('WAITING','COOKING','SERVED','CANCELLED')
                    ),

    FOREIGN KEY (round_id)
        REFERENCES order_rounds(round_id)
        ON DELETE RESTRICT,

    FOREIGN KEY (food_id)
        REFERENCES foods(food_id)
        ON DELETE RESTRICT
);

-- INDEXES
-- Frequently used when finding the currently open bill of a table.
CREATE INDEX IF NOT EXISTS idx_bills_table_status
ON bills(table_id, status);

-- Frequently used when loading all rounds of a bill in time order.
CREATE INDEX IF NOT EXISTS idx_order_rounds_bill_ordered
ON order_rounds(bill_id, ordered_at);

-- Frequently used when loading all food items belonging to a round.
CREATE INDEX IF NOT EXISTS idx_order_items_round
ON order_items(round_id);

-- Enforce: one table can have at most one OPEN bill.
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_open_bill_per_table
ON bills(table_id)
WHERE status = 'OPEN';
