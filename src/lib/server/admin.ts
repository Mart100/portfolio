import fs from 'node:fs/promises';
import path from 'node:path';
import { simpleGit, type SimpleGit } from 'simple-git';
import { GIT_AUTO_SYNC, GIT_REMOTE_URL } from '$env/static/private';
import { invalidateCache } from './data';
import { fail, type RequestEvent } from '@sveltejs/kit';

const DATA_DIR = path.resolve('src/lib/data');

/**
 * Shared SvelteKit action for admin data saving
 */
export const adminSaveAction = async ({ request }: RequestEvent) => {
	const formData = await request.formData();
	const type = formData.get('type') as string;
	const data = formData.get('data') as string;
	const commitMsg = formData.get('message') as string;

	if (!type || !data) {
		return fail(400, { message: 'Missing type or data' });
	}

	try {
		const parsed = JSON.parse(data);
		await saveAndSync(type, parsed, commitMsg);
		return { success: true, type };
	} catch (error) {
		console.error('Save error:', error);
		return fail(500, { message: 'Error saving and syncing data' });
	}
};

/**
 * Handles saving data to JSON and synchronizing with Git
 */
export async function saveAndSync(type: string, data: unknown, commitMsg?: string) {
	// Security: Prevent directory traversal
	const sanitizedType = type.replace(/[^a-zA-Z0-9_-]/g, '');
	const filePath = path.join(DATA_DIR, `${sanitizedType}.json`);

	// Ensure the file is actually inside DATA_DIR
	if (!filePath.startsWith(DATA_DIR)) {
		throw new Error('Invalid data type path');
	}

	const jsonContent = JSON.stringify(data, null, '\t');

	// 1. Write the file locally
	await fs.writeFile(filePath, jsonContent, 'utf-8');

	console.log(`Data for type "${type}" saved to ${filePath}`);

	// 2. Invalidate in-memory cache
	invalidateCache(sanitizedType);

	// 3. Git Sync (optional based on ENV)
	if (GIT_AUTO_SYNC === 'true') {
		console.log(`Starting Git auto-sync for ${type}...`);
		try {
			const git: SimpleGit = simpleGit();

			// Check if we are in a git repo
			const isRepo = await git.checkIsRepo();
			if (isRepo) {
				// Configure remote (SSH or HTTPS)
				if (GIT_REMOTE_URL) {
					const remotes = await git.getRemotes(true);
					const origin = remotes.find((r) => r.name === 'origin');
					if (!origin || origin.refs.push !== GIT_REMOTE_URL) {
						console.log(`Configuring Git remote to: ${GIT_REMOTE_URL}`);
						await git.removeRemote('origin').catch(() => {});
						await git.addRemote('origin', GIT_REMOTE_URL);
					}
				}

				console.log(`Adding ${filePath} to index...`);
				await git.add(filePath);

				const commitMessage = commitMsg
					? `admin: ${commitMsg} [auto]`
					: `admin: update ${type} data [auto]`;
				console.log(`Committing changes: "${commitMessage}"`);
				const commitResult = await git.commit(commitMessage);

				if (commitResult.commit) {
					console.log(`Commit successful: [${commitResult.commit.slice(0, 7)}]`);
					const branch = (await git.branchLocal()).current;
					console.log(`Pushing branch "${branch}" to origin...`);

					// Push in background to not block response (no PM2 reload to terminate it now)
					git
						.push('origin', branch, { '-u': null })
						.then(() => {
							console.log(`Git push successful to "${branch}"`);
						})
						.catch((e) => {
							console.error('Git push failed ERROR details:', e.message);
						});
				} else {
					console.log('No changes detected since last sync, or commit skipped.');
				}
			} else {
				console.warn('Current directory is not a Git repository. Skipping sync.');
			}
		} catch (error) {
			console.error('Git synchronization sequence failed:', error);
		}
	} else {
		console.log('Git auto-sync is disabled (GIT_AUTO_SYNC !== true)');
	}

	return { success: true };
}
