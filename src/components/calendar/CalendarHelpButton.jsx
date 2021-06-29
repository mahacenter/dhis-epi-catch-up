import React from 'react'
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import ButtonModal from "../dialog/modal";

export const CalendarHelpButton = () =>
    <ButtonModal buttonText={<HelpOutlineIcon />} modalTitle="Coverage rate difference">
      The indicator “Coverage rate difference” is comparing the decrease (or increase) of the coverage rate of a particular calendar month for two different periods: 2019 versus 2020.<br/>
      Coverage rate January 2020 minus (-) coverage rate January 2019 and so on…<br/>
      The unit of that indicator is a percentage point so to denote the arithmetic difference between two percentages.<br/>
      <b>The referenced year is 2019: the year before Covid 19</b><br/>
      The calculation is available for all the antigens
      <br/><br/>
      An additional figure is calculated on the right side of the table:
      The difference of cumulated number of children vaccinated between the years 2019 and 2020:<br/>
      Cumulated number of children vaccinated in 2020 (year to date) minus (-) cumulated number of children vaccinated in 2019 (same period than 2020)
      <br/><br/>
      <b>Note:</b>
      <br/>
      Note: When hovering over the squares, all the figures utilized for the calculation are recalled with the corresponding result, which is displayed in the color scheme for the “coverage rate difference”.
      <br/>
      <br/>
      <b>Typical interpretation:</b>
      <br/>
      <img src="./rateDiff-interpretation.png" alt="Typical interpretation" style={{maxWidth: '100%'}}/>
    </ButtonModal>;
