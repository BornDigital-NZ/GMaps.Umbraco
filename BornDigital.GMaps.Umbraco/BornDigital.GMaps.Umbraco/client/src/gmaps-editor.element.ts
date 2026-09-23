import { html, css, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbPropertyEditorConfigCollection, UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';

declare global {
	interface Window {
		google: any;
	}
}

// Search zoom level after a lookup or when a stored value already has a position, mirrors the original plugin.
const SEARCH_ZOOM_LEVEL = 15;

let googleMapsLoadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
	if ((window as any).google?.maps) {
		return Promise.resolve();
	}

	if (!googleMapsLoadPromise) {
		googleMapsLoadPromise = new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
			script.async = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Failed to load the Google Maps script.'));
			document.head.appendChild(script);
		});
	}

	return googleMapsLoadPromise;
}

@customElement('bd-gmaps-editor')
export default class BdGMapsEditorElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property({ type: String })
	public value = '';

	@state()
	private _formattedAddress = '';

	@state()
	private _errorMessage = '';

	@state()
	private _mapReady = false;

	#apiKey = '';
	#defaultLat = 51.0441581;
	#defaultLng = 3.4609621;
	#defaultZoom = 15;

	#map: any;
	#marker: any;
	#geocoder: any;
	#autocomplete: any;
	#scriptLoadPromise?: Promise<void>;

	@property({ attribute: false })
	public set config(config: UmbPropertyEditorConfigCollection) {
		this.#apiKey = (config.getValueByAlias('key') as string) || '';
		this.#defaultLat = parseFloat((config.getValueByAlias('lat') as string) || '') || this.#defaultLat;
		this.#defaultLng = parseFloat((config.getValueByAlias('lng') as string) || '') || this.#defaultLng;
		this.#defaultZoom = parseInt((config.getValueByAlias('zoomlevel') as string) || '', 10) || this.#defaultZoom;
	}

	override connectedCallback() {
		super.connectedCallback();

		if (!this.#apiKey) {
			this._errorMessage = this.localize.term('gmaps_noApiKey');
			return;
		}

		this.#scriptLoadPromise = loadGoogleMapsScript(this.#apiKey);
	}

	override firstUpdated() {
		this.#scriptLoadPromise
			?.then(() => this.#initializeMap())
			.catch(() => {
				this._errorMessage = this.localize.term('gmaps_scriptLoadError');
			});
	}

	#initializeMap() {
		const mapElement = this.renderRoot.querySelector<HTMLDivElement>('#map');
		const lookupElement = this.renderRoot.querySelector<HTMLInputElement>('#lookup');
		if (!mapElement || !lookupElement) return;

		const google = (window as any).google;
		const [storedLat, storedLng] = this.#parseValue();
		const hasStoredPosition = storedLat !== undefined && storedLng !== undefined;
		const center = hasStoredPosition
			? new google.maps.LatLng(storedLat, storedLng)
			: new google.maps.LatLng(this.#defaultLat, this.#defaultLng);

		this.#geocoder = new google.maps.Geocoder();
		this.#map = new google.maps.Map(mapElement, {
			zoom: this.#defaultZoom,
			center,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		});

		if (hasStoredPosition) {
			this.#placeMarker(center);
			this.#map.setZoom(SEARCH_ZOOM_LEVEL);
			this.#map.panTo(center);
			this.#lookupPosition(center);
		}

		this.#autocomplete = new google.maps.places.Autocomplete(lookupElement, {});
		this.#autocomplete.addListener('place_changed', () => this.#onPlaceChanged());

		this._mapReady = true;
	}

	#parseValue(): [number, number] | [undefined, undefined] {
		if (!this.value) return [undefined, undefined];
		const parts = this.value.split(',');
		if (parts.length !== 2) return [undefined, undefined];
		const lat = parseFloat(parts[0]);
		const lng = parseFloat(parts[1]);
		if (Number.isNaN(lat) || Number.isNaN(lng)) return [undefined, undefined];
		return [lat, lng];
	}

	#placeMarker(position: any) {
		const google = (window as any).google;
		if (this.#marker) {
			this.#marker.setMap(null);
		}
		this.#marker = new google.maps.Marker({
			map: this.#map,
			position,
			draggable: true,
		});
		this.#marker.addListener('dragend', () => this.#lookupPosition(this.#marker.getPosition()));
	}

	#onPlaceChanged() {
		const place = this.#autocomplete.getPlace();
		const location = place?.geometry?.location;
		if (!location) return;

		this.#placeMarker(location);
		this.#map.setCenter(location);
		this.#map.setZoom(SEARCH_ZOOM_LEVEL);
		this.#map.panTo(location);
		this.#lookupPosition(location);
	}

	#onReset() {
		const google = (window as any).google;
		const defaultLatLng = new google.maps.LatLng(this.#defaultLat, this.#defaultLng);
		this.#map.setZoom(this.#defaultZoom);
		this.#map.setCenter(defaultLatLng);
		this.#placeMarker(defaultLatLng);
		this.#lookupPosition(defaultLatLng);
	}

	#lookupPosition(latLng: any) {
		const google = (window as any).google;
		this.#geocoder.geocode({ location: latLng }, (results: any[], status: string) => {
			if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
				const lat = this.#marker.getPosition().lat();
				const lng = this.#marker.getPosition().lng();
				this.value = `${lat},${lng}`;
				this._formattedAddress = `${this.localize.term('gmaps_locationSet')}: ${results[0].formatted_address} (${lat}, ${lng})`;
				this._errorMessage = '';
				this.dispatchEvent(new UmbChangeEvent());
			} else {
				this._errorMessage = this.localize.term('gmaps_geoCodeError');
			}
		});
	}

	override render() {
		return html`
			<div class="wrapper">
				<input id="lookup" type="text" class="lookup" placeholder="Search for an address" />
				<div id="map" class="map"></div>
				${this._formattedAddress ? html`<div class="address">${this._formattedAddress}</div>` : ''}
				${this._errorMessage ? html`<div class="error">${this._errorMessage}</div>` : ''}
				<uui-button
					look="secondary"
					label=${this.localize.term('gmaps_resetTxt')}
					?disabled=${!this._mapReady}
					@click=${this.#onReset}
				>${this.localize.term('gmaps_resetTxt')}</uui-button>
			</div>
		`;
	}

	static override readonly styles = [
		UmbTextStyles,
		css`
			.wrapper {
				display: flex;
				flex-direction: column;
				gap: 9px;
			}
			.lookup {
				width: 100%;
				box-sizing: border-box;
				padding: 6px;
			}
			.map {
				width: 100%;
				height: 300px;
			}
			.address {
				font-size: 0.9em;
			}
			.error {
				color: var(--uui-color-danger, #d42054);
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'bd-gmaps-editor': BdGMapsEditorElement;
	}
}
