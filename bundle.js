(function (d3) {
  'use strict';

  /*

    The DOM structure looks like this:

    <select>
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
      <option value="mercedes">Mercedes</option>
      <option value="audi">Audi</option>
    </select>

  */

  const dropdownMenu = (selection, props) => {
    const {
      options,
      onOptionClicked,
      selectedOption
    } = props;
    
    let select = selection.selectAll('select').data([null]);
    select = select.enter().append('select')
      .merge(select)
        .on('change', function() {
          onOptionClicked(this.value);
        });
    
    const option = select.selectAll('option').data(options);
    option.enter().append('option')
      .merge(option)
        .attr('value', d => d)
        .property('selected', d => d === selectedOption)
        .text(d => d);
  };

  const scatterPlot = (selection, props) => {
    const {
      xValue,
      xAxisLabel,
      yValue,
      circleRadius,
      yAxisLabel,
      margin,
      width,
      height,
      data
    } = props;
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();
    
    const yScale = d3.scaleLinear();
    yScale.domain(d3.extent(data, yValue));
    yScale.range([innerHeight, 0]);
    yScale.nice();
    
    const g = selection.selectAll('.container').data([null]);
    const gEnter = g
      .enter().append('g')
        .attr('class', 'container');
    gEnter
      .merge(g)
        .attr('transform',
          `translate(${margin.left},${margin.top})`
        );
    
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(15);
    
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10);
    
    const yAxisG = g.select('.y-axis');
    const yAxisGEnter = gEnter
      .append('g')
        .attr('class', 'y-axis');
    yAxisG
      .merge(yAxisGEnter)
        .call(yAxis)
        .selectAll('.domain').remove();
    
    const yAxisLabelText = yAxisGEnter
      .append('text')
        .attr('class', 'axis-label')
        .attr('y', -93)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
      .merge(yAxisG.select('.axis-label'))
        .attr('x', -innerHeight / 2)
        .text(yAxisLabel);
    
    
    const xAxisG = g.select('.x-axis');
    const xAxisGEnter = gEnter
      .append('g')
        .attr('class', 'x-axis');
    xAxisG
      .merge(xAxisGEnter)
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll('.domain').remove();
    
    const xAxisLabelText = xAxisGEnter
      .append('text')
        .attr('class', 'axis-label')
        .attr('y', 75)
        .attr('fill', 'black')
      .merge(xAxisG.select('.axis-label'))
        .attr('x', innerWidth / 2)
        .text(xAxisLabel);

    
    const circles = g.merge(gEnter)
      .selectAll('circle').data(data);
    circles
      .enter().append('circle')
        .attr('cx', innerWidth / 2)
        .attr('cy', innerHeight / 2)
        .attr('r', 0)
      .merge(circles)
      .transition().duration(2000)
      .delay((d, i) => i * 10)
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius);
  };

  const svg = d3.select('svg');

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
    d3.select('#x-menu').call(dropdownMenu, {
      options: data.columns,
      onOptionClicked: onXColumnClicked,
      selectedOption: xColumn,
    });

    d3.select('#y-menu').call(dropdownMenu, {
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

  d3.csv('heart_data.csv').then((loadedData) => {
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

}(d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImRyb3Bkb3duTWVudS5qcyIsInNjYXR0ZXJQbG90LmpzIiwiaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcblxuICBUaGUgRE9NIHN0cnVjdHVyZSBsb29rcyBsaWtlIHRoaXM6XG5cbiAgPHNlbGVjdD5cbiAgICA8b3B0aW9uIHZhbHVlPVwidm9sdm9cIj5Wb2x2bzwvb3B0aW9uPlxuICAgIDxvcHRpb24gdmFsdWU9XCJzYWFiXCI+U2FhYjwvb3B0aW9uPlxuICAgIDxvcHRpb24gdmFsdWU9XCJtZXJjZWRlc1wiPk1lcmNlZGVzPC9vcHRpb24+XG4gICAgPG9wdGlvbiB2YWx1ZT1cImF1ZGlcIj5BdWRpPC9vcHRpb24+XG4gIDwvc2VsZWN0PlxuXG4qL1xuXG5leHBvcnQgY29uc3QgZHJvcGRvd25NZW51ID0gKHNlbGVjdGlvbiwgcHJvcHMpID0+IHtcbiAgY29uc3Qge1xuICAgIG9wdGlvbnMsXG4gICAgb25PcHRpb25DbGlja2VkLFxuICAgIHNlbGVjdGVkT3B0aW9uXG4gIH0gPSBwcm9wcztcbiAgXG4gIGxldCBzZWxlY3QgPSBzZWxlY3Rpb24uc2VsZWN0QWxsKCdzZWxlY3QnKS5kYXRhKFtudWxsXSk7XG4gIHNlbGVjdCA9IHNlbGVjdC5lbnRlcigpLmFwcGVuZCgnc2VsZWN0JylcbiAgICAubWVyZ2Uoc2VsZWN0KVxuICAgICAgLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgb25PcHRpb25DbGlja2VkKHRoaXMudmFsdWUpO1xuICAgICAgfSk7XG4gIFxuICBjb25zdCBvcHRpb24gPSBzZWxlY3Quc2VsZWN0QWxsKCdvcHRpb24nKS5kYXRhKG9wdGlvbnMpO1xuICBvcHRpb24uZW50ZXIoKS5hcHBlbmQoJ29wdGlvbicpXG4gICAgLm1lcmdlKG9wdGlvbilcbiAgICAgIC5hdHRyKCd2YWx1ZScsIGQgPT4gZClcbiAgICAgIC5wcm9wZXJ0eSgnc2VsZWN0ZWQnLCBkID0+IGQgPT09IHNlbGVjdGVkT3B0aW9uKVxuICAgICAgLnRleHQoZCA9PiBkKTtcbn07IiwiaW1wb3J0IHtcbiAgc2VsZWN0LFxuICBjc3YsXG4gIHNjYWxlTGluZWFyLFxuICBleHRlbnQsXG4gIG1heCxcbiAgYXhpc0xlZnQsXG4gIGF4aXNCb3R0b21cbn0gZnJvbSAnZDMnO1xuXG5leHBvcnQgY29uc3Qgc2NhdHRlclBsb3QgPSAoc2VsZWN0aW9uLCBwcm9wcykgPT4ge1xuICBjb25zdCB7XG4gICAgeFZhbHVlLFxuICAgIHhBeGlzTGFiZWwsXG4gICAgeVZhbHVlLFxuICAgIGNpcmNsZVJhZGl1cyxcbiAgICB5QXhpc0xhYmVsLFxuICAgIG1hcmdpbixcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgZGF0YVxuICB9ID0gcHJvcHM7XG4gIFxuICBjb25zdCBpbm5lcldpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcbiAgY29uc3QgaW5uZXJIZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcbiAgXG4gIGNvbnN0IHhTY2FsZSA9IHNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKGV4dGVudChkYXRhLCB4VmFsdWUpKVxuICAgIC5yYW5nZShbMCwgaW5uZXJXaWR0aF0pXG4gICAgLm5pY2UoKTtcbiAgXG4gIGNvbnN0IHlTY2FsZSA9IHNjYWxlTGluZWFyKCk7XG4gIHlTY2FsZS5kb21haW4oZXh0ZW50KGRhdGEsIHlWYWx1ZSkpO1xuICB5U2NhbGUucmFuZ2UoW2lubmVySGVpZ2h0LCAwXSk7XG4gIHlTY2FsZS5uaWNlKCk7XG4gIFxuICBjb25zdCBnID0gc2VsZWN0aW9uLnNlbGVjdEFsbCgnLmNvbnRhaW5lcicpLmRhdGEoW251bGxdKTtcbiAgY29uc3QgZ0VudGVyID0gZ1xuICAgIC5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnY29udGFpbmVyJyk7XG4gIGdFbnRlclxuICAgIC5tZXJnZShnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsXG4gICAgICAgIGB0cmFuc2xhdGUoJHttYXJnaW4ubGVmdH0sJHttYXJnaW4udG9wfSlgXG4gICAgICApO1xuICBcbiAgY29uc3QgeEF4aXMgPSBheGlzQm90dG9tKHhTY2FsZSlcbiAgICAudGlja1NpemUoLWlubmVySGVpZ2h0KVxuICAgIC50aWNrUGFkZGluZygxNSk7XG4gIFxuICBjb25zdCB5QXhpcyA9IGF4aXNMZWZ0KHlTY2FsZSlcbiAgICAudGlja1NpemUoLWlubmVyV2lkdGgpXG4gICAgLnRpY2tQYWRkaW5nKDEwKTtcbiAgXG4gIGNvbnN0IHlBeGlzRyA9IGcuc2VsZWN0KCcueS1heGlzJyk7XG4gIGNvbnN0IHlBeGlzR0VudGVyID0gZ0VudGVyXG4gICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAneS1heGlzJyk7XG4gIHlBeGlzR1xuICAgIC5tZXJnZSh5QXhpc0dFbnRlcilcbiAgICAgIC5jYWxsKHlBeGlzKVxuICAgICAgLnNlbGVjdEFsbCgnLmRvbWFpbicpLnJlbW92ZSgpO1xuICBcbiAgY29uc3QgeUF4aXNMYWJlbFRleHQgPSB5QXhpc0dFbnRlclxuICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMtbGFiZWwnKVxuICAgICAgLmF0dHIoJ3knLCAtOTMpXG4gICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHJvdGF0ZSgtOTApYClcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgIC5tZXJnZSh5QXhpc0cuc2VsZWN0KCcuYXhpcy1sYWJlbCcpKVxuICAgICAgLmF0dHIoJ3gnLCAtaW5uZXJIZWlnaHQgLyAyKVxuICAgICAgLnRleHQoeUF4aXNMYWJlbCk7XG4gIFxuICBcbiAgY29uc3QgeEF4aXNHID0gZy5zZWxlY3QoJy54LWF4aXMnKTtcbiAgY29uc3QgeEF4aXNHRW50ZXIgPSBnRW50ZXJcbiAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd4LWF4aXMnKTtcbiAgeEF4aXNHXG4gICAgLm1lcmdlKHhBeGlzR0VudGVyKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwke2lubmVySGVpZ2h0fSlgKVxuICAgICAgLmNhbGwoeEF4aXMpXG4gICAgICAuc2VsZWN0QWxsKCcuZG9tYWluJykucmVtb3ZlKCk7XG4gIFxuICBjb25zdCB4QXhpc0xhYmVsVGV4dCA9IHhBeGlzR0VudGVyXG4gICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcy1sYWJlbCcpXG4gICAgICAuYXR0cigneScsIDc1KVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAnYmxhY2snKVxuICAgIC5tZXJnZSh4QXhpc0cuc2VsZWN0KCcuYXhpcy1sYWJlbCcpKVxuICAgICAgLmF0dHIoJ3gnLCBpbm5lcldpZHRoIC8gMilcbiAgICAgIC50ZXh0KHhBeGlzTGFiZWwpO1xuXG4gIFxuICBjb25zdCBjaXJjbGVzID0gZy5tZXJnZShnRW50ZXIpXG4gICAgLnNlbGVjdEFsbCgnY2lyY2xlJykuZGF0YShkYXRhKTtcbiAgY2lyY2xlc1xuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyKCdjeCcsIGlubmVyV2lkdGggLyAyKVxuICAgICAgLmF0dHIoJ2N5JywgaW5uZXJIZWlnaHQgLyAyKVxuICAgICAgLmF0dHIoJ3InLCAwKVxuICAgIC5tZXJnZShjaXJjbGVzKVxuICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwMClcbiAgICAuZGVsYXkoKGQsIGkpID0+IGkgKiAxMClcbiAgICAgIC5hdHRyKCdjeScsIGQgPT4geVNjYWxlKHlWYWx1ZShkKSkpXG4gICAgICAuYXR0cignY3gnLCBkID0+IHhTY2FsZSh4VmFsdWUoZCkpKVxuICAgICAgLmF0dHIoJ3InLCBjaXJjbGVSYWRpdXMpO1xufTsiLCJpbXBvcnQge1xuICBzZWxlY3QsXG4gIGNzdixcbiAgc2NhbGVMaW5lYXIsXG4gIGV4dGVudCxcbiAgYXhpc0xlZnQsXG4gIGF4aXNCb3R0b20sXG59IGZyb20gJ2QzJztcbmltcG9ydCB7IGRyb3Bkb3duTWVudSB9IGZyb20gJy4vZHJvcGRvd25NZW51JztcbmltcG9ydCB7IHNjYXR0ZXJQbG90IH0gZnJvbSAnLi9zY2F0dGVyUGxvdCc7XG5cbmNvbnN0IHN2ZyA9IHNlbGVjdCgnc3ZnJyk7XG5cbmNvbnN0IHdpZHRoID0gK3N2Zy5hdHRyKCd3aWR0aCcpO1xuY29uc3QgaGVpZ2h0ID0gK3N2Zy5hdHRyKCdoZWlnaHQnKTtcblxubGV0IGRhdGE7XG5sZXQgeENvbHVtbjtcbmxldCB5Q29sdW1uO1xuXG5jb25zdCBvblhDb2x1bW5DbGlja2VkID0gKGNvbHVtbikgPT4ge1xuICB4Q29sdW1uID0gY29sdW1uO1xuICByZW5kZXIoKTtcbn07XG5cbmNvbnN0IG9uWUNvbHVtbkNsaWNrZWQgPSAoY29sdW1uKSA9PiB7XG4gIHlDb2x1bW4gPSBjb2x1bW47XG4gIHJlbmRlcigpO1xufTtcblxuY29uc3QgcmVuZGVyID0gKCkgPT4ge1xuICBzZWxlY3QoJyN4LW1lbnUnKS5jYWxsKGRyb3Bkb3duTWVudSwge1xuICAgIG9wdGlvbnM6IGRhdGEuY29sdW1ucyxcbiAgICBvbk9wdGlvbkNsaWNrZWQ6IG9uWENvbHVtbkNsaWNrZWQsXG4gICAgc2VsZWN0ZWRPcHRpb246IHhDb2x1bW4sXG4gIH0pO1xuXG4gIHNlbGVjdCgnI3ktbWVudScpLmNhbGwoZHJvcGRvd25NZW51LCB7XG4gICAgb3B0aW9uczogZGF0YS5jb2x1bW5zLFxuICAgIG9uT3B0aW9uQ2xpY2tlZDogb25ZQ29sdW1uQ2xpY2tlZCxcbiAgICBzZWxlY3RlZE9wdGlvbjogeUNvbHVtbixcbiAgfSk7XG5cbiAgc3ZnLmNhbGwoc2NhdHRlclBsb3QsIHtcbiAgICB4VmFsdWU6IChkKSA9PiBkW3hDb2x1bW5dLFxuICAgIHhBeGlzTGFiZWw6IHhDb2x1bW4sXG4gICAgeVZhbHVlOiAoZCkgPT4gZFt5Q29sdW1uXSxcbiAgICBjaXJjbGVSYWRpdXM6IDEwLFxuICAgIHlBeGlzTGFiZWw6IHlDb2x1bW4sXG4gICAgbWFyZ2luOiB7XG4gICAgICB0b3A6IDEwLFxuICAgICAgcmlnaHQ6IDQwLFxuICAgICAgYm90dG9tOiA4OCxcbiAgICAgIGxlZnQ6IDE1MCxcbiAgICB9LFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBkYXRhLFxuICB9KTtcbn07XG5cbmNzdignaGVhcnRfZGF0YS5jc3YnKS50aGVuKChsb2FkZWREYXRhKSA9PiB7XG4gIGRhdGEgPSBsb2FkZWREYXRhO1xuICBkYXRhLmZvckVhY2goKGQpID0+IHtcbiAgICBkLkdlbmRlciA9ICtkLkdlbmRlcjtcbiAgICBkLmFnZSA9ICtkLmFnZTtcbiAgICBkLmN1cnJlbnRTbW9rZXIgPSArZC5jdXJyZW50U21va2VyO1xuICAgIGQuY2lnc1BlckRheSA9ICtkLmNpZ3NQZXJEYXk7XG4gICAgZC5CbG9vZF9QcmVzc3VyZV9NZWRpY2F0aW9uID0gK2QuQmxvb2RfUHJlc3N1cmVfTWVkaWNhdGlvbjtcbiAgICBkLnN0cm9rZSA9ICtkLnN0cm9rZTtcbiAgICBkLmh5cGVydGVuc2lvbiA9ICtkLmh5cGVydGVuc2lvbjtcbiAgICBkLmRpYWJldGVzID0gK2QuZGlhYmV0ZXM7XG4gICAgZC5jaG9sZXN0ZXJvbCA9ICtkLmNob2xlc3Rlcm9sO1xuICAgIGQuc3lzdG9saWNfQmxvb2RfUHJlc3N1cmUgPSArZC5zeXN0b2xpY19CbG9vZF9QcmVzc3VyZTtcbiAgICBkLmRpYXN0b2xpY19CbG9vZF9QcmVzc3VyZSA9ICtkLmRpYXN0b2xpY19CbG9vZF9QcmVzc3VyZTtcbiAgICBkLkJNSSA9ICtkLkJNSTtcbiAgICBkLmhlYXJ0UmF0ZSA9ICtkLmhlYXJ0UmF0ZTtcbiAgICBkLmdsdWNvc2UgPSArZC5nbHVjb3NlO1xuICAgIGQuSGVhcnRfRGlzZWFzZSA9ICtkLkhlYXJ0X0Rpc2Vhc2U7XG4gIH0pO1xuICBcbiAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gIFxuICB4Q29sdW1uID0gZGF0YS5jb2x1bW5zWzRdO1xuICB5Q29sdW1uID0gZGF0YS5jb2x1bW5zWzBdO1xuICByZW5kZXIoKTtcbn0pO1xuIl0sIm5hbWVzIjpbInNjYWxlTGluZWFyIiwiZXh0ZW50IiwiYXhpc0JvdHRvbSIsImF4aXNMZWZ0Iiwic2VsZWN0IiwiY3N2Il0sIm1hcHBpbmdzIjoiOzs7RUFBQTtBQUNBO0VBQ0E7QUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0E7QUFDQTtFQUNPLE1BQU0sWUFBWSxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssS0FBSztFQUNsRCxFQUFFLE1BQU07RUFDUixJQUFJLE9BQU87RUFDWCxJQUFJLGVBQWU7RUFDbkIsSUFBSSxjQUFjO0VBQ2xCLEdBQUcsR0FBRyxLQUFLLENBQUM7RUFDWjtFQUNBLEVBQUUsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQzFELEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0VBQzFDLEtBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQztFQUNsQixPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsV0FBVztFQUMvQixRQUFRLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDcEMsT0FBTyxDQUFDLENBQUM7RUFDVDtFQUNBLEVBQUUsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDMUQsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztFQUNqQyxLQUFLLEtBQUssQ0FBQyxNQUFNLENBQUM7RUFDbEIsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDNUIs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