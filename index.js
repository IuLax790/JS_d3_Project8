import React, { useState, useCallback,useEffect } from 'react';
import ReactDOM from 'react-dom';
import {csv,scaleLinear,scaleOrdinal,max,format,extent, scaleOrdinal} from 'd3';
import ReactDropdown from 'react-dropdown'
import {useData} from './useData';
import {AxisBottom} from './AxisBottom';
import {AxisLeft} from './AxisLeft';
import {Marks} from './Marks';
import { Dropdown } from './Dropdown';


const width = 960;
const menuHeight = 79
const height = 500-menuHeight;
const margin = { top: 20, right: 30, bottom: 68, left: 90 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 45;

const attributes = [{value:"sepal_length",label:'Sepal Length'},
{value:"sepal_width",label:'Sepal Width'},
{value:"petal_length",label:"Petal Length"},
{value:"petal_width",label:"Petal Width"},
{value:"species",label:"Species"}
];
const getLabel = value =>{
  for (let i =0;i<attributes.length;i++){
    if(attributes[i].value ===value){
      return attributes[i].label;
    }
  }
};
const App = () => {
  const data = useData();
  const initialXAttribute = 'petal_length';
  const [xAttribute,setXAttribute] = useState(initialXAttribute);
  const xValue = d => d[xAttribute];
  const xAxisLabel = getLabel(xAttribute);

  const initialYAttribute = 'sepal_width';
  const [yAttribute,setYAttribute] = useState(initialYAttribute);
  const yValue = d => d[yAttribute];
  const yAxisLabel = getLabel(yAttribute);
  const colorValue = d=>d.species;
 

  if (!data) {
    return <pre>Loading...</pre>;
  }

const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;

const siFormat = format('.2s');
const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B');

const xScale = scaleLinear()
  .domain(extent(data, xValue))
  .range([0, innerWidth])
  .nice();

const yScale = scaleLinear()
  .domain(extent(data, yValue))
  .range([0, innerHeight]);

const colorScale = scaleOrdinal()
  .domain(data.map(colorValue))
  .range(['#E6842A','#137B80','#8E6C8A']);

  return (
  <>
  <div className="menus-container">
  <span className="dropdown-label">X:</span>
  <ReactDropdown
  options={attributes}
  value={xAttribute}
  onChange={({value})=>setXAttribute(value)}
  />
  <span className="dropdown-label">Y:</span>
  <ReactDropdown
  options={attributes}
  value={yAttribute}
  onChange={({value})=>setYAttribute(value)}
  />
  </div>
  <svg width={width} height={height}>
  <g transform={`translate(${margin.left},${margin.top})`}>
  <AxisBottom
    xScale={xScale}
    innerHeight={innerHeight}
    tickFormat={xAxisTickFormat}
    tickOffset={5}
  />
  <text
    className="axis-label"
    textAnchor="middle"
    transform={`translate(${-yAxisLabelOffset},${innerHeight /2}) rotate(-90)`}
  >
    {yAxisLabel}
  </text>
    <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={5} />
  <text
    className="axis-label"
    x={innerWidth / 2}
    y={innerHeight + xAxisLabelOffset}
    textAnchor="middle"
  >
    {xAxisLabel}
  </text>
  <Marks
    data={data}
    xScale={xScale}
    yScale={yScale}
    colorScale={colorScale}
    xValue={xValue}
    yValue={yValue}
    colorValue = {colorValue}
    tooltipFormat={xAxisTickFormat}
    circleRadius={7}
  />
  </g>
  </svg>
  </>
  );
  };
    const rootElement = document.getElementById('root');
    ReactDOM.render(<App />, rootElement);
