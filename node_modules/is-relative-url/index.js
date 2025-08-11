import isAbsoluteUrl from 'is-absolute-url';

export default function isRelativeUrl(url) {
	return !isAbsoluteUrl(url);
}
