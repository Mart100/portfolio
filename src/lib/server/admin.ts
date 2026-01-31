import fs from 'node:fs/promises';
import path from 'node:path';
import { simpleGit, type SimpleGit } from 'simple-git';
import { env } from '$env/dynamic/private';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { fail, type RequestEvent } from '@sveltejs/kit';

const execAsync = promisify(exec);
const DATA_DIR = path.resolve('src/lib/data');

/**
 * Shared SvelteKit action for admin data saving
 */
export const adminSaveAction = async ({ request }: RequestEvent) => {
	const formData = await request.formData();
	const type = formData.get('type') as string;
	const data = formData.get('data') as string;

	if (!type || !data) {
		return fail(400, { message: 'Missing type or data' });
	}

	try {
		const parsed = JSON.parse(data);
		await saveAndSync(type, parsed);
		return { success: true, type };
	} catch (error) {
		console.error('Save error:', error);
		return fail(500, { message: 'Error saving and syncing data' });
	}
};

/**
 * Handles saving data to JSON and synchronizing with Git
 */
export async function saveAndSync(type: string, data: unknown) {
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

	// 2. Git Sync (optional based on ENV)
	if (env.GIT_AUTO_SYNC === 'true') {
		try {
			const git: SimpleGit = simpleGit();

			// Check if we are in a git repo
			const isRepo = await git.checkIsRepo();
			if (isRepo) {
				// Configure remote (SSH or HTTPS)
				if (env.GIT_REMOTE_URL) {
					await git.removeRemote('origin').catch(() => {});
					await git.addRemote('origin', env.GIT_REMOTE_URL);
				}

				await git.add(filePath);
				await git.commit(`admin: update ${type} data [auto]`);

				const remotes = await git.getRemotes();
				if (remotes.length > 0) {
					const branch = (await git.branchLocal()).current;
					// Pushing in background to not block response
					git
						.push('origin', branch, { '-u': null })
						.catch((e) => console.error('Git push failed:', e));
				}
			}
		} catch (error) {
			console.error('Git synchronization failed:', error);
		}
	}

	// 3. PM2 Reload (optional based on ENV)
	if (env.PM2_RELOAD === 'true') {
		// Caution: This will skip waiting for the reload to finish to respond faster
		// but it might restart the process while Git is still pushing.
		// Since git.push() above is also backgrounded, we should be okay
		// if the VPS is fast enough or the network is stable.
		setTimeout(async () => {
			try {
				console.log('Triggering PM2 reload...');
				await execAsync('pm2 reload portfolio');
			} catch (e) {
				console.error('PM2 reload failed:', e);
			}
		}, 1000);
	}

	return { success: true };
}
