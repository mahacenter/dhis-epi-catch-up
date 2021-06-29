import React, {useEffect} from 'react'
import * as d3 from 'd3'
import * as _ from "lodash";
import {legend} from "./monthlyLegend";

const cellSize = 17;
const width = 600;
const legendWidth = 320;

const legendBuilder = (name) => {
    const maxLegendValue = 30;
    const scaleLegendColor = d3.scaleSequential(d3.interpolatePiYG).domain([-maxLegendValue, maxLegendValue]);

    return {
        legendNode: () => legend({
            color: d3.scaleDiverging([-maxLegendValue / 100, 0, maxLegendValue / 100], d3.interpolatePiYG),
            width: legendWidth,
            title: `${name}: Monthly change of the coverage rates`,
            subTitle: `See the calculation by hovering over the squares`,
            tickFormat: "+%"
        }),
        legendColor: (value) => {
            if (Number.isFinite(value)) {
                return scaleLegendColor(value);
            }
            return "transparent";
        },
    };
};

const cumulatedDiffDataElementNode = ({startYear, endYear, cumulatedDiff}) => {
    const svg = d3.create("svg")
        .attr("font-size", 10)
        .attr("viewBox", [0, 0, width, 45]);

    const group = svg.append("g")
        .attr("transform", `translate(200,0)`);

    group.append("text")
        .attr("x", -30)
        .attr("y", 25)
        .text(`Difference of cumulated number of children vaccinated`);

    group.append("text")
        .attr("x", -30)
        .attr("y", 40)
        .text(`between ${startYear} and ${endYear} (year to date calculation)`);

    group.append("rect")
        .attr("x", 13 * cellSize + 0.5)
        .attr("y", 25)
        .attr("width", 50)
        .attr("height", cellSize - 1)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "transparent");

    group.append("text")
        .attr("x", 15 * cellSize + 10.5)
        .attr("y", 37)
        .attr("text-anchor", "end")
        .text(cumulatedDiff < 0 ? cumulatedDiff : `+${cumulatedDiff}` || '???');

    return svg.node();
}

export function CalendarGraph(props) {
    const id = props.name.split(' ').join('-');

    useEffect(() => {
        const {legendColor, legendNode} = legendBuilder(props.name);

        d3.select(`#calendar-legend-${id}`).selectAll("*").remove();
        d3.select(`#calendar-legend-${id}`).append(() => legendNode());

        d3.select(`#calendar-cumulated-${id}`).selectAll("*").remove();
        d3.select(`#calendar-cumulated-${id}`).append(() => cumulatedDiffDataElementNode(props.cumulated));

        d3.select(`#calendar-graph-${id}`).selectAll("*").remove();
        const svg = d3.select(`#calendar-graph-${id}`)
            .attr("viewBox", [0, 0, width, (40 + (props.organisationUnits.length * cellSize)) * props.years.length])
            .attr("font-size", 10);

        const yearSvg = svg.selectAll("g")
            .data(props.years)
            .join("g")
            .attr("transform", (d, i) => `translate(200,${(40 + (props.organisationUnits.length * cellSize)) * i + cellSize * 1.5})`);

        yearSvg.append("text")
            .attr("x", -5)
            .attr("y", -5)
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text(oneYear => oneYear.year);

        yearSvg.append("g")
            .attr("text-anchor", "end")
            .selectAll("text")
            .data(props.organisationUnits)
            .join("text")
            .attr("x", -5)
            .attr("y", (_, index) => (index + 0.5) * cellSize)
            .attr("dy", "0.31em")
            .text(unit => unit.name);


        yearSvg.append("g")
            .selectAll("g")
            .data(['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'])
            .join("g")
            .append("text")
            .attr("x", (_, index) => index * cellSize + 20)
            .attr("y", -5)
            .text(month => month);

        yearSvg.append("g")
            .selectAll("rect")
            .data(year => year.values)
            .join("rect")
            .attr("cursor", "help")
            .attr("width", cellSize - 1)
            .attr("height", cellSize - 1)
            .attr("x", cell => cell.month * cellSize + 0.5)
            .attr("y", cell => {
                const unitIndex = props.organisationUnits.findIndex(unit => unit.name === cell.regionOrDistrict);
                return unitIndex * cellSize + 0.5;
            })
            .attr("fill", cell => legendColor(cell.coverageRateDiff))
            .append("title")
            .text(cell => {
                if (!cell.lastYear) {
                    return '';
                }

                const month = _.padStart(cell.month, 2, '0');
                return `${props.indicator.name} for ${cell.regionOrDistrict}
-----------------------
${month}/${cell.year - 1}
Number of children vaccinated: ${cell.lastYear.numerator}
Target population: ${Math.round(cell.lastYear.targetPop / 12)} (${cell.lastYear.targetPop} for the year)
(1) Coverage: ${cell.lastYear.value}%
-----------------------
${month}/${cell.year}
Number of children vaccinated: ${cell.numerator}
Target population: ${Math.round(cell.targetPop / 12)} (${cell.targetPop} for the year)
(2) Coverage: ${cell.value}%
-----------------------
Diff: (2) - (1): ${Number.isFinite(cell.coverageRateDiff) ? cell.coverageRateDiff : 'unknown'} percentage points`;
            });

        yearSvg.append("g")
            .attr("text-anchor", "end")
            .selectAll("rect")
            .data(props.cumulated.subOUsDiffs)
            .join("text")
            .attr("cursor", "help")
            .attr("x", 15 * cellSize + 10.5)
            .attr("y", dataElementDiff => {
                const unitIndex = props.organisationUnits.findIndex(unit => unit.name === dataElementDiff.regionOrDistrict);
                return unitIndex * cellSize + 12;
            })
            .text(dataElementDiff => dataElementDiff.diff < 0 ? dataElementDiff.diff : `+${dataElementDiff.diff}`)
            .append("title")
            .text(subOuDiff => `(1) Total of children vaccinated in ${subOuDiff.sumOfThisYear.year}: ${subOuDiff.sumOfThisYear.sum}
(2) Total of children vaccinated in ${subOuDiff.sumOfLastYear.year}: ${subOuDiff.sumOfLastYear.sum}
Result: (1) - (2): ${subOuDiff.diff}`);

    }, [props.indicator, props.organisationUnits, props.years, props.cumulated, props.name, id]);

    return <>
        <div id={`calendar-legend-${id}`} style={{width: legendWidth, margin: '25px auto auto'}}></div>
        <div id={`calendar-cumulated-${id}`}></div>
        <svg id={`calendar-graph-${id}`}></svg>
    </>;
}
