"""Best-effort device/browser labeling and client IP extraction from request
headers. Browsers don't expose a device's actual model name for privacy
reasons, so this derives an "OS · Browser" label from the User-Agent string
instead — the practical maximum available without extra client-side APIs.
"""

from fastapi import Request

_OS_MARKERS = [
    ("iPhone", "iPhone"),
    ("iPad", "iPad"),
    ("Android", "Android"),
    ("Windows", "Windows"),
    ("Macintosh", "macOS"),
    ("Mac OS X", "macOS"),
    ("Linux", "Linux"),
]

_BROWSER_MARKERS = [
    ("OPR/", "Opera"),
    ("Opera", "Opera"),
    ("Edg/", "Edge"),
    ("EdgiOS/", "Edge"),
    ("CriOS/", "Chrome"),
    ("Chrome/", "Chrome"),
    ("FxiOS/", "Firefox"),
    ("Firefox/", "Firefox"),
]


def parse_device(user_agent: str) -> str:
    if not user_agent:
        return "Unknown device"

    os_name = next((label for marker, label in _OS_MARKERS if marker in user_agent), "Unknown OS")

    browser = next((label for marker, label in _BROWSER_MARKERS if marker in user_agent), None)
    if browser is None:
        browser = "Safari" if "Safari/" in user_agent and "Version/" in user_agent else "Unknown browser"

    return f"{os_name} · {browser}"


def get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "unknown"
