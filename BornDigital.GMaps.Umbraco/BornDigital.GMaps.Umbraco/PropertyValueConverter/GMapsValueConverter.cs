using BornDigital.GMaps.Umbraco.Models;
using BornDigital.GMaps.Umbraco.PropertyEditor;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace BornDigital.GMaps.Umbraco.PropertyValueConverter
{
    public class GMapsValueConverter : PropertyValueConverterBase
    {
        public override bool IsConverter(IPublishedPropertyType propertyType) => propertyType.EditorUiAlias.Equals(GMapsEditor.EditorAlias);

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType) => typeof(GMapsLocation);

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType) => PropertyCacheLevel.Element;

        public override object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview)
        {
            if (inter == null || string.IsNullOrWhiteSpace(inter.ToString()))
            {
                return null;
            }

            var coordinates = inter.ToString()?.Split([","], StringSplitOptions.RemoveEmptyEntries) ?? [];

            if (coordinates.Length == 2 && decimal.TryParse(coordinates[0], out var lat) && decimal.TryParse(coordinates[1], out var lng))
            {
                return new GMapsLocation
                {
                    Latitude = lat,
                    Longitude = lng
                };
            }

            return null;
        }
    }
}
