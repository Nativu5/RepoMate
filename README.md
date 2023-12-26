# RepoMate - ChatGPT Plugin for GitHub Repos

RepoMate is a [ChatGPT](https://chat.openai.com/) Plugin/Action for accessing and searching GitHub Repositories.

## Try it out

You could try it out right [here](https://chat.openai.com/g/g-79oAnRCwm-repomate) (ChatGPT Plus required).

If you don't have a ChatGPT Plus subscription, please read about [Assistants API](https://platform.openai.com/docs/assistants/tools/function-calling) and use `https://repo-mate.api.naiv.fun` as your Assistant API endpoint.

> 注意：现已支持百度[文心一言](https://yiyan.baidu.com/)，可通过[邀请链接](https://yiyan.baidu.com/inviteTest?inviteCode=OmRbbMe8Dgm0)加入测试。

## Deploy yourself

0. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
1. Install [wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update), the Cloudflare Workers CLI.
2. Clone this project in any development environment and install dependencies with `npm install`.
3. Run `wrangler login` to login to your Cloudflare account in wrangler.
4. Run `wrangler deploy` to publish the plugin to Cloudflare Workers.

## Features

- Search repositories
- Fetch repository metadata
- Fetch the tree structure of the repository
- Fetch content of files in the repository

**TODO:**

- [x] Replace `fetch` with [Octokit.js](https://github.com/octokit/octokit.js/#readme).
- [x] Add support for shipping with GitHub Personal Token.
- [ ] Add optional authentication.
