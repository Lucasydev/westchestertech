# WestchesterTech.org

A countywide tech hub for Westchester high school students. Browse local events, read student innovation stories, discover clubs, and express interest in the hackathon, mentoring, or sponsorship.

## Run locally

From the repository root, run `python serve.py` with Python 3. On Windows, `py serve.py` also works. Open [the local site](http://127.0.0.1:4177) and press Ctrl+C when finished.

The local server saves form submissions in `data/interests.sqlite3`. Run `python serve.py interests` to read them on the organizer's computer. The hosted site stores submissions in Cloudflare D1. Submitting again with the same email and role updates the existing entry.

## Connect GitHub in the Cloudflare dashboard

The source repository is [Lucasydev/westchestertech](https://github.com/Lucasydev/westchestertech). Upload the extracted project at its root before importing it.

1. In your Cloudflare account, create a D1 database named `westchestertech-interests` and copy its database ID.
2. Open **Workers & Pages**, select **Create application**, choose **GitHub**, and grant access to the `westchestertech` repository.
3. Select the repository and the `main` branch. Use the Worker name `westchestertech`, leave the root directory at the repository root, and enter `npm run build` as the build command and `npm run deploy` as the production deploy command.
4. Under **Build variables and secrets**, set `CLOUDFLARE_D1_DATABASE_ID` to the copied ID. The deployment token needs permission to deploy the Worker and apply D1 migrations.
5. Select **Save and Deploy**. After the app works at its assigned `workers.dev` address, attach `westchestertech.org` under the Worker's **Settings**, **Domains & Routes**, **Add**, **Custom Domain**.

Department or student edits to listings go in `public/content.js`. People with write access to the GitHub repository can change source code.

## Manual release with GitHub Actions

1. Put these project files at the root of a GitHub repository on its default branch. Include `.github/workflows/deploy.yml`. If you are uploading from the ZIP, extract the files first.
2. In the Cloudflare dashboard, select your account, choose its `workers.dev` subdomain under **Workers & Pages**, and create a D1 database named `westchestertech-interests`. Copy the account ID and the database UUID.
3. Create a Cloudflare API token scoped to that account. Give it **D1 Write** so it can apply migrations. To create the `westchestertech` Worker on the first run, grant the **Workers Admin** product role. If that Worker already exists, the **Workers Editor** role scoped to it is sufficient. [Cloudflare Worker roles](https://developers.cloudflare.com/workers/authorization/)
4. In the GitHub repository, open **Settings → Secrets and variables → Actions**. Add the settings below.
5. Open **Actions → Deploy WestchesterTech → Run workflow** and choose your release branch. The workflow checks the bundle, applies pending D1 migrations, and publishes the Worker. Open the `workers.dev` URL in the final step's log. Run it again whenever you want to release changes.

| GitHub setting | Name | Value |
| --- | --- | --- |
| Repository secret | `CLOUDFLARE_API_TOKEN` | The scoped Cloudflare API token |
| Repository secret | `CLOUDFLARE_ACCOUNT_ID` | The Cloudflare account ID |
| Repository variable | `CLOUDFLARE_D1_DATABASE_ID` | The D1 database UUID |

The public address follows `https://westchestertech.<your-subdomain>.workers.dev`. The `westchesterTech.org` domain can be connected separately once you control it. Organizers with Cloudflare database access can open **D1 → westchestertech-interests → Studio → interests** to view responses.

## Edit and build

Edit listings and organizer links in `public/content.js`. The homepage, styles, and interactions are in `public/index.html`, `public/site.css`, and `public/site.js`.

Run `node build.mjs` with Node.js 22 or newer to bundle the site into `dist/server/index.js`. The build uses Node's standard library. For Cloudflare, the workflow supplies the database UUID to `node cloudflare-config.mjs`, which writes `dist/wrangler.json` and binds the database to `DB`. SQL migrations live in `drizzle/`. [Cloudflare D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)
