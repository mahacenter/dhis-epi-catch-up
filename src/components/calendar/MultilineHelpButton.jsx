import React from 'react'
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import ButtonModal from "../dialog/modal";

export const MultilineHelpButton = ({style}) =>
  <ButtonModal buttonText={<HelpOutlineIcon/>} modalTitle="Coverage rate catch-up trend: PROXY" style={style}>
    The indicator “Coverage rate catch-up trend ” is considering (1) the cumulated number of children vaccinated divided by (2) the cumulated number of targeted children for a cumulated period.
    The starting month for the calculation is January 2019 in order to appraise the trends throughout a longer period.
    <br/><br/>
    <b>Note:</b>
    <br/>
    - the calculations/results are displayed only at the most granular level<br/>
    - when hovering over the lines, you can identify and highlight a particular geographical area
    <br/>
    <br/>
    <b>Typical interpretation:</b>
    <br/>
    <img src="./rateCatchUp-interpretation.png" alt="Typical catch-up interpretation" style={{maxWidth: '100%'}}/>
  </ButtonModal>;
