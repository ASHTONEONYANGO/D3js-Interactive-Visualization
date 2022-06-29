import {
  select,
  csv,
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
} from 'd3';
import { dropdownMenu } from './dropdownMenu';
import { scatterPlot } from './scatterPlot';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

let data;
let xColumn;
let yColumn;

const onXColumnClicked = (column) => {
  xColumn = column;
  render();
};

const onYColumnClicked = (column) => {
  yColumn = column;
  render();
};

const render = () => {
  select('#x-menu').call(dropdownMenu, {
    options: data.columns,
    onOptionClicked: onXColumnClicked,
    selectedOption: xColumn,
  });

  select('#y-menu').call(dropdownMenu, {
    options: data.columns,
    onOptionClicked: onYColumnClicked,
    selectedOption: yColumn,
  });

  svg.call(scatterPlot, {
    xValue: (d) => d[xColumn],
    xAxisLabel: xColumn,
    yValue: (d) => d[yColumn],
    circleRadius: 10,
    yAxisLabel: yColumn,
    margin: {
      top: 10,
      right: 40,
      bottom: 88,
      left: 150,
    },
    width,
    height,
    data,
  });
};

csv('heart_data.csv').then((loadedData) => {
  data = loadedData;
  data.forEach((d) => {
    d.Gender = +d.Gender;
    d.age = +d.age;
    d.currentSmoker = +d.currentSmoker;
    d.cigsPerDay = +d.cigsPerDay;
    d.Blood_Pressure_Medication = +d.Blood_Pressure_Medication;
    d.stroke = +d.stroke;
    d.hypertension = +d.hypertension;
    d.diabetes = +d.diabetes;
    d.cholesterol = +d.cholesterol;
    d.systolic_Blood_Pressure = +d.systolic_Blood_Pressure;
    d.diastolic_Blood_Pressure = +d.diastolic_Blood_Pressure;
    d.BMI = +d.BMI;
    d.heartRate = +d.heartRate;
    d.glucose = +d.glucose;
    d.Heart_Disease = +d.Heart_Disease;
  });
  
  // console.log(data);
  
  xColumn = data.columns[4];
  yColumn = data.columns[0];
  render();
});
