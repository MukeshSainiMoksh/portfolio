"""
Email notification helper — uses smtplib (stdlib, no extra deps)
"""

import asyncio
import html
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from core.config import settings

logger = logging.getLogger("portfolio.email")

SMTP_TIMEOUT_SECONDS = 15


def _send_sync(subject: str, html_body: str, text_body: str) -> None:
    """Blocking send — called via asyncio.to_thread so it doesn't block the event loop."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_USER
    msg["To"] = settings.NOTIFY_EMAIL

    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=SMTP_TIMEOUT_SECONDS) as server:
        server.ehlo()
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_USER, settings.NOTIFY_EMAIL, msg.as_string())


async def send_contact_notification(
    name: str,
    email: str,
    subject: Optional[str],
    message: str,
) -> None:
    """Send a contact-form notification email to the portfolio owner."""
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("SMTP not configured — skipping contact notification email")
        return

    # strip CR/LF so user input can never inject extra SMTP headers via the Subject
    name = " ".join(name.splitlines())
    subject = " ".join(subject.splitlines()) if subject else subject

    # escape all user-supplied values before HTML interpolation (HTML-injection guard)
    name = html.escape(name)
    email = html.escape(email)
    message = html.escape(message)
    display_subject = html.escape(subject or "(no subject)")

    mail_subject = f"[Portfolio] New message from {name}"

    html_body = f"""
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#e0e0e0;border:1px solid rgba(0,245,255,0.2);border-radius:4px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#00f5ff11,#a855f711);padding:24px 28px;border-bottom:1px solid rgba(0,245,255,0.15);">
        <h2 style="margin:0;font-size:18px;letter-spacing:2px;color:#00f5ff;font-family:monospace;">NEW CONTACT MESSAGE</h2>
        <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.35);font-family:monospace;letter-spacing:1px;">Portfolio · Contact Form Submission</p>
      </div>
      <div style="padding:28px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:11px;color:rgba(0,245,255,0.6);font-family:monospace;letter-spacing:1px;width:90px;">NAME</td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#fff;">{name}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:11px;color:rgba(0,245,255,0.6);font-family:monospace;letter-spacing:1px;">EMAIL</td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;"><a href="mailto:{email}" style="color:#a855f7;text-decoration:none;">{email}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:11px;color:rgba(0,245,255,0.6);font-family:monospace;letter-spacing:1px;">SUBJECT</td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#fff;">{display_subject}</td>
          </tr>
          <tr>
            <td style="padding:14px 0 0;font-size:11px;color:rgba(0,245,255,0.6);font-family:monospace;letter-spacing:1px;vertical-align:top;">MESSAGE</td>
            <td style="padding:14px 0 0;font-size:14px;color:#e0e0e0;line-height:1.7;white-space:pre-wrap;">{message}</td>
          </tr>
        </table>
      </div>
      <div style="padding:16px 28px;background:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.05);font-size:10px;color:rgba(255,255,255,0.2);font-family:monospace;letter-spacing:1px;">
        MKS PORTFOLIO · AUTO-NOTIFICATION · Reply directly to {email}
      </div>
    </div>
    """

    text_body = (
        f"New contact message from your portfolio\n\n"
        f"Name:    {name}\n"
        f"Email:   {email}\n"
        f"Subject: {display_subject}\n\n"
        f"Message:\n{message}\n"
    )

    try:
        await asyncio.to_thread(_send_sync, mail_subject, html_body, text_body)
    except Exception:
        logger.exception("Failed to send contact notification email")
