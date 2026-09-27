PRAGMA foreign_keys = ON;

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
    category_id     INTEGER     PRIMARY KEY     AUTOINCREMENT,
    category_name   TEXT        NOT NULL        UNIQUE,
    status          TEXT        NOT NULL        DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- 2. Foods
CREATE TABLE IF NOT EXISTS foods (
    food_id         INTEGER     PRIMARY KEY     AUTOINCREMENT,
    category_id     INTEGER     NOT NULL,
    food_name       TEXT        NOT NULL,
    price           INTEGER     NOT NULL
                    CHECK (price >= 0),
    image           TEXT,
    description     TEXT,
    status          TEXT        NOT NULL        DEFAULT 'AVAILABLE'
                    CHECK (status IN ('AVAILABLE', 'UNAVAILABLE')),

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
);

-- 3. Restaurant Tables
CREATE TABLE IF NOT EXISTS tables (
    table_id        INTEGER     PRIMARY KEY     AUTOINCREMENT,
    table_number    INTEGER     NOT NULL        UNIQUE,
    capacity        INTEGER     NOT NULL
                    CHECK (capacity > 0),
    status          TEXT        NOT NULL        DEFAULT 'AVAILABLE'
                    CHECK (status IN ('AVAILABLE', 'OCCUPIED'))
);

-- 4. Bills
CREATE TABLE IF NOT EXISTS bills (
    bill_id         INTEGER     PRIMARY KEY     AUTOINCREMENT,
    table_id        INTEGER     NOT NULL,
    customer_count  INTEGER     NOT NULL
                    CHECK (customer_count > 0),
    opened_at       TEXT        NOT NULL,
    closed_at       TEXT,
    total_amount    INTEGER     NOT NULL        DEFAULT 0
                    CHECK (total_amount >= 0),
    status          TEXT        NOT NULL        DEFAULT 'OPEN'
                    CHECK (status IN ('OPEN', 'CLOSED')),

    FOREIGN KEY (table_id)
        REFERENCES tables(table_id)
        ON DELETE RESTRICT
);

-- 5. Order Rounds
CREATE TABLE IF NOT EXISTS order_rounds (
    round_id        INTEGER     PRIMARY KEY     AUTOINCREMENT,
    bill_id         INTEGER     NOT NULL,
    round_number    INTEGER     NOT NULL
                    CHECK (round_number > 0),
    ordered_at      TEXT        NOT NULL,
    UNIQUE (bill_id, round_number),

    FOREIGN KEY (bill_id)
        REFERENCES bills(bill_id)
        ON DELETE RESTRICT
);

-- 6. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    item_id         INTEGER     PRIMARY KEY     AUTOINCREMENT,
    round_id        INTEGER     NOT NULL,
    food_id         INTEGER     NOT NULL,
    quantity        INTEGER     NOT NULL
                    CHECK (quantity > 0),
    unit_price      INTEGER     NOT NULL
                    CHECK (unit_price >= 0),
    note            TEXT,
    status          TEXT        NOT NULL        DEFAULT 'WAITING'
                    CHECK (
                        status IN (
                            'WAITING',
                            'COOKING',
                            'SERVED',
                            'CANCELLED'
                        )
                    ),

    FOREIGN KEY (round_id)
        REFERENCES order_rounds(round_id)
        ON DELETE RESTRICT,

    FOREIGN KEY (food_id)
        REFERENCES foods(food_id)
        ON DELETE RESTRICT
);

-- 7. Payments
CREATE TABLE IF NOT EXISTS payments (
    payment_id      INTEGER     PRIMARY KEY     AUTOINCREMENT,
    bill_id         INTEGER     NOT NULL,
    amount          INTEGER     NOT NULL
                    CHECK (amount > 0),
    payment_method  TEXT        NOT NULL
                    CHECK (
                        payment_method IN (
                            'CASH',
                            'QR',
                            'CARD'
                        )
                    ),
    paid_at         TEXT    NOT NULL,

    FOREIGN KEY (bill_id)
        REFERENCES bills(bill_id)
        ON DELETE RESTRICT
);

-- 7. Employee
CREATE TABLE IF NOT EXISTS employees (
    employee_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_name   TEXT NOT NULL,
    pin             TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- INDEXES
-- Find open bill of a table
CREATE INDEX IF NOT EXISTS idx_bills_table_status
ON bills(table_id, status);


-- Load bill history by closing time
CREATE INDEX IF NOT EXISTS idx_bills_closed_at
ON bills(closed_at);


-- Load rounds of a bill
CREATE INDEX IF NOT EXISTS idx_order_rounds_bill_ordered
ON order_rounds(bill_id, ordered_at);


-- Load items of a round
CREATE INDEX IF NOT EXISTS idx_order_items_round
ON order_items(round_id);


-- Find payment history of a bill
CREATE INDEX IF NOT EXISTS idx_payments_bill
ON payments(bill_id);


-- One table can have at most one OPEN bill
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_open_bill_per_table
ON bills(table_id)
WHERE status = 'OPEN';