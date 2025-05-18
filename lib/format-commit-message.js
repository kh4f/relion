export default function (args) {
	const message = String(args.preset.releaseCommitMessageFormat);
	return message.replace(/{{currentTag}}/g, args.tagPrefix + args.context.version)
}
