import $ from 'jquery';
import _ from 'lodash';
import { customIndicatorById } from './customIndicators';

const headers = {
    Accept: 'application/json+geojson',
};

const baseUrl = config => `${config.baseUrl}/api/${config.apiVersion}`;
const getParams = {
    type: 'GET',
    headers: headers,
    xhrFields: {
        withCredentials: true,
    },
};

var indicatorUrl = function (config, indicator, ouLevel, period) {
    var ou = _.isString(ouLevel) === true ? ouLevel : `LEVEL-${ouLevel}`;
    return (
        baseUrl(config) +
        '/analytics.json?dimension=dx:' +
        indicator +
        '&dimension=ou:' +
        ou +
        '&filter=pe:' +
        period +
        '&displayProperty=SHORTNAME&skipData=false&skipMeta=true&includeNumDen=true'
    );
};
var dataElementUrl = function (config, dataElement, ouLevel, period) {
    var ou = _.isString(ouLevel) === true ? ouLevel : `LEVEL-${ouLevel}`;
    return (
        baseUrl(config) +
        '/analytics.json?dimension=dx:' +
        dataElement +
        '&dimension=pe:' +
        period +
        // '&filter=ou:' +
        // ou +
        '&dimension=ou:' +
        ou +
        '&displayProperty=NAME&skipData=false&skipMeta=true&includeNumDen=false'
    );
};

var getGeom = (config, level, callback) => {
    if (!dataObject.geom) {
        dataObject.geom = {};
    }
    if (!dataObject.geom[level]) {
        $.ajax({
            ...getParams,
            url: `${baseUrl(config)}/organisationUnits.geojson?level=${level}`,
            success: function (result) {
                dataObject.geom[level] = result;
                callback(dataObject.geom[level]);
            },
        });
    } else {
        callback(dataObject.geom[level]);
    }
};

var getOrgUnitList = async (config, { level }) => {
    if (!dataObject.orgUnitList) {
        dataObject.orgUnitList = {};
    }
    if (dataObject.orgUnitList[level]) {
        return dataObject.orgUnitList[level];
    }
    const result = await $.ajax({
        ...getParams,
        url: `${baseUrl(
            config
        )}/organisationUnits?fields=name:id&paging=false&level=${level}`,
    });
    dataObject.orgUnitList[level] = result;
    return result;
};

var dataObject = {};
var dataObjectPromise = {};
var dataElementObject = {};

var getIndicatorData = async (config, { indicator, ouLevel, period }) => {
    dataObject[indicator] = dataObject[indicator] || {};
    dataObject[indicator][ouLevel] = dataObject[indicator][ouLevel] || {};
    dataObjectPromise[indicator] = dataObjectPromise[indicator] || {};
    dataObjectPromise[indicator][ouLevel] =
        dataObjectPromise[indicator][ouLevel] || {};

    if (dataObject[indicator][ouLevel][period]) {
        return dataObject[indicator][ouLevel][period];
    }
    if (dataObjectPromise[indicator][ouLevel][period]) {
        return await dataObjectPromise[indicator][ouLevel][period];
    }

    dataObjectPromise[indicator][ouLevel][period] = fetchIndicatorData(
        config,
        ouLevel,
        period,
        indicator
    );
    const result = await dataObjectPromise[indicator][ouLevel][period];
    dataObject[indicator][ouLevel][period] = result;
    delete dataObjectPromise[indicator][ouLevel][period];

    return result;
};
function fetchIndicatorData(config, ouLevel, period, indicator) {
    const customIndicator = customIndicatorById[indicator];
    if (customIndicator) {
        return fetchCustomIndicatorData(config, ouLevel, period, indicator);
    }
    return $.ajax({
        ...getParams,
        url: indicatorUrl(config, indicator, ouLevel, period),
    });
}
var getDataElement = async (config, { dataElement, ouLevel, period }) => {
    if (!dataElementObject[dataElement]) {
        dataElementObject[dataElement] = {};
    }
    if (!dataElementObject[dataElement][ouLevel]) {
        dataElementObject[dataElement][ouLevel] = {};
    }
    if (dataElementObject[dataElement][ouLevel][period]) {
        return dataElementObject[dataElement][ouLevel][period];
    }
    const result = await $.ajax({
        ...getParams,
        url: dataElementUrl(config, dataElement, ouLevel, period),
    });
    dataElementObject[dataElement][ouLevel][period] = result;
    return result;
};
async function fetchCustomIndicatorData(config, ouLevel, period, indicator) {
    const customIndicator = customIndicatorById[indicator];
    if (customIndicator) {
        // ensure data are all fetched
        await Promise.all(
            customIndicator.indicators.map(requiredIndicator =>
                getIndicatorData(config, {
                    indicator: requiredIndicator,
                    ouLevel,
                    period,
                })
            )
        );
        // compute combined indicators value
        const indicatorsData = customIndicator.indicators.reduce(
            (data, requiredIndicator) => {
                data[requiredIndicator] =
                    dataObject[requiredIndicator][ouLevel][period];
                return data;
            },
            {}
        );
        return customIndicator.computeData(indicatorsData);
    }
}

var getChartData = async (ou, dx, timeScale, ouLevel) => {
    return timeScale.map(async e => {
        var rows = await getIndicatorData(dx, ouLevel, e.value);
        var oUnit = rows.rows.filter(e => e[1] === ou)[0];
        return oUnit;
    });
};

var getDataObject = () => {
    return dataObject;
};

function indexValueByName(headers) {
    return headers.reduce((indexedByName, header, index) => {
        indexedByName[header.name.toLowerCase()] = index;
        return indexedByName;
    }, {});
}

function mapDataElementResult(period, data) {
    const nameToIndex = indexValueByName(data.headers);
    return _.reduce(
        data.rows,
        (periodData, row) => {
            periodData[row[nameToIndex['ou']]] = {
                value: Number.parseFloat(row[nameToIndex['value']]),
            };
            return periodData;
        },
        { period: period.value }
    );
}

export {
    getIndicatorData,
    getDataElement,
    getGeom,
    getChartData,
    getDataObject,
    getOrgUnitList,
    dataObject,
    dataElementObject,
    indexValueByName,
    mapDataElementResult,
};
