#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const chalk = require("chalk").default;
const dedent = require("dedent");

const log = console.log;

/**
 * Sets up a PostgreSQL database using Docker Compose.
 * Copies the docker-compose template file and starts the container in detached mode.
 *
 * @returns {Object} An object containing the database port configuration
 * @property {number} port - The port number the PostgreSQL database is running on (5432)
 * @property {string} databaseName - The name of the database to create (app_development)
 * @property {string} databaseUrl - The URL of the database to connect to
 * @throws {Error} If there's an error running docker compose
 */
function setupDockerCompose() {
  const templatePath = path.join(__dirname, "../templates/docker-compose.yml");
  const port = 5433;
  const databaseName = "app_development";
  const databaseUrl = `postgresql://postgres:supersecret@localhost:${port}/${databaseName}`;

  fs.copyFileSync(templatePath, "./docker-compose.psql-db.yml");

  try {
    execSync("docker compose -f docker-compose.psql-db.yml up -d", {
      stdio: "inherit",
    });
    log();

    return {
      port,
      databaseName,
      databaseUrl,
    };
  } catch (error) {
    log(chalk.red("✘") + " Error running docker compose:", error.message);
    process.exit(1);
  }
}

function addEnvVars({ databaseUrl }) {
  const envPath = path.join(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    log(chalk.green("✔") + " .env file created");
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  const envVars = envContent.split("\n").reduce((acc, line) => {
    // Ignore comments
    if (line.trim().startsWith("#")) {
      return acc;
    }

    const [key, value] = line.trim().split("=");
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});

  if (envVars.DATABASE_URL) {
    if (envVars.DATABASE_URL !== databaseUrl) {
      log(chalk.red("✘") + " DATABASE_URL is set to a different value");
    } else {
      log(chalk.green("✔") + " DATABASE_URL already exists in .env file");
    }
  } else {
    fs.appendFileSync(envPath, `\nDATABASE_URL=${databaseUrl}\n`);
    log(chalk.green("✔") + " DATABASE_URL added to .env file");
  }
}

function printBanner() {
  const banner = chalk.cyanBright.bold(`\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃           🚀 PostgreSQL Dev Environment 🚀           ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`);
  log(banner);
}

function printSuccess({ port, databaseName, databaseUrl }) {
  const divider = chalk.gray("──────────────────────────────────────────────────────");
  log(divider);
  log(chalk.greenBright.bold("✔ Database Environment Ready!\n"));
  log(
    `${chalk.bold("📦 Database Name:")}      ${chalk.yellow(databaseName)}`
  );
  log(
    `${chalk.bold("🔌 Port:")}               ${chalk.yellow(port)}`
  );
  log(
    `${chalk.bold("🔗 Connection URL:")}     ${chalk.blueBright.underline(databaseUrl)}`
  );
  log(
    `${chalk.bold("🛠️  Adminer UI:")}         ${chalk.magentaBright.underline(
      `http://localhost:8080?pgsql=db&username=postgres&db=${databaseName}`
    )}`
  );
  log(divider);
  log(
    chalk.gray(
      "Tip: Use the above connection URL in your app or database client.\n"
    )
  );
}

function main() {
  printBanner();
  const { port, databaseName, databaseUrl } = setupDockerCompose();
  addEnvVars({ port, databaseName, databaseUrl });
  printSuccess({ port, databaseName, databaseUrl });
}

main();
