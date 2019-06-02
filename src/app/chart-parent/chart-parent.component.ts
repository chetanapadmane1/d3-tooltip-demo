import { Component, OnInit } from '@angular/core';
import { chartData } from 'src/app/chart.stub';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-parent',
  templateUrl: './chart-parent.component.html',
  styleUrls: ['./chart-parent.component.scss']
})
export class ChartParentComponent implements OnInit {

  constructor() { }

  minMaxDatapoints;
  columnGroup;
  formattedData;
  mappedChartData;
  ngOnInit() {
    this.generateChartData();
  }


  generateChartData() {
    console.log('generateChartData');
    this.mappedChartData = chartData;
    this.minMaxDatapoints = this.getMinMaxDataPoints(this.mappedChartData);
    this.columnGroup = Object.keys(this.mappedChartData[0]).slice(1);
    this.formattedData = this.formatAnalyticsData(this.mappedChartData, this.columnGroup);
  }
  formatAnalyticsData(analyticsData, columnGroup) {
    const formattedData = columnGroup.map((groupName) => {
      return {
        name: groupName,
        values: analyticsData.map((d) => {
          return {
            date: d.date,
            value: +d[groupName]
          };
        })
      };
    });
    return formattedData;
  }
  getMinMaxDataPoints(analyticsData: any[]) {
    const parseTime = d3.timeParse('%d-%b-%Y');
    let min = analyticsData[0].kpiCount;
    let max = 0;
    for (const d of analyticsData) {
      d.date = parseTime(d.date);
      d.kpiCount = +d.kpiCount;
      d.goalsCount = +d.goalsCount;
    }
    analyticsData.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });

    for (const d of analyticsData) {
      const tempMin = Math.min(d.kpiCount, d.goalsCount);
      const tempMax = Math.max(d.kpiCount, d.goalsCount);
      min = min > tempMin ? tempMin : min;
      max = max > tempMax ? max : tempMax;
    }
    return { xMin: analyticsData[0].date, xMax: analyticsData[analyticsData.length - 1].date, yMin: min, yMax: max };
  }
}
