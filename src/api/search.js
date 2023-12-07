import { GetOctokit } from './common';
import { OpenAPIRoute, Query } from '@cloudflare/itty-router-openapi';

export class GetSearch extends OpenAPIRoute {
	static schema = {
		tags: ['Search'],
		summary: 'Search repositories by a query parameter',
		parameters: {
			query: Query(String, {
				description: 'The query to search for',
				default: 'RepoMate',
			}),
		},
		responses: {
			200: {
				description: 'search results for the given query',
				schema: {
					repos: [
						{
							name: 'RepoMate',
							description: 'ChatGPT Plugin/Action that could search and access GitHub repositories.',
							stars: 0,
							url: 'https://github.com/Nativu5/RepoMate',
						},
					],
				},
			},
		},
	};

	async handle(request, env, ctx, data) {
		try {
			const resp = await GetOctokit(env).rest.search.repos({
				q: data.query.query,
			});

			return {
				repos: resp.data.items.map((item) => ({
					name: item.name,
					description: item.description,
					stars: item.stargazers_count,
					url: item.html_url,
					topics: item.topics,
				})),
			};
		} catch (err) {
			return new Response(err.message, { status: err.status });
		}
	}
}
