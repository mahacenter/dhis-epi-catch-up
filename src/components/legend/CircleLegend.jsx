import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import * as PropTypes from "prop-types";
import React from "react";
import {rgba} from "../../js/colors";

export function circleRadiusGenerator(size, {min, max}) {
    const [minArea, maxArea] = size;
    return value => {
        const rounded = Math.round(value);
        const circleValue = Math.ceil(rounded / 10) * 10;
        const area = (maxArea - 1) * (Math.max((circleValue - min), 0) / (max - min)) + minArea;
        return {
            value: rounded,
            radius: Math.sqrt(area / Math.PI),
        };
    }
}

function generateLegendSVG(props) {
    var htmlStr;
    var mRadius;
    var minVal = props.circleLegendRef.min;
    var maxVal = props.circleLegendRef.max;
    var diff = maxVal - minVal;
    var denominator = 4;
    var fraction = diff/denominator;
    var lP = {labelSize: 14, labelColor: 'black', labelShift: 4};
    var lS = lP.labelSize;
    var lC = lP.labelColor;
    var lT = lP.labelShift;

    const styles = {
        color: rgba(props.legend.color),
        stroke: rgba(props.legend.stroke),
        strokeWidth: props.legend.strokeWidth
    };

    const radiusGenerator = circleRadiusGenerator(props.legend.size, props.circleLegendRef);
    const legendScales = [maxVal, minVal + fraction, minVal];
    legendScales.forEach((scale, index) => {
        var fillColor;
        const {radius, value} = radiusGenerator(scale);
        if (index === 0) {
            mRadius = radius;
            fillColor = styles.color;
        } else {
            fillColor = "rgba(0,0,0,0)";
        }
        htmlStr += '<circle cx="' + (mRadius + 1 + styles.strokeWidth) + '" cy="' + (15 + (mRadius*2) - radius) + '" r="' + radius + '" stroke="' + styles.stroke + '" stroke-width="' + parseFloat(styles.strokeWidth) + '" fill="' + fillColor + '" />';
        htmlStr += '<line x1="' + (mRadius + 2 + styles.strokeWidth) + '" y1="' + (15 + (mRadius*2) - (radius*2)) + '" x2="' + ((mRadius*2) + 20 + + styles.strokeWidth) + '" y2="' + (15 + (mRadius*2) - (radius*2)) + '" style="stroke:rgba(100,100,100,1);stroke-width:0.5" />';
        htmlStr += '<text x="' + ((mRadius*2) + 25 + styles.strokeWidth) + '" y="' + (15 + (mRadius*2) - (radius*2) + (lT-(lT/2))) + '" style="fill:' + lC + ';font-size:' + (lS - 1) + 'px;">' + value + '</text>';
    });
    var htmlHeader = '<div id="legendCases">';
    htmlHeader += '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="216px" height="' + ((mRadius * 3) + 10) + 'px">';

    var htmlFooter = '</svg>';
    htmlFooter += '</div>';

    var result = htmlHeader + htmlStr + htmlFooter;
    return result;
}

function CircleLegendDraw(props) {
    return <div dangerouslySetInnerHTML={{ __html: generateLegendSVG(props) }}></div>;
}

function CircleLegend({circleLegend, circleLegendRef}) {
    if (!circleLegend) {
        return;
    }
    return <Box>
        <Typography gutterBottom>
            {circleLegend.dataElement.name}
        </Typography>
        <Divider/>
        <CircleLegendDraw legend={circleLegend} circleLegendRef={circleLegendRef}/>
    </Box>
}

CircleLegend.propTypes = {
    onChange: PropTypes.func
}

export {CircleLegend};
