import L from 'leaflet'
import _ from 'lodash'

// Base layers list
var basemaps = {
    OpenStreetMap_Mapnik: L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
    ),
    OpenStreetMap_HOT: L.tileLayer(
        'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
        }
    ),
    Stamen_TonerLite: L.tileLayer(
        'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}',
        {
            attribution:
                'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png',
        }
    ),
}

// Layer display control
var layerSelector = (layers, leafletMap) => {
    var baseMaps = {
        'OSM Mapnik': basemaps.OpenStreetMap_Mapnik,
        'OSM Hot': basemaps.OpenStreetMap_HOT,
        'Stamen TonerLite': basemaps.Stamen_TonerLite,
    }
    L.control.layers(baseMaps, layers).addTo(leafletMap)
}

// Layer style
function getColor(value, themeClasses) {
    var color
    if (value === false) {
        return 'rgb(0, 0, 0)'
    } else {
        var val = _.toNumber(value)
        _.each(themeClasses, function(v) {
            if (_.inRange(val, v.range[0], v.range[1]) === true) {
                color = v.color
                return false
            }
        })
        return color
    }
}

function getClasses(legend) {
    // if (!legend || _.isEmpty(legend.items)) {
    //     return classes;
    // }
    return legend.items.map(v => ({range: [v.startValue, v.endValue], color: v.color}));
}

const createLayerStyle = (layer, opacity, legend, selectedArea) => {
    return {
        do: function(data) {
            var dataRef = _.keyBy(data.rows, function(o) {
                return o[1]
            })
            layer.setStyle(function(feature) {
                var value = dataRef[feature.id] ? dataRef[feature.id][2] : false
                var color = getColor(value, getClasses(legend))
                return {
                    fill: true,
                    fillOpacity: opacity,
                    fillColor: color,
                    color: feature.id === selectedArea ? 'rgb(29,75,244)' : 'rgb(50,50,50)',
                    weight: feature.id === selectedArea ? 2.8 : 0.6
                }
            })
            layer.eachLayer(l => {
                l.bringToBack();
                l.on({
                    mouseover: function (e) {
                        l.unbindTooltip()
                        l.bindTooltip(`${l.feature.properties.name} (${dataRef[l.feature.id] ? dataRef[l.feature.id][2] : false})`, {sticky: true, permanent: false})
                        l.openTooltip()
                        l.setStyle({weight: 3})
                    },
                    mouseout: function (e) {
                        l.closeTooltip()
                        l.unbindTooltip()
                        l.setStyle({weight: l.feature.id === selectedArea ? 2.8 : 0.6})
                    },
                })
            })
        },
    }
}

export { basemaps, layerSelector, createLayerStyle }
