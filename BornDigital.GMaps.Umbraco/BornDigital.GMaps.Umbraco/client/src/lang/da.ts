import type { UmbLocalizationDictionary } from '@umbraco-cms/backoffice/localization-api';

// Ported from the original Umbraco 13 langs/da-dk.js file.
export default {
	gmaps: {
		geoCodeError: 'Ups! Der var et problem med at finde adressen! Prøv venligst igen.',
		locationSet: 'Adresse sat til',
		resetTxt: 'Nulstil position',
		noApiKey: 'Der er ikke konfigureret en Google Maps API-nøgle for denne datatype.',
		scriptLoadError: 'Kunne ikke indlæse Google Maps-scriptet. Kontrollér den konfigurerede API-nøgle.',
	},
} satisfies UmbLocalizationDictionary;
