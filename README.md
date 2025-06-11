# psql-db 🚀

A simple, zero-config PostgreSQL database setup for your development environment. Perfect for demos, experiments, or quick projects.

## Features

- 🚀 One-command setup
- 🔒 Data privacy guaranteed (runs locally)
- 🎯 Zero configuration required
- 🖥️ Integrated Adminer UI for database management
- 💳 No credit card required
- 🔌 Automatic environment variable setup

## Quick Start

```bash
npx psql-db
```

That's it! Your PostgreSQL database is ready to use.

## What You Get

After running the command, you'll have:

- A PostgreSQL database running on port 5433
- Database name: `app_development`
- Adminer UI available at `http://localhost:8080`
- Automatic `.env` file configuration with `DATABASE_URL`

## Connection Details

The database will be accessible with these credentials:

- Host: `localhost`
- Port: `5433`
- Database: `app_development`
- Username: `postgres`
- Password: `supersecret`

## Requirements

- Docker
- Docker Compose

## License

MIT © [Michal Pasierbski](https://github.com/mpasierbski) 