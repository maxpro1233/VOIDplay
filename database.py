"""
Database Connection & Pool Manager for Neon PostgreSQL
"""
import os
import psycopg
from psycopg.rows import dict_row

NEON_DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_JWf7PecqaOG0@ep-super-shadow-b2o83ulx.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require"
)

def get_db_connection():
    """Returns a direct psycopg connection to Neon with dictionary rows."""
    return psycopg.connect(NEON_DATABASE_URL, row_factory=dict_row)
