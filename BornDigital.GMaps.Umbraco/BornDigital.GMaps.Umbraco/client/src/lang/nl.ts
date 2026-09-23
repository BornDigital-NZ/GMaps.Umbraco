import type { UmbLocalizationDictionary } from '@umbraco-cms/backoffice/localization-api';

// Ported from the original Umbraco 13 langs/nl-nl.js file.
export default {
	gmaps: {
		geoCodeError: 'Oeps! De locatie van het adres kan momenteel niet opgezocht worden!',
		locationSet: 'Locatie ingesteld op',
		resetTxt: 'Positie resetten',
		noApiKey: 'Er is geen Google Maps API-sleutel geconfigureerd voor dit gegevenstype.',
		scriptLoadError: 'Het Google Maps-script kon niet worden geladen. Controleer de geconfigureerde API-sleutel.',
	},
} satisfies UmbLocalizationDictionary;
