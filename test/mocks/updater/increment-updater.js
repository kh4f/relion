export function readVersion(contents) {
	return Number.parseInt(contents);
}

export function writeVersion(contents) {
	return readVersion(contents) + 1;
}
