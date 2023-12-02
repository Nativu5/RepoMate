import { OpenAPIRoute, Query } from '@cloudflare/itty-router-openapi';
import { WorkerHeaders, GetDefaultBranch } from './common';

export class GetTree extends OpenAPIRoute {
	static schema = {
		tags: ['Tree'],
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
