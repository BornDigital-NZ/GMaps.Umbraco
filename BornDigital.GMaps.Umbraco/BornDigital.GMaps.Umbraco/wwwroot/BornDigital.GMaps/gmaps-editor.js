import { css as e, customElement as t, html as n, property as r, state as i } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as a } from "@umbraco-cms/backoffice/lit-element";
import { UmbChangeEvent as o } from "@umbraco-cms/backoffice/event";
import { UmbTextStyles as s } from "@umbraco-cms/backoffice/style";
//#region \0@oxc-project+runtime@0.150.0/helpers/esm/decorate.js
function c(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/gmaps-editor.element.ts
var l = 15, u = null;
function d(e) {
	return window.google?.maps ? Promise.resolve() : (u ||= new Promise((t, n) => {
		let r = document.createElement("script");
		r.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(e)}&libraries=places`, r.async = !0, r.onload = () => t(), r.onerror = () => n(/* @__PURE__ */ Error("Failed to load the Google Maps script.")), document.head.appendChild(r);
	}), u);
}
var f = class extends a {
	constructor(...e) {
		super(...e), this.value = "", this._formattedAddress = "", this._errorMessage = "", this._mapReady = !1, this.#e = "", this.#t = 51.0441581, this.#n = 3.4609621, this.#r = 15;
	}
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	#c;
	set config(e) {
		this.#e = e.getValueByAlias("key") || "", this.#t = parseFloat(e.getValueByAlias("lat") || "") || this.#t, this.#n = parseFloat(e.getValueByAlias("lng") || "") || this.#n, this.#r = parseInt(e.getValueByAlias("zoomlevel") || "", 10) || this.#r;
	}
	connectedCallback() {
		if (super.connectedCallback(), !this.#e) {
			this._errorMessage = this.localize.term("gmaps_noApiKey");
			return;
		}
		this.#c = d(this.#e);
	}
	firstUpdated() {
		this.#c?.then(() => this.#l()).catch(() => {
			this._errorMessage = this.localize.term("gmaps_scriptLoadError");
		});
	}
	#l() {
		let e = this.renderRoot.querySelector("#map"), t = this.renderRoot.querySelector("#lookup");
		if (!e || !t) return;
		let n = window.google, [r, i] = this.#u(), a = r !== void 0 && i !== void 0, o = a ? new n.maps.LatLng(r, i) : new n.maps.LatLng(this.#t, this.#n);
		this.#o = new n.maps.Geocoder(), this.#i = new n.maps.Map(e, {
			zoom: this.#r,
			center: o,
			mapTypeId: n.maps.MapTypeId.ROADMAP
		}), a && (this.#d(o), this.#i.setZoom(l), this.#i.panTo(o), this.#m(o)), this.#s = new n.maps.places.Autocomplete(t, {}), this.#s.addListener("place_changed", () => this.#f()), this._mapReady = !0;
	}
	#u() {
		if (!this.value) return [void 0, void 0];
		let e = this.value.split(",");
		if (e.length !== 2) return [void 0, void 0];
		let t = parseFloat(e[0]), n = parseFloat(e[1]);
		return Number.isNaN(t) || Number.isNaN(n) ? [void 0, void 0] : [t, n];
	}
	#d(e) {
		let t = window.google;
		this.#a && this.#a.setMap(null), this.#a = new t.maps.Marker({
			map: this.#i,
			position: e,
			draggable: !0
		}), this.#a.addListener("dragend", () => this.#m(this.#a.getPosition()));
	}
	#f() {
		let e = this.#s.getPlace()?.geometry?.location;
		e && (this.#d(e), this.#i.setCenter(e), this.#i.setZoom(l), this.#i.panTo(e), this.#m(e));
	}
	#p() {
		let e = new window.google.maps.LatLng(this.#t, this.#n);
		this.#i.setZoom(this.#r), this.#i.setCenter(e), this.#d(e), this.#m(e);
	}
	#m(e) {
		let t = window.google;
		this.#o.geocode({ location: e }, (e, n) => {
			if (n === t.maps.GeocoderStatus.OK && e?.[0]) {
				let t = this.#a.getPosition().lat(), n = this.#a.getPosition().lng();
				this.value = `${t},${n}`, this._formattedAddress = `${this.localize.term("gmaps_locationSet")}: ${e[0].formatted_address} (${t}, ${n})`, this._errorMessage = "", this.dispatchEvent(new o());
			} else this._errorMessage = this.localize.term("gmaps_geoCodeError");
		});
	}
	render() {
		return n`
			<div class="wrapper">
				<input id="lookup" type="text" class="lookup" placeholder="Search for an address" />
				<div id="map" class="map"></div>
				${this._formattedAddress ? n`<div class="address">${this._formattedAddress}</div>` : ""}
				${this._errorMessage ? n`<div class="error">${this._errorMessage}</div>` : ""}
				<uui-button
					look="secondary"
					label=${this.localize.term("gmaps_resetTxt")}
					?disabled=${!this._mapReady}
					@click=${this.#p}
				>${this.localize.term("gmaps_resetTxt")}</uui-button>
			</div>
		`;
	}
	static {
		this.styles = [s, e`
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
		`];
	}
};
c([r({ type: String })], f.prototype, "value", void 0), c([i()], f.prototype, "_formattedAddress", void 0), c([i()], f.prototype, "_errorMessage", void 0), c([i()], f.prototype, "_mapReady", void 0), c([r({ attribute: !1 })], f.prototype, "config", null), f = c([t("bd-gmaps-editor")], f);
var p = f;
//#endregion
export { p as default };

//# sourceMappingURL=gmaps-editor.js.map