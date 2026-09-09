"""
VØIDplay — Backend Server (FastAPI + PostgreSQL)
Full Auth (Bcrypt + JWT), Telemetry, Balance, Chips, Poker, Roulette, Friends System
"""
import sys
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import os
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from database import get_db_connection
from migrations import run_migrations
from auth import hash_password, verify_password, create_access_token, decode_access_token

# Run database migrations on startup
run_migrations()

app = FastAPI(title="VØIDplay API", version="7.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── PYDANTIC SCHEMAS ──
class TelemetryData(BaseModel):
    ip: Optional[str] = "127.0.0.1"
    deviceType: Optional[str] = "ПК"
    os: Optional[str] = "Windows"
    browser: Optional[str] = "Browser"
    screenRes: Optional[str] = "1920x1080"
    cpuCores: Optional[str] = "4"
    ram: Optional[str] = "N/A"
    timezone: Optional[str] = "UTC"
    language: Optional[str] = "uk"
    userAgent: Optional[str] = ""

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=4, max_length=100)
    firstName: str = Field(..., min_length=1, max_length=100)
    lastName: Optional[str] = ""
    birthYear: int
    telemetry: Optional[TelemetryData] = None

class LoginRequest(BaseModel):
    username: str
    password: str
    telemetry: Optional[TelemetryData] = None

class NicknameRequest(BaseModel):
    nickname: str = Field(..., min_length=2, max_length=100)

class AvatarRequest(BaseModel):
    avatarUrl: Optional[str] = None

class BalanceRequest(BaseModel):
    balance: int = Field(..., ge=0)

class ChipsRequest(BaseModel):
    chips: int = Field(..., ge=0)

class BuyChipsRequest(BaseModel):
    chipCount: int = Field(..., gt=0)

class CodeRequest(BaseModel):
    code: str

class ModCoinsRequest(BaseModel):
    amount: int = Field(..., gt=0)

class FriendSearchRequest(BaseModel):
    query: str

# ── AUTH DEPENDENCY ──
def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Необхідна авторизація")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Недійсний або прострочений токен")

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, username, first_name, last_name, nickname, birth_year, 
                       role, balance, chips, avatar_url, registered_at, last_login_at
                FROM users WHERE id = %s AND is_active = TRUE
            """, (payload["user_id"],))
            user = cur.fetchone()
            if not user:
                raise HTTPException(status_code=401, detail="Користувача не знайдено")
            return dict(user)

def save_telemetry_record(cur, user_id: int, event_type: str, telem: Optional[TelemetryData], req_client_ip: str, user_agent_hdr: str):
    ip = (telem.ip if telem and telem.ip else req_client_ip) or "127.0.0.1"
    cur.execute("""
        INSERT INTO user_telemetry 
        (user_id, event_type, ip_address, device_type, os, browser, screen_resolution, 
         cpu_cores, ram_memory, timezone, language, user_agent)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        user_id,
        event_type,
        ip,
        telem.deviceType if telem else "Unknown",
        telem.os if telem else "Unknown",
        telem.browser if telem else "Unknown",
        telem.screenRes if telem else "Unknown",
        str(telem.cpuCores) if telem else "N/A",
        telem.ram if telem else "N/A",
        telem.timezone if telem else "UTC",
        telem.language if telem else "uk",
        telem.userAgent if (telem and telem.userAgent) else user_agent_hdr
    ))

# ── AUTH ENDPOINTS ──
@app.post("/api/auth/register")
def register_user(data: RegisterRequest, request: Request):
    username = data.username.strip().lower()
    first_name = data.firstName.strip()
    last_name = (data.lastName or "").strip()
    now_year = 2026

    if data.birthYear < 1900 or data.birthYear > now_year:
        raise HTTPException(status_code=400, detail="Введіть правильний рік народження")
    if (now_year - data.birthYear) < 13:
        raise HTTPException(status_code=400, detail="Реєстрація дозволена лише з 13 років")

    pw_hash = hash_password(data.password)
    nickname = f"{first_name} {last_name}".strip()

    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "")

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE username = %s", (username,))
            if cur.fetchone():
                raise HTTPException(status_code=400, detail="Цей логін вже зайнятий")

            cur.execute("""
                INSERT INTO users (username, password_hash, first_name, last_name, nickname, birth_year, balance, chips)
                VALUES (%s, %s, %s, %s, %s, %s, 500, 0)
                RETURNING id, username, first_name, last_name, nickname, birth_year, role, balance, chips, avatar_url, registered_at
            """, (username, pw_hash, first_name, last_name, nickname, data.birthYear))
            user = dict(cur.fetchone())

            # Save Registration Telemetry to Postgres
            save_telemetry_record(cur, user["id"], "registration", data.telemetry, client_ip, user_agent)
            conn.commit()

    token = create_access_token({"user_id": user["id"], "username": user["username"]})
    return {"ok": True, "token": token, "user": user}

@app.post("/api/auth/login")
def login_user(data: LoginRequest, request: Request):
    username = data.username.strip().lower()
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "")

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, username, password_hash, first_name, last_name, nickname, 
                       birth_year, role, balance, chips, avatar_url, registered_at
                FROM users WHERE username = %s AND is_active = TRUE
            """, (username,))
            user = cur.fetchone()
            if not user or not verify_password(data.password, user["password_hash"]):
                raise HTTPException(status_code=400, detail="Невірний логін або пароль")

            user = dict(user)
            user_id = user["id"]

            # Update last_login_at
            cur.execute("UPDATE users SET last_login_at = NOW() WHERE id = %s", (user_id,))

            # Save Login Telemetry in Postgres
            save_telemetry_record(cur, user_id, "login", data.telemetry, client_ip, user_agent)
            conn.commit()

    user.pop("password_hash", None)
    token = create_access_token({"user_id": user_id, "username": user["username"]})
    return {"ok": True, "token": token, "user": user}

@app.get("/api/auth/me")
def get_me_profile(user: dict = Depends(get_current_user)):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Fetch latest telemetry
            cur.execute("""
                SELECT ip_address, device_type, os, browser, screen_resolution, cpu_cores, ram_memory, timezone, created_at
                FROM user_telemetry WHERE user_id = %s
                ORDER BY id DESC LIMIT 1
            """, (user["id"],))
            telem = cur.fetchone()
            user["latest_telemetry"] = dict(telem) if telem else None
    return {"ok": True, "user": user}

# ── PROFILE & USER MANAGEMENT ENDPOINTS ──
@app.post("/api/user/nickname")
def update_nickname(data: NicknameRequest, user: dict = Depends(get_current_user)):
    val = data.nickname.strip()
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET nickname = %s WHERE id = %s", (val, user["id"]))
            conn.commit()
    return {"ok": True, "nickname": val}

@app.post("/api/user/avatar")
def update_avatar(data: AvatarRequest, user: dict = Depends(get_current_user)):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET avatar_url = %s WHERE id = %s", (data.avatarUrl, user["id"]))
            conn.commit()
    return {"ok": True, "avatarUrl": data.avatarUrl}

@app.post("/api/user/balance")
def update_balance(data: BalanceRequest, user: dict = Depends(get_current_user)):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET balance = %s WHERE id = %s", (data.balance, user["id"]))
            conn.commit()
    return {"ok": True, "balance": data.balance}

@app.post("/api/user/chips")
def update_chips(data: ChipsRequest, user: dict = Depends(get_current_user)):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET chips = %s WHERE id = %s", (data.chips, user["id"]))
            conn.commit()
    return {"ok": True, "chips": data.chips}

@app.post("/api/user/buy-chips")
def buy_chips_endpoint(data: BuyChipsRequest, user: dict = Depends(get_current_user)):
    rate = 50
    total_cost = data.chipCount * rate
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT balance, chips FROM users WHERE id = %s FOR UPDATE", (user["id"],))
            res = cur.fetchone()
            if res["balance"] < total_cost:
                raise HTTPException(status_code=400, detail="Недостатньо монет для купівлі фішок!")
            new_bal = res["balance"] - total_cost
            new_chips = res["chips"] + data.chipCount
            cur.execute("UPDATE users SET balance = %s, chips = %s WHERE id = %s", (new_bal, new_chips, user["id"]))
            conn.commit()
    return {"ok": True, "balance": new_bal, "chips": new_chips, "bought": data.chipCount, "cost": total_cost}

@app.post("/api/user/cashout-chips")
def cashout_chips_endpoint(user: dict = Depends(get_current_user)):
    rate = 50
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT balance, chips FROM users WHERE id = %s FOR UPDATE", (user["id"],))
            res = cur.fetchone()
            chips = res["chips"]
            if chips <= 0:
                return {"ok": True, "balance": res["balance"], "chips": 0, "gained": 0}
            coins_gain = chips * rate
            new_bal = res["balance"] + coins_gain
            cur.execute("UPDATE users SET balance = %s, chips = 0 WHERE id = %s", (new_bal, user["id"]))
            conn.commit()
    return {"ok": True, "balance": new_bal, "chips": 0, "gained": coins_gain, "cashed": chips}

@app.post("/api/user/delete-coins")
def delete_coins_endpoint(user: dict = Depends(get_current_user)):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET balance = 0, chips = 0 WHERE id = %s", (user["id"],))
            conn.commit()
    return {"ok": True, "message": "Монети та фішки видалено"}

@app.post("/api/user/activate-code")
def activate_code_endpoint(data: CodeRequest, user: dict = Depends(get_current_user)):
    code = data.code.strip().upper()
    MOD_CODES = ["XM7AS62", "Q9KPLX8"]
    if code in MOD_CODES:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE users SET role = 'moderator' WHERE id = %s", (user["id"],))
                conn.commit()
        return {"ok": True, "role": "moderator", "msg": "✅ Роль MODERATOR активована!"}
    return {"ok": False, "msg": "❌ Невірний промокод"}

@app.post("/api/user/mod-give-coins")
def mod_give_coins(data: ModCoinsRequest, user: dict = Depends(get_current_user)):
    if user.get("role") != "moderator":
        raise HTTPException(status_code=403, detail="Доступ заборонено (тільки для MOD)")
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET balance = balance + %s WHERE id = %s RETURNING balance", (data.amount, user["id"]))
            new_bal = cur.fetchone()["balance"]
            conn.commit()
    return {"ok": True, "balance": new_bal}

# ── FRIENDS & FRIEND INVITATIONS SYSTEM ──
@app.get("/api/user/friends")
def get_friends_list(user: dict = Depends(get_current_user)):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT u.id, u.username, u.nickname, u.first_name, u.last_name, u.balance, u.avatar_url
                FROM friends f
                JOIN users u ON f.friend_id = u.id
                WHERE f.user_id = %s
                ORDER BY u.username ASC
            """, (user["id"],))
            friends = [dict(r) for r in cur.fetchall()]
    return {"ok": True, "friends": friends}

@app.get("/api/user/friends/requests")
def get_friend_requests(user: dict = Depends(get_current_user)):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT fr.id AS request_id, fr.sender_id, fr.created_at,
                       u.username AS sender_username, u.nickname AS sender_nickname,
                       u.first_name AS sender_first_name, u.last_name AS sender_last_name,
                       u.avatar_url AS sender_avatar, u.balance AS sender_balance
                FROM friend_requests fr
                JOIN users u ON fr.sender_id = u.id
                WHERE fr.receiver_id = %s AND fr.status = 'pending'
                ORDER BY fr.id DESC
            """, (user["id"],))
            requests_list = [dict(r) for r in cur.fetchall()]
    return {"ok": True, "requests": requests_list}

@app.post("/api/user/friends/request")
def send_friend_request(data: FriendSearchRequest, user: dict = Depends(get_current_user)):
    query = data.query.strip().lower()
    if not query:
        raise HTTPException(status_code=400, detail="Введіть логін або нікнейм гравця")

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Search by username or nickname (case-insensitive)
            cur.execute("""
                SELECT id, username, nickname FROM users 
                WHERE (LOWER(username) = %s OR LOWER(nickname) = %s) AND is_active = TRUE
            """, (query, query))
            target = cur.fetchone()
            if not target:
                raise HTTPException(status_code=404, detail="Гравця з таким логіном або нікнеймом не знайдено")

            target_id = target["id"]
            if target_id == user["id"]:
                raise HTTPException(status_code=400, detail="Ви не можете надіслати запит самому собі")

            # Check if already friends
            cur.execute("SELECT 1 FROM friends WHERE user_id = %s AND friend_id = %s", (user["id"], target_id))
            if cur.fetchone():
                raise HTTPException(status_code=400, detail="Цей гравець вже є у вашому списку друзів")

            # Check if request already pending
            cur.execute("""
                SELECT id, status FROM friend_requests 
                WHERE sender_id = %s AND receiver_id = %s
            """, (user["id"], target_id))
            existing = cur.fetchone()

            if existing:
                if existing["status"] == "pending":
                    raise HTTPException(status_code=400, detail="Ви вже надіслали запит цьому гравцю. Очікуйте відповіді!")
                else:
                    # Update status back to pending if was previously rejected
                    cur.execute("UPDATE friend_requests SET status = 'pending', created_at = NOW() WHERE id = %s", (existing["id"],))
            else:
                cur.execute("""
                    INSERT INTO friend_requests (sender_id, receiver_id, status)
                    VALUES (%s, %s, 'pending')
                """, (user["id"], target_id))

            conn.commit()

    return {"ok": True, "msg": f"Запит на дружбу успішно надіслано гравцю @{target['username']}!"}

@app.post("/api/user/friends/requests/{req_id}/accept")
def accept_friend_request(req_id: int, user: dict = Depends(get_current_user)):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, sender_id, receiver_id FROM friend_requests 
                WHERE id = %s AND receiver_id = %s AND status = 'pending'
            """, (req_id, user["id"]))
            req = cur.fetchone()
            if not req:
                raise HTTPException(status_code=404, detail="Запит не знайдено або вже оброблено")

            sender_id = req["sender_id"]

            # Mutual friendship
            cur.execute("INSERT INTO friends (user_id, friend_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", (user["id"], sender_id))
            cur.execute("INSERT INTO friends (user_id, friend_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", (sender_id, user["id"]))
            cur.execute("UPDATE friend_requests SET status = 'accepted' WHERE id = %s", (req_id,))
            conn.commit()

    return {"ok": True, "msg": "Запит прийнято! Тепер ви друзі."}

@app.post("/api/user/friends/requests/{req_id}/reject")
def reject_friend_request(req_id: int, user: dict = Depends(get_current_user)):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE friend_requests SET status = 'rejected' 
                WHERE id = %s AND receiver_id = %s
            """, (req_id, user["id"]))
            conn.commit()
    return {"ok": True, "msg": "Запит відхилено."}

@app.delete("/api/user/friends/{username}")
def remove_friend(username: str, user: dict = Depends(get_current_user)):
    target_username = username.strip().lower()
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE username = %s", (target_username,))
            target = cur.fetchone()
            if target:
                cur.execute("""
                    DELETE FROM friends WHERE (user_id = %s AND friend_id = %s) OR (user_id = %s AND friend_id = %s)
                """, (user["id"], target["id"], target["id"], user["id"]))
                conn.commit()
    return {"ok": True, "msg": "Друга видалено"}

@app.get("/api/user/telemetry")
def get_telemetry_history(user: dict = Depends(get_current_user)):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, event_type, ip_address, device_type, os, browser, screen_resolution, 
                       cpu_cores, ram_memory, timezone, language, user_agent, created_at
                FROM user_telemetry
                WHERE user_id = %s
                ORDER BY id DESC
                LIMIT 50
            """, (user["id"],))
            logs = [dict(r) for r in cur.fetchall()]
    return {"ok": True, "telemetry": logs}

# ── SERVE STATIC HTML & ASSETS ──
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

@app.get("/")
def serve_index():
    return FileResponse(os.path.join(CURRENT_DIR, "index.html"))

@app.get("/{filename}.html")
def serve_html(filename: str):
    file_path = os.path.join(CURRENT_DIR, f"{filename}.html")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Page not found")

app.mount("/", StaticFiles(directory=CURRENT_DIR, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"[SERVER] Starting VØIDplay server on port {port} ...")
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False)
