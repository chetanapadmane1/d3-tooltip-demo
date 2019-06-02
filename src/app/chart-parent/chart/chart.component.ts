import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @ViewChild('analyticsChart') analyticsChart: ElementRef;
  @Input() minMaxDatapoints: any;
  @Input() columnGroup: any[];
  @Input() formattedData: any[];
  @Input() mappedChartData: any[];
  margin = { top: 20, right: 30, bottom: 20, left: 30 };
  startDate: string;
  endDate: string;

  constructor() {
  }

  ngOnInit() {
    this.drawAnalyticsChart();
  }



  drawAnalyticsChart() {
    const element = this.analyticsChart.nativeElement;
    d3.select(element).select('svg').remove();
    const lineColors = d3.scaleOrdinal()
      .domain(this.columnGroup)
      .range(['#0a8ecf', '#7b38a9']);

    const width = element.offsetWidth - (this.margin.left - this.margin.right);
    const height = 300 - this.margin.top - this.margin.bottom;
    const svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('padding-right', this.margin.right);
    const g = svg.append('g')
      .attr('transform', `translate(0,0)`);

    const xAxis = d3.scaleTime()
      .range([0, width]);
    xAxis.domain([this.minMaxDatapoints.xMin, this.minMaxDatapoints.xMax]);
    const yAxis = d3.scaleLinear()
      .range([height, 0]);
    yAxis.domain([this.minMaxDatapoints.yMin, this.minMaxDatapoints.yMax]);

    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x((d: any) => xAxis(+d.date))
      .y((d: any) => yAxis(+d.value));
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + height + ')')
      .style('color', '#e2e2e2')
      .call(this.drawXGridlines(xAxis)
        .tickSize(-height)
      );
    svg.append('g')
      .attr('class', 'grid')
      .style('color', '#e2e2e2')
      .call(this.drawYGridlines(yAxis)
        .tickSize(-width)
      );

    // Draw the line
    const chartLine = svg.selectAll('.chartLine')
      .data(this.formattedData)
      .enter()
      .append('g')
      .attr('class', 'chartLine');

    chartLine.append('path')
      .attr('class', 'line')
      .attr('d', (d: any) => line(d.values))
      .style('stroke', (d: any) => lineColors(d.name) + '');

    svg.selectAll('scatterDots')
      .data(this.formattedData)
      .enter()
      .append('g')
      .style('fill', (d: any) => lineColors(d.name) + '')
      .selectAll('dots')
      .data((d: any) => d.values)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => xAxis(d.date))
      .attr('cy', (d: any) => yAxis(d.value))
      .attr('r', 5);

    // draw tooltip

    const timeScales = this.mappedChartData.map((dataPoint) => xAxis(dataPoint.date));

    console.log('timeScales : ', timeScales);

    const points = g.selectAll('.points')
      .data(this.formattedData)
      .enter()
      .append('g')
      .attr('class', 'points')
      .append('text');

    const focus = g.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('line')
      .attr('class', 'x-hover-line hover-line')
      .attr('y1', 0)
      .attr('y2', height);

    svg.append('rect')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', () => {
        console.log('mouseover');
        focus.style('display', null);
        d3.selectAll('.points text').style('display', null);
      })
      .on('mouseout', () => {
        console.log('mouseout');
        focus.style('display', 'none');
        d3.selectAll('.points text').style('display', 'none');
      })
      .on('mousemove', () => {
        const i = d3.bisect(timeScales, d3.mouse(d3.event.currentTarget)[0], 1);
        const di = this.mappedChartData[i - 1];
        focus.attr('transform', 'translate(' + xAxis(di.date) + ',0)');
        focus.style('border', '2px solid blue')
          .style('height', '7px')
          .style('width', '7px');
        d3.selectAll('.points text')
        // .select('span')
          .attr('x', (d: any) => xAxis(di.date) + 5)
          .attr('y', (d: any) => yAxis(d.values[i - 1].value + 5))
          .text((d: any) => d.values[i - 1].value)
          .style('fill', (d: any) => lineColors(d.name) + '')
          .attr('height', '50px')
          .style('padding', '1rem')
          .attr('border', '1px solid red')
      });
  }

  resizeChart() {
    this.drawAnalyticsChart();
  }


  drawXGridlines(xAxis) {
    return d3.axisBottom(xAxis)
      .ticks(13);
  }
  drawYGridlines(yAxis) {
    return d3.axisLeft(yAxis)
      .ticks(4);
  }
}
