# Google Maps Umbraco Editor Plugin

Umbraco 17+ editor plugin with Google Maps display for storing coordinates as latitude,longitude.

![NuGet Version](https://img.shields.io/nuget/v/BornDigital.GMaps.Umbraco)

Functionality:

- Address lookup with autocomplete
- Map display with draggable marker
- Location stored as `latitude,longitude`
- Property Value Converter returning strongly typed `GMapsLocation` with `Latitude` and `Longitude` properties

Please note: we recommend using [Our.Umbraco.GMaps](https://www.nuget.org/packages/Our.Umbraco.GMaps/) for new implementations.  
This plugin is mainly maintained for upgrading projects using an implementation based on the Umbraco 7 plugin `Netaddicts.GMaps`.

![Maps editor with address lookup autocomplete](https://raw.githubusercontent.com/BornDigital-NZ/GMaps.Umbraco/refs/heads/main/docs/images/editor-address-lookup.png)

![Maps editor](https://raw.githubusercontent.com/BornDigital-NZ/GMaps.Umbraco/refs/heads/main/docs/images/editor-located.png)

## Requirements

- Umbraco 17+
- Google Maps API key

## Installation

### NuGet package installation

Install the NuGet package `BornDigital.GMaps.Umbraco` either from the NuGet Package Manager or the command line:  
`dotnet add package BornDigital.GMaps.Umbraco`

### Create Google Maps API key

1. Create your Google Maps API key in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API

### Create property editor

1. In the Umbraco backoffice, go to **Settings > Data Types** and click **Create**.
2. Enter a name for the new data type, e.g. "Google Maps Editor".
3. Populate the Google Maps API key, default location and default zoom level.

![Data Type Configuration](https://raw.githubusercontent.com/BornDigital-NZ/GMaps.Umbraco/refs/heads/main/docs/images/data-type.png)

## Acknowledgements

Originally based on the Umbraco 7 plugin [Netaddicts.GMaps](https://www.nuget.org/packages/umbraco-v7-property-editors-gmaps).
