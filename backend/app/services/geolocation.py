"""Approximate (city-level) geolocation from an IP address via ip-api.com's
free lookup API (HTTP only on the free tier — the visitor's IP is the only
thing sent, no image or personal data). Best-effort only: private/local IPs
and lookup failures resolve to None rather than raising, since this is a
nice-to-have on top of a prediction, not something that should ever block
it. ipapi.co (HTTPS) was tried first but its free tier rate-limits shared
cloud egress IPs almost immediately, which Render's free tier would hit
constantly.
"""

from typing import Optional

import httpx

_LOCAL_PREFIXES = ("127.", "10.", "192.168.", "::1", "unknown")
_LOOKUP_TIMEOUT_SECONDS = 2.0


def _is_local(ip: str) -> bool:
    if not ip:
        return True
    if ip.startswith(_LOCAL_PREFIXES):
        return True
    if ip.startswith("172."):
        second_octet = ip.split(".")[1] if "." in ip else ""
        return second_octet.isdigit() and 16 <= int(second_octet) <= 31
    return False


async def lookup_location(ip: str) -> Optional[str]:
    if _is_local(ip):
        return None

    try:
        async with httpx.AsyncClient(timeout=_LOOKUP_TIMEOUT_SECONDS) as client:
            response = await client.get(
                f"http://ip-api.com/json/{ip}",
                params={"fields": "status,country,regionName,city"},
            )
            response.raise_for_status()
            data = response.json()
    except Exception:
        return None

    if data.get("status") != "success":
        return None

    parts = [data.get("city"), data.get("regionName"), data.get("country")]
    parts = [p for p in parts if p]
    return ", ".join(parts) if parts else None
