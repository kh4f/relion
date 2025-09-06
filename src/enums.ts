export enum GpgSigLabel {
	G = 'valid',
	B = 'bad',
	U = 'valid, unknown validity',
	X = 'valid, expired',
	Y = 'valid, made by expired key',
	R = 'valid, made by revoked key',
	E = 'cannot check (missing key)',
	N = 'no signature',
}

export enum RefType {
	issue = 'issue',
	pr = 'PR',
}