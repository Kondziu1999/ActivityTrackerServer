import {Component, Input} from '@angular/core';
import {UserLogsCountBucket} from "../../models/users-models";

@Component({
  selector: 'app-activities-count-chart',
  templateUrl: './activities-count-chart.component.html',
  styleUrls: ['./activities-count-chart.component.scss']
})
export class ActivitiesCountChartComponent {
  data: any[] = [];
  @Input() set buckets(buckets: UserLogsCountBucket[]) {
    this.data = [
      {
        "name": "Activity",
        "series": buckets.map(x => ({
          name: new Date(x.from),
          value: x.count
        }))
      },
    ];
  }
  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  @Input() xAxisLabel: string = 'name';
  @Input() yAxisLabel: string = 'value';
  timeline: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

}
