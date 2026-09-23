import type { UmbLocalizationDictionary } from '@umbraco-cms/backoffice/localization-api';

export default {
	gmaps: {
		geoCodeError: 'Oops! Having trouble geocoding the specified address. Please try again.',
		locationSet: 'Location set to',
		resetTxt: 'Reset position',
		noApiKey: 'No Google Maps API key has been configured for this Data Type.',
		scriptLoadError: 'Failed to load the Google Maps script. Check the configured API key.',
	},
} satisfies UmbLocalizationDictionary;
