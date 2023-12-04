import { OpenAPIRoute, Query } from '@cloudflare/itty-router-openapi';
import { GetDefaultBranch, GetOctokit } from './common';

export class GetRepoTree extends OpenAPIRoute {
	static schema = {
		tags: ['Repo'],
		summary: 'recursively get the tree of a repository',
		parameters: {
			owner: Query(String, {
				description: 'owner of the repository',
				default: 'Nativu5',
			}),
			repo: Query(String, {
				description: 'name of the repository',
				default: 'RepoMate',
			}),
			branch: Query(String, {
				description: 'branch name of the repository; if not specified, the default branch will be used',
				required: false,
			}),
		},
		responses: {
			200: {
				description: 'repository structure in the tree format',
				schema: {
					tree: [
						{
							path: 'src/index.js',
							type: 'tree',
						},
					],
				},
			},
		},
	};

	async handle(request, env, ctx, data) {
		// Get the default branch name if not specified
		if (!data.query.branch) {
			const defaultBranch = await GetDefaultBranch(data.query.owner, data.query.repo);
			if (!defaultBranch) {
				return new Response('Failed to get the default branch', { status: 400 });
			}
			data.query.branch = defaultBranch;
		}

		try {
			const resp = await GetOctokit().request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
				owner: data.query.owner,
				repo: data.query.repo,
				tree_sha: data.query.branch,
				recursive: true,
			});
			return resp.data.tree.map(({ path, type }) => ({ path, type }));
		} catch (err) {
			return new Response(err.message, { status: err.status });
		}
	}
}

export class GetRepoMeta extends OpenAPIRoute {
	static schema = {
		tags: ['Repo'],
		summary: 'get the metadata of a repository',
		parameters: {
			owner: Query(String, {
				description: 'owner of the repository',
				default: 'Nativu5',
			}),
			repo: Query(String, {
				description: 'name of the repository',
				default: 'RepoMate',
			}),
		},
		responses: {
			200: {
				description: 'Metadata of the repository',
				schema: {
					description: 'ChatGPT Plugin/Action that searches and accesses GitHub repositories. ',
					default_branch: 'master',
					size: 23,
					topics: ['chatgpt', 'chatgpt-plugin', 'cloudflare-workers'],
				},
			},
		},
	};

	async handle(request, env, ctx, data) {
		const interested = [
			'description',
			'default_branch',
			'archived',
			'disabled',
			'fork',
			'forks_count',
			'open_issues_count',
			'stargazers_count',
			'watchers_count',
			'size',
			'topics',
			'license',
			'pushed_at',
			'created_at',
			'updated_at',
		];

		try {
			const resp = await GetOctokit().rest.repos.get({
				owner: data.query.owner,
				repo: data.query.repo,
			});

			return Object.fromEntries(Object.entries(resp.data).filter(([key]) => interested.includes(key)));
		} catch (err) {
			return new Response(err.message, { status: err.status });
		}
	}
}
