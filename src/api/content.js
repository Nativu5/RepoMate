import { OpenAPIRoute, Query } from '@cloudflare/itty-router-openapi';
import { GetOctokit } from './common';

export class GetContentSingle extends OpenAPIRoute {
	static schema = {
		tags: ['Content'],
		summary: 'Get content of a single file in the repository',
		parameters: {
			owner: Query(String, {
				description: 'owner of the repository',
			}),
			repo: Query(String, {
				description: 'name of the repository',
			}),
			branch: Query(String, {
				description: 'branch name of the repository; blank for default',
				required: false,
			}),
			path: Query(String, {
				description: 'path of the file',
			}),
		},
		responses: {
			200: {
				description: 'single file content for the given path',
				schema: {
					content: 'console.log("Hello World!")',
				},
			},
		},
	};

	async handle(request, env, ctx, data) {
		try {
			const resp = await GetOctokit(env).rest.repos.getContent({
				owner: data.query.owner,
				repo: data.query.repo,
				path: data.query.path,
				ref: data.query.branch,
				mediaType: {
					format: 'raw',
				},
			});

			// TODO: Add support for folders.
			return {
				content: resp.data,
			};
		} catch (err) {
			return new Response(err.message, { status: err.status });
		}
	}
}

export class GetContentBatch extends OpenAPIRoute {
	static schema = {
		tags: ['Content'],
		summary: 'Get content of a batch of files in the repository',
		parameters: {
			owner: Query(String, {
				description: 'owner of the repository',
			}),
			repo: Query(String, {
				description: 'name of the repository',
			}),
			branch: Query(String, {
				description: 'branch name of the repository; blank for default',
				required: false,
			}),
			pathlist: Query(String, {
				description: 'path list of the files(commas separated, e.g. `file1,file2`)',
			}),
		},
		responses: {
			200: {
				description: 'file contents. `[ERR]` begined string means failure in retrieving. ',
				schema: {
					contents: [
						{
							path: 'README.md',
							content: 'Here is the README.',
						},
						{
							path: 'src/index.js',
							content: 'console.log("Hello World!")',
						},
					],
				},
			},
		},
	};

	async handle(request, env, ctx, data) {
		const paths = data.query.pathlist.split(',');
		const fileContents = [];

		for (let path of paths) {
			path = path.trim();

			try {
				const resp = await GetOctokit(env).rest.repos.getContent({
					owner: data.query.owner,
					repo: data.query.repo,
					path: path,
					ref: data.query.branch,
					mediaType: {
						format: 'raw',
					},
				});

				fileContents.push({
					path: path,
					content: resp.data,
				});
			} catch (err) {
				fileContents.push({
					path: path,
					content: `[ERR] ${err.message} (${err.status})`,
				});
			}
		}

		return {
			contents: fileContents,
		};
	}
}
