/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
	locales: ["en", "ar"],
	catalogs: [
		{
			path: "<rootDir>/locale/locales/{locale}/messages",
			include: ["app", "components"],
		},
	],
	format: "po",
};
