import { OpenAPIRoute, Query } from '@cloudflare/itty-router-openapi';
import { WorkerHeaders, GetDefaultBranch } from './common';

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
			let ret = await GetDefaultBranch(data.query.owner, data.query.repo);
			if (ret instanceof Response) {
				return ret;
			}
			data.query.branch = ret;
		}

		const url = `https://api.github.com/repos/${data.query.owner}/${data.query.repo}/git/trees/${data.query.branch}?recursive=true`;

		const resp = await fetch(url, {
			headers: {
				...WorkerHeaders,
			},
		});

		if (!resp.ok) {
			return new Response(await resp.text(), { status: resp.status });
		}

		const json = await resp.json();

		const repos = json['tree'].map((item) => ({
			path: item.path,
			type: item.type,
		}));

		return {
			repos: repos,
		};
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
					archived: false,
					disabled: false,
					fork: false,
					forks_count: 0,
					open_issues_count: 0,
					stargazers_count: 0,
					watchers_count: 0,
					size: 23,
					topics: ['chatgpt', 'chatgpt-plugin', 'cloudflare-workers'],
					license: {
						key: 'apache-2.0',
						name: 'Apache License 2.0',
						spdx_id: 'Apache-2.0',
						url: 'https://api.github.com/licenses/apache-2.0',
						node_id: 'MDc6TGljZW5zZTI=',
					},
					pushed_at: '2023-12-02T16:02:38Z',
					created_at: '2023-12-02T13:15:22Z',
					updated_at: '2023-12-02T16:04:30Z',
				},
			},
		},
	};

	async handle(request, env, ctx, data) {
		// Get the default branch name if not specified
		if (!data.query.branch) {
			let ret = await GetDefaultBranch(data.query.owner, data.query.repo);
			if (ret instanceof Response) {
				return ret;
			}
			data.query.branch = ret;
		}

		const url = `https://api.github.com/repos/${data.query.owner}/${data.query.repo}`;

		const resp = await fetch(url, {
			headers: {
				...WorkerHeaders,
			},
		});

		if (!resp.ok) {
			return new Response(await resp.text(), { status: resp.status });
		}

		const json = await resp.json();

		return {
			description: json.description,
			default_branch: json.default_branch,
			archived: json.archived,
			disabled: json.disabled,
			fork: json.fork,
			forks_count: json.forks_count,
			open_issues_count: json.open_issues_count,
			stargazers_count: json.stargazers_count,
			watchers_count: json.watchers_count,
			size: json.size,
			topics: json.topics,
			license: json.license,
			pushed_at: json.pushed_at,
			created_at: json.created_at,
			updated_at: json.updated_at,
		};
	}
}
