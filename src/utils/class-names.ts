export default function classNames(...names: any[]): string {
	return names
		.filter(Boolean)
		.map(arg => {
			if (Array.isArray(arg)) {
				return classNames(...arg);
			}
			if (typeof arg === 'object') {
				return Object.keys(arg)
					.map((key, idx) => arg[idx] || (arg[key] && key) || null)
					.filter(el => el !== null)
					.join(' ');
			}

			return arg;
		})
		.filter(Boolean)
		.join(' ');
}
