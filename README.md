# RepoMate - ChatGPT Plugin for GitHub Repos

RepoMate is a [ChatGPT](https://chat.openai.com/) Plugin/Action for accessing and searching GitHub Repostories.

## Try it out

You could try it out right with `repo-mate.api.naiv.fun` in a minute.

Please read about [ChatGPT Action](https://platform.openai.com/docs/actions) (if on ChatGPT Plus) or [Assistants API](https://platform.openai.com/docs/assistants/tools/function-calling) (if using API), to utilize this online demo.

## Get started

0. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
1. Install [wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update), the Cloudflare Workers CLI.
2. Clone this project in any development environment and install dependencies with `npm install`.
3. Run `wrangler login` to login to your Cloudflare account in wrangler.
4. Run `wrangler deploy` to publish the plugin to Cloudflare Workers.

## Features

* Search repositories
* Fetch repository metadata
* Fetch the tree structure of the repository
* Fetch content of files in the repository

**TODO:**
* Replace `fetch` with [Octokit.js](https://github.com/octokit/octokit.js/#readme).
* Add support for shipping with GitHub Personal Token.
* Add optional authentication.
