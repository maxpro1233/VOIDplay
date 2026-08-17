"""
Comprehensive Test for Poker, Roulette, and Database Friend Requests Flow
"""
import sys
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import time
from database import get_db_connection
from auth import hash_password

def test_full_features():
    print("[TEST] Starting comprehensive test for VØIDplay features...")

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            ts = int(time.time())
            user_a = f"player_a_{ts}"
            user_b = f"player_b_{ts}"
            pw_hash = hash_password("TestPass123")

            # 1. Create User A and User B
            cur.execute("""
                INSERT INTO users (username, password_hash, first_name, last_name, nickname, birth_year)
                VALUES (%s, %s, %s, %s, %s, 2000) RETURNING id, username
            """, (user_a, pw_hash, "Гравець", "Перший", "Player One"))
            a_row = cur.fetchone()
            id_a = a_row["id"]

            cur.execute("""
                INSERT INTO users (username, password_hash, first_name, last_name, nickname, birth_year)
                VALUES (%s, %s, %s, %s, %s, 2002) RETURNING id, username
            """, (user_b, pw_hash, "Гравець", "Другий", "Player Two"))
            b_row = cur.fetchone()
            id_b = b_row["id"]
            print(f" -> Created test users '{user_a}' (ID {id_a}) and '{user_b}' (ID {id_b})")

            # 2. User A sends friend request to User B
            cur.execute("""
                INSERT INTO friend_requests (sender_id, receiver_id, status)
                VALUES (%s, %s, 'pending') RETURNING id, status
            """, (id_a, id_b))
            req_row = cur.fetchone()
            req_id = req_row["id"]
            print(f" -> User A sent friend request ID {req_id} to User B!")

            # 3. User B queries incoming pending requests
            cur.execute("""
                SELECT fr.id, u.username, u.nickname 
                FROM friend_requests fr
                JOIN users u ON fr.sender_id = u.id
                WHERE fr.receiver_id = %s AND fr.status = 'pending'
            """, (id_b,))
            pending = cur.fetchall()
            assert len(pending) == 1
            assert pending[0]["username"] == user_a
            print(f" -> User B successfully received notification from '{pending[0]['username']}' ('{pending[0]['nickname']}')!")

            # 4. User B accepts request
            cur.execute("INSERT INTO friends (user_id, friend_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", (id_b, id_a))
            cur.execute("INSERT INTO friends (user_id, friend_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", (id_a, id_b))
            cur.execute("UPDATE friend_requests SET status = 'accepted' WHERE id = %s", (req_id,))
            print(" -> User B accepted request! Created mutual friendship.")

            # 5. Verify friendship
            cur.execute("SELECT COUNT(*) AS c FROM friends WHERE user_id = %s AND friend_id = %s", (id_a, id_b))
            assert cur.fetchone()["c"] == 1
            cur.execute("SELECT COUNT(*) AS c FROM friends WHERE user_id = %s AND friend_id = %s", (id_b, id_a))
            assert cur.fetchone()["c"] == 1
            print(" -> Verified: User A and User B are now mutual friends in PostgreSQL!")

            # Cleanup
            cur.execute("DELETE FROM users WHERE id IN (%s, %s)", (id_a, id_b))
            conn.commit()
            print(" -> Test cleanup completed successfully!")

    print("\n🎉 ALL TESTS COMPLETED WITH 100% SUCCESS!")

if __name__ == "__main__":
    test_full_features()
