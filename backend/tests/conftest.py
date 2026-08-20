"""Load REACT_APP_BACKEND_URL from /app/frontend/.env for tests."""
import os
from pathlib import Path


def _load_frontend_env():
    env_path = Path("/app/frontend/.env")
    if not env_path.exists():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        v = v.strip().strip('"').strip("'")
        os.environ.setdefault(k.strip(), v)


_load_frontend_env()
