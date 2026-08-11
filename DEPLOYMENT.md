# Deployment

Three deployable pieces plus a database:

| Piece | Path | Needs |
|---|---|---|
| Backend API | `backend/` | Python 3.12, PostgreSQL, **durable file storage** |
| Public website | `frontend/website/` | Node runtime (ISR + edge OG route — a static export will not work) |
| Admin dashboard | `frontend/admin/` | Node runtime |

---

## The one thing that will bite you

Uploads (resume, certificate badges, intro video) used to be written straight
to the local filesystem. On Render, Railway, Fly-without-a-volume, or anything
serverless, **that filesystem is wiped on every deploy** — so the files vanish
and have to be re-uploaded each time.

`STORAGE_BACKEND` now decides where they go:

- `local` — writes to `UPLOAD_DIR`. Correct for development, and for a VPS
  with a real disk.
- `s3` — writes to any S3-compatible bucket. Use this anywhere the disk is
  not guaranteed.

The app logs a warning at boot if it starts in production on `local`.

---

## Free stack ($0/month)

| Piece | Platform | Free allowance |
|---|---|---|
| Website + Admin | Vercel Hobby | 100 GB bandwidth/mo |
| PostgreSQL | Neon | 0.5 GB (this project uses ~1 MB) |
| Backend API | Render free | 750 instance-hours/mo |
| Uploads | Cloudflare R2 | 10 GB storage, **no egress charges** |

**Verify current free-tier terms before committing to this** — providers have
been cutting them.

Two caveats worth knowing up front:

1. **Render free sleeps after 15 minutes idle** and takes ~50 s to wake. The
   website itself stays fast regardless: the page is prerendered and ISR keeps
   serving the last good render if revalidation fails. Only chat, the contact
   form and admin login feel the cold start. A 10-minute ping from
   UptimeRobot or cron-job.org keeps it awake and still fits in 750 hours.
2. **Vercel Hobby is non-commercial.** A personal portfolio is fine.

---

## Cloudflare R2 setup

1. Create a bucket.
2. Enable public access on it (an `r2.dev` subdomain or your own custom
   domain). R2 has no per-object ACLs — public read is a bucket-level setting,
   which is why the code never sends one.
3. Create an API token with **Object Read & Write** scoped to that bucket.
4. Set the backend variables below, and set `NEXT_PUBLIC_MEDIA_URL` on **both**
   Next.js apps to the same public URL — otherwise `next/image` refuses to load
   from that host.

---

## Environment variables

### Backend

```bash
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=            # python -c "import secrets; print(secrets.token_hex(32))"
ADMIN_PASSWORD=        # must not be the default; boot fails otherwise

DATABASE_URL=postgresql+asyncpg://user:pass@host/db   # Neon: use the POOLED string, with SSL

# JSON array, not comma-separated. Must include both deployed frontends or
# CORS blocks them.
ALLOWED_ORIGINS=["https://yourdomain.com","https://admin.yourdomain.com"]

STORAGE_BACKEND=s3
S3_BUCKET=portfolio-media
S3_ENDPOINT_URL=https://<account-id>.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=auto
S3_PUBLIC_BASE_URL=https://pub-<hash>.r2.dev    # or your custom domain
S3_PREFIX=                                      # optional folder in the bucket

OPENAI_API_KEY=
SMTP_USER=
SMTP_PASSWORD=         # Gmail App Password, not the account password
NOTIFY_EMAIL=
```

The backend refuses to boot in production with a default `SECRET_KEY`,
a default `ADMIN_PASSWORD`, `DEBUG=True`, or a half-configured `s3` block.

### Website (`frontend/website`)

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com     # canonical, OG and sitemap URLs
NEXT_PUBLIC_MEDIA_URL=https://pub-<hash>.r2.dev # only when STORAGE_BACKEND=s3
```

`.env.production` currently ships with the literal placeholder
`https://<REPLACE-yourdomain.com>`, which **fails the build**. Replace it or
set the value in the host's build environment.

### Admin (`frontend/admin`)

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_MEDIA_URL=https://pub-<hash>.r2.dev
```

---

## Order of operations

1. Create the Postgres database, run `python seed_admin.py` against it.
   `seed_data.py` **deletes every table before reseeding** — only run it on a
   fresh database, never against one with real content.
2. Create the R2 bucket and token.
3. Deploy the backend with the variables above. Check `/health`.
4. Deploy both Next.js apps. On Vercel, create two projects with root
   directories `frontend/website` and `frontend/admin`.
5. Add the deployed frontend origins to `ALLOWED_ORIGINS` and redeploy the
   backend.
6. Re-upload the resume and any certificate badges through the admin panel —
   they now land in R2 and survive future deploys.

## Running cost

Everything above is free except OpenAI, which is usage-based. Measured against
the live database: the chat context is ~3,958 tokens, so on `gpt-4o-mini` a
turn costs about **$0.0007** — roughly **$1.40 per 2,000 chats**. The chat
endpoint is rate-limited to 20 requests/hour per client, which caps abuse.

A domain is ~$12/year, or use the free `*.vercel.app` subdomain.
