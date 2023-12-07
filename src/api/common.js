import { Octokit, RequestError } from 'octokit';

export const GetOctokit = (env) =>
	new Octokit({
		userAgent: 'RepoMate - ChatGPT Plugin',
		auth: env.GITHUB_TOKEN,
	});

export async function GetDefaultBranch(env, owner, repo) {
	const octokit = GetOctokit(env);
	try {
		const resp = await octokit.rest.repos.get({
			owner: owner,
			repo: repo,
		});

		return resp.data.default_branch;
	} catch (err) {
		if (err instanceof RequestError) {
			console.log(err);
			return null;
		} else {
			throw err;
		}
	}
}
