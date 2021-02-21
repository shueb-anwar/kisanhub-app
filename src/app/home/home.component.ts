import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common/common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

import { Metrix } from './../metrix';
import { filter, map, toNumber } from 'lodash';

interface SelectData {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	json: string = "";
	items: Metrix[] = [];
	monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
	locations: SelectData[] = [
	    {value: 'UK', viewValue: 'UK'},
	    {value: 'England', viewValue: 'England'},
	    {value: 'Scotland', viewValue: 'Scotland'},
	    {value: 'Wales', viewValue: 'Wales'}
	];

	metrics: SelectData[] = [
	    {value: 'Tmax', viewValue: 'Maximum Temperature'},
	    {value: 'Tmin', viewValue: 'Minimum Temperature'},
	    {value: 'Rainfall', viewValue: 'Rainfall'}
	];

	form: FormGroup;

	public barChartOptions: ChartOptions = {
		responsive: true,
	};

	public barChartLabels: Label[] = [];
	public barChartLegend = false;
	public barChartPlugins = [];

	public barChartData: ChartDataSets[] = [{
		data: [],
		label: 'Series ',
		fill: false,
		borderWidth: 1,
		borderColor: '#3949AB',
		hoverBorderColor: '#303F9F',
		backgroundColor: '#3F51B5',
		hoverBackgroundColor: '#3949AB',
		pointBackgroundColor: '#303F9F',
	}];

	constructor(private commonService: CommonService, fb: FormBuilder) {
	  	this.form = fb.group({
	  		metrics: new FormControl('Rainfall', Validators.required),
	  		location: new FormControl('England', Validators.required),
	  		start: new FormControl(new Date(2016, 1), Validators.required),
		    end: new FormControl(new Date(2017, 11), Validators.required),
		    charttype: new FormControl('bar')
	    });

	    this.form.controls.start.valueChanges.subscribe( value => {
	    	this.handleChange(this);
	    });

	    this.form.controls.end.valueChanges.subscribe( value => {
	    	this.handleChange(this);
	    });
	}

	ngOnInit(): void {
		
	}

	handleChange(_this: any) {
		window.setTimeout(function() {
    		_this.renderChart(_this.items)
    	});
	}

	loadData() {
		var { metrics, location} = this.form.value, json = `${metrics}-${location}.json`;

		if(this.form.valid) {
			if(this.json == json) {
				this.renderChart(this.items);
			} else {
				this.json = json;

				this.commonService.getWeather(json).subscribe( res => {
					this.items = res;
					this.renderChart(res);
				});
			}
		}
	}

	renderChart(data: Metrix[]): void {
		var { start, end } = this.form.value;

		var data = filter(data, function(item: Metrix) {
			var temp = new Date();

			temp.setMonth(item.month - 1);
			temp.setFullYear(item.year);

			return start.getTime() < temp.getTime() && end.getTime() > temp.getTime();
		});

		this.barChartLabels = map(data, (item: Metrix) => {
			var temp = new Date();
			temp.setMonth(item.month - 1);
			return `${this.monthNames[temp.getMonth()]}, ${item.year}`;
		});

		this.barChartData[0].data = map(data, item => {
			return toNumber(item.value);
		})
	}
}
