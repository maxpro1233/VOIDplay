"""
Database Migrations Runner for Neon PostgreSQL
"""
import sys

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from database import get_db_connection

MIGRATIONS = [
    (
        "001_initial_schema",
        """
        -- Schema migrations table
        CREATE TABLE IF NOT EXISTS _schema_migrations (
            id SERIAL PRIMARY KEY,
            version VARCHAR(100) UNIQUE NOT NULL,
            applied_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Users table
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) DEFAULT '',
            nickname VARCHAR(100),
            birth_year INTEGER NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            balance BIGINT DEFAULT 500,
            chips BIGINT DEFAULT 0,
            avatar_url TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            registered_at TIMESTAMPTZ DEFAULT NOW(),
            last_login_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

        -- User Telemetry / Hardware & Audit table
        CREATE TABLE IF NOT EXISTS user_telemetry (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            event_type VARCHAR(30) NOT NULL, -- 'registration' | 'login'
            ip_address VARCHAR(60) NOT NULL,
            device_type VARCHAR(60),
            os VARCHAR(60),
            browser VARCHAR(60),
            screen_resolution VARCHAR(60),
            cpu_cores VARCHAR(30),
            ram_memory VARCHAR(30),
            timezone VARCHAR(60),
            language VARCHAR(30),
            user_agent TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_telemetry_user_id ON user_telemetry(user_id);
        CREATE INDEX IF NOT EXISTS idx_telemetry_created_at ON user_telemetry(created_at);

        -- Friends table
        CREATE TABLE IF NOT EXISTS friends (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id, friend_id)
        );

        CREATE INDEX IF NOT EXISTS idx_friends_user ON friends(user_id);

        -- Game History audit table
        CREATE TABLE IF NOT EXISTS game_history (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            game_type VARCHAR(40) NOT NULL, -- 'blackjack', 'crash', etc.
            bet_amount INTEGER DEFAULT 0,
            win_amount INTEGER DEFAULT 0,
            multiplier NUMERIC(10,2) DEFAULT 1.0,
            result VARCHAR(30), -- 'win', 'lose', 'push', 'blackjack'
            details JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_game_hist_user ON game_history(user_id);
        """
    ),
    (
        "002_friend_requests",
        """
        -- Friend requests table for invitations
        CREATE TABLE IF NOT EXISTS friend_requests (
            id SERIAL PRIMARY KEY,
            sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'accepted' | 'rejected'
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(sender_id, receiver_id)
        );

        CREATE INDEX IF NOT EXISTS idx_friend_req_receiver ON friend_requests(receiver_id, status);
        CREATE INDEX IF NOT EXISTS idx_friend_req_sender ON friend_requests(sender_id);
        """
    )
]

def run_migrations():
    print("[MIGRATIONS] Connecting to Neon PostgreSQL and applying migrations...")
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Ensure migrations tracking table exists
            cur.execute("""
                CREATE TABLE IF NOT EXISTS _schema_migrations (
                    id SERIAL PRIMARY KEY,
                    version VARCHAR(100) UNIQUE NOT NULL,
                    applied_at TIMESTAMPTZ DEFAULT NOW()
                );
            """)
            conn.commit()

            # Check and apply pending migrations
            for version, sql in MIGRATIONS:
                cur.execute("SELECT 1 FROM _schema_migrations WHERE version = %s", (version,))
                if cur.fetchone():
                    print(f"[MIGRATIONS] Migration {version} already applied.")
                    continue

                print(f"[MIGRATIONS] Applying migration {version}...")
                cur.execute(sql)
                cur.execute("INSERT INTO _schema_migrations (version) VALUES (%s)", (version,))
                conn.commit()
                print(f"[MIGRATIONS] Migration {version} applied successfully!")

    print("[MIGRATIONS] All Neon database migrations are up to date!")

if __name__ == "__main__":
    run_migrations()
