import ssl
import socket
from datetime import datetime, timezone
from urllib.parse import urlparse

def analyze_tls_certificate(target: str) -> dict:
    """
    Connects directly to the domain's port 443, extracts the raw TLS x509 certificate,
    evaluates expiration, issuer, SANs, and outputs technical threat indicators.
    """
    # Standardize input into a hostname
    if not target.startswith(("http://", "https://")):
        target_url = "https://" + target
    else:
        target_url = target

    parsed = urlparse(target_url)
    hostname = parsed.hostname or target
    port = parsed.port or 443

    # Handle HTTP or non-domain inputs gracefully
    if parsed.scheme == "http":
        return {
            "has_tls": False,
            "error": "Unencrypted HTTP Protocol",
            "issuer": None,
            "days_until_expiry": None,
            "subject_alt_names": [],
            "risk_signals": ["Connection is completely unencrypted (HTTP). Sensitive data sent in plaintext."]
        }

    context = ssl.create_default_context()
    
    try:
        # Establish low-level socket connection with a fast 4-second timeout
        with socket.create_connection((hostname, port), timeout=4.0) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()

        # Parse Certificate Dates
        not_after_str = cert.get("notAfter")
        not_before_str = cert.get("notBefore")
        
        date_format = "%b %d %H:%M:%S %Y %Z"
        expiry_date = datetime.strptime(not_after_str, date_format).replace(tzinfo=timezone.utc)
        issue_date = datetime.strptime(not_before_str, date_format).replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)

        days_until_expiry = (expiry_date - now).days
        cert_valid_duration_days = (expiry_date - issue_date).days

        # Extract Issuer Details
        issuer_info = dict(x[0] for x in cert.get("issuer", []))
        issuer_org = issuer_info.get("organizationName", issuer_info.get("commonName", "Unknown Issuer"))

        # Extract Subject Alternative Names (SANs)
        san_tuple = cert.get("subjectAltName", ())
        sans = [item[1] for item in san_tuple if item[0] == "DNS"]

        risk_signals = []

        # Technical Rule Evaluation:
        if days_until_expiry < 0:
            risk_signals.append("EXPIRED TLS CERTIFICATE: The certificate has already passed its expiration date.")
        elif days_until_expiry < 14:
            risk_signals.append(f"CRITICAL EXPIRATION WINDOW: Certificate expires in under 14 days ({days_until_expiry} days remaining).")

        # Short-lived free certificates (e.g., 90-day Let's Encrypt / ZeroSSL) are standard, but heavily targeted by scammers for automated disposable phishing sites
        if cert_valid_duration_days <= 90 and ("Let's Encrypt" in issuer_org or "ZeroSSL" in issuer_org):
            risk_signals.append(f"Automated/Short-Lived Cert Authority detected ('{issuer_org}'). High prevalence in ephemeral phishing infrastructure.")

        # SAN count check (Wildcard / multi-domain abuse)
        if len(sans) > 30:
            risk_signals.append(f"MASSIVE SAN CHAIN: Certificate is shared across {len(sans)} distinct subdomains/domains (Potential shared host/CDN abuse).")

        return {
            "has_tls": True,
            "issuer": issuer_org,
            "days_until_expiry": days_until_expiry,
            "valid_duration_days": cert_valid_duration_days,
            "subject_alt_names_count": len(sans),
            "risk_signals": risk_signals if risk_signals else ["TLS Certificate configuration appears standard."]
        }

    except ssl.SSLCertVerificationError as e:
        return {
            "has_tls": False,
            "error": "SSL Verification Failed",
            "issuer": None,
            "days_until_expiry": 0,
            "subject_alt_names": [],
            "risk_signals": [f"INVALID/SELF-SIGNED CERTIFICATE: Handshake rejected ({str(e.reason)})."]
        }
    except Exception as e:
        return {
            "has_tls": False,
            "error": "Connection Failed",
            "issuer": None,
            "days_until_expiry": None,
            "subject_alt_names": [],
            "risk_signals": [f"Unable to establish TLS handshake with host '{hostname}': {str(e)}"]
        }