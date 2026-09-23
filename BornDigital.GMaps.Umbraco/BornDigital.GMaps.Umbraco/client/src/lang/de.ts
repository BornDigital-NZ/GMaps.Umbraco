import type { UmbLocalizationDictionary } from '@umbraco-cms/backoffice/localization-api';

// Ported from the original Umbraco 13 langs/de-de.js file.
export default {
	gmaps: {
		geoCodeError: 'Oops! Adresse konnte nicht gefunden werden!',
		locationSet: 'Standort gesetzt auf',
		resetTxt: 'Position zurücksetzen',
		noApiKey: 'Für diesen Datentyp wurde kein Google Maps API-Schlüssel konfiguriert.',
		scriptLoadError: 'Das Google Maps-Skript konnte nicht geladen werden. Überprüfen Sie den konfigurierten API-Schlüssel.',
	},
} satisfies UmbLocalizationDictionary;
