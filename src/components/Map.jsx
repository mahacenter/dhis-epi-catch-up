// Don't know why, this import is required to make leaflet working
/* eslint-disable */
import D2map from '@dhis2/gis-api';
/* eslint-enable */
import React, {Component} from 'react'
import {multiPolygon, polygon} from '@turf/helpers'
import pointOnFeature from '@turf/point-on-feature'
import L from 'leaflet'
import _ from 'lodash'
import {basemaps, layerSelector, setLayerStyle} from './../js/mapFunctions'
import {getIndicatorData, getGeom} from './../js/api'
import {rgba} from "../js/colors";
import {circleRadiusGenerator} from "./legend/CircleLegend";
import {getDataElement, indexValueByName} from "../js/api";

const mountCardId = 'epiMap';

var organisationUnits
var updateLayer
var circleLayer

function legendToLeafLetStyle(legend) {
    return {
        color: rgba(legend.stroke),
        fillColor: rgba(legend.color),
        fillOpacity: legend.opacity,
        opacity: legend.opacity,
        weight: legend.strokeWidth,
    };
}

function centerOfFeature(feature) {
    if ('Polygon' === feature.geometry.type) {
        return pointOnFeature(polygon(feature.geometry.coordinates)).geometry.coordinates;
    }
    if ('MultiPolygon' === feature.geometry.type) {
        return pointOnFeature(multiPolygon(feature.geometry.coordinates)).geometry.coordinates;
    }
    return [0, 0];
}

class CircleLayer {
    constructor(geom, circleLegend, circleLegendRef) {
        this.features = geom.features;
        this.circleLegendRef = circleLegendRef;
        this.circleLegend = circleLegend;
    }

    remove() {
        this.circles && this.circles.forEach(circle => circle.item.remove());
        this.circles = null;
    }

    addTo(map) {
        if (this.circles) {
            return;
        }
        this.circles = this.features.map((feature, index) => {
            const center = centerOfFeature(feature).reverse();
            return {
                ou: feature.id,
                item: L.circleMarker(center, {
                    ...this.circleLegend ? legendToLeafLetStyle(this.circleLegend) : {},
                }).bindTooltip(circle => {
                    return circle.value.toString();
                }).setRadius(0),
            };
        });
        L.layerGroup(this.circles.map(circle => circle.item)).addTo(map);
    }

    updateLegend(map, circleLegend, circleLegendRef) {
        if (!circleLegend) {
            return;
        }
        this.circleLegend = circleLegend;
        this.circleLegendRef = circleLegendRef;

        if (circleLegend.isEnabled) {
            this.addTo(map)
            this.circles.forEach(circle => {
                circle.item.setStyle(legendToLeafLetStyle(circleLegend));
            });
        } else if (this.circles) {
            this.remove();
        }
    }

    update(data) {
        if (!this.circleLegendRef) {
            return;
        }
        const nameToIndex = indexValueByName(data.headers)
        const radiusGenerator = circleRadiusGenerator(this.circleLegend.size, this.circleLegendRef);
        const dataRef = _.keyBy(data.rows, row => row[nameToIndex['ou']]);
        this.circles.forEach(circle => {
            const ouData = dataRef[circle.ou];
            if (!ouData) {
                circle.item.setRadius(0);
                circle.item.setStyle({color: 'rgba(0,0,0,0)'});
            } else {
                const generated = radiusGenerator(ouData[nameToIndex['value']]);
                circle.item.setRadius(generated.radius);
                circle.item.value = generated.value;
            }
        });
    }
}

export class Map extends Component {
    componentDidMount() {
        var _this = this
        this.map = L.map(mountCardId, {
            center: [20, 0],
            zoom: 2,
            preferCanvas: true,
            layers: [basemaps.OpenStreetMap_Mapnik]
        })
        // Request geo data
        getGeom(this.props.ouLevel, (geom) => {
            organisationUnits = L.geoJson(geom, {
                style: function () {
                    return {
                        color: 'rgb(50,50,50)',
                        weight: 0.6,
                        fill: false
                    }
                },
                onEachFeature: function (feature, layer) {
                    layer.on({
                        click: function (e) {
                            _this.props.onSelection(e.target.feature.id, e.target.feature.properties.name)
                        }
                    })
                }
            })
            updateLayer = new setLayerStyle(organisationUnits, this.props.coverageLayerOpacity, this.props.legendRef, this.props.selectedArea)
            circleLayer = new CircleLayer(geom, this.props.circleLegend, this.props.circleLegendRef)
            layerSelector({}, this.map)
            organisationUnits.addTo(this.map);
            this.map.fitBounds(organisationUnits.getBounds())
            this.refreshViewFromHistoryProps();
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!organisationUnits) {
            return;
        }
        updateLayer = new setLayerStyle(organisationUnits, this.props.coverageLayerOpacity, this.props.legendRef, this.props.selectedArea)
        circleLayer && circleLayer.updateLegend(this.map, this.props.circleLegend, this.props.circleLegendRef);

        if (prevProps.ouLevel !== this.props.ouLevel) {
            getGeom(this.props.ouLevel, (geom) => {
                circleLayer && circleLayer.remove();
                circleLayer = new CircleLayer(geom, this.props.circleLegend, this.props.circleLegendRef);
                organisationUnits.clearLayers()
                organisationUnits.addData(geom)
                this.refreshViewFromHistoryProps(prevProps)
            })
        } else {
            this.refreshViewFromHistoryProps(prevProps)
        }
    }

    refreshViewFromHistoryProps(prevProps) {
        getIndicatorData({indicator: this.props.dx, ouLevel: this.props.ouLevel, period: this.props.historyPosition})
            .then(data => updateLayer.do(data))
            .catch(error => console.log('error', error))
        this.updateAbsoluteFigues();
        if (prevProps) {
            var visibility = this.props.isCoverageLayerEnabled
            if (visibility !== prevProps.isCoverageLayerEnabled) {
                if (visibility === false) {
                    organisationUnits.removeFrom(this.map)
                } else {
                    organisationUnits.addTo(this.map)
                }
            }
        }
    }

    updateAbsoluteFigues() {
        if (!this.props.circleLegend?.dataElement?.id) {
            return;
        }
        getDataElement({
            dataElement: this.props.circleLegend.dataElement.id,
            ouLevel: this.props.ouLevel,
            period: this.props.historyPosition
        })
            .then(data => {
                if (circleLayer && this.props.circleLegend.isEnabled) {
                    circleLayer.addTo(this.map);
                    circleLayer.update(data);
                }
            })
            .catch(error => console.log('error', error))
    }

    render() {
        return <div id={mountCardId} style={{height: '530px'}}/>;
    }
}
