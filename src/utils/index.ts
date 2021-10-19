import { join } from 'path';
import { readFileSync } from 'fs';

export function readFile(path: string[] | string): string {
	const parts = typeof path === 'string' ? [path] : path;
	const filePath = join(...parts);
	return readFileSync(filePath, 'utf-8');
}