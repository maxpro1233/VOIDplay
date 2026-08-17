"""
Test End-to-End Auth & Telemetry against Neon PostgreSQL
"""
import sys
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import time
from database import get_db_connection
from auth import hash_password, verify_password, create_access_token, decode_access_token

def test_neon_integration():
    print("[TEST] 1. Testing Bcrypt & JWT...")
    pw = "SuperSecretPass2026!"
    hashed = hash_password(pw)
    assert verify_password(pw, hashed) == True
    assert verify_password("WrongPassword", hashed) == False
    print(" -> Bcrypt verification PASSED!")

    token = create_access_token({"user_id": 999, "username": "testuser"})
    decoded = decode_access_token(token)
    assert decoded["user_id"] == 999
    assert decoded["username"] == "testuser"
    print(" -> JWT generation & verification PASSED!")

    print("\n[TEST] 2. Testing Database Operations in Neon PostgreSQL...")
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            test_username = f"neon_test_{int(time.time())}"
            # Insert test user
            cur.execute("""
                INSERT INTO users (username, password_hash, first_name, last_name, nickname, birth_year, balance, chips)
                VALUES (%s, %s, %s, %s, %s, %s, 500, 0)
                RETURNING id, username, balance
            """, (test_username, hashed, "Максим", "Тест", "Максим Тест", 2004))
            user = cur.fetchone()
            user_id = user["id"]
            print(f" -> Created user '{test_username}' with ID {user_id} in Neon DB!")

            # Insert Telemetry record
            cur.execute("""
                INSERT INTO user_telemetry 
                (user_id, event_type, ip_address, device_type, os, browser, screen_resolution, cpu_cores, ram_memory, timezone, language, user_agent)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (user_id, "registration", "91.200.100.55", "ПК (Desktop)", "Windows 11", "Google Chrome", "1920x1080", "16", "32 GB", "Europe/Kyiv", "uk", "Mozilla/5.0"))
            telem_id = cur.fetchone()["id"]
            print(f" -> Logged device telemetry record ID {telem_id} in Neon DB!")

            # Verify balance update
            cur.execute("UPDATE users SET balance = 750, chips = 10 WHERE id = %s RETURNING balance, chips", (user_id,))
            updated = cur.fetchone()
            assert updated["balance"] == 750
            assert updated["chips"] == 10
            print(" -> Balance & chips atomic update PASSED in Neon DB!")

            # Clean up test user
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
            conn.commit()
            print(" -> Cleaned up test record cleanly!")

    print("\n🎉 ALL TESTS PASSED! Neon PostgreSQL & Auth are 100% operational!")

if __name__ == "__main__":
    test_neon_integration()
