import { Component, OnInit } from '@angular/core';
import { SalesChartService } from 'src/app/_Services/Charts/sales-chart.service';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';

@Component({
  selector: 'app-salescharts',
  templateUrl: './salescharts.component.html',
  styleUrls: ['./salescharts.component.css']
})
export class SaleschartsComponent implements OnInit {

 
  constructor(private chartservice : SalesChartService,private dataSharingService:DataSharingService) { 
   }

   legendPosition: any = 'below';
   view: any = [800, 400];
   colorScheme :any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  //view: any = [100, 100];
 
  saleData:any = [];
  userData:any = [];


  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  
  multi = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "1990",
          "value": 62000000
        },
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        }
      ]
    },
  
    {
      "name": "USA",
      "series": [
        {
          "name": "1990",
          "value": 250000000
        },
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        }
      ]
    },
  
    {
      "name": "France",
      "series": [
        {
          "name": "1990",
          "value": 58000000
        },
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        }
      ]
    },
    {
      "name": "UK",
      "series": [
        {
          "name": "1990",
          "value": 57000000
        },
        {
          "name": "2010",
          "value": 62000000
        }
      ]
    }
  ];

   single = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
    {
      "name": "Italy",
      "value": 4500000
    },
    {
      "name": "Spain",
      "value": 5730000
    },{
      "name": "UK",
      "value": 8200000
    }
  ];

    multi2 = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "1990",
          "value": 62000000
        },
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        }
      ]
    },
  
    {
      "name": "USA",
      "series": [
        {
          "name": "1990",
          "value": 250000000
        },
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        }
      ]
    },
  
    {
      "name": "France",
      "series": [
        {
          "name": "1990",
          "value": 58000000
        },
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        }
      ]
    },
    {
      "name": "UK",
      "series": [
        {
          "name": "1990",
          "value": 57000000
        },
        {
          "name": "2010",
          "value": 62000000
        }
      ]
    }
  ];
  
  
  onSelect(event: any) {
    console.log(event);
  }
  ngOnInit(): void {
    this.dataSharingService.showLoader();
     this.chartservice.GetTopSales().subscribe((data)=>{
             this.saleData = data;
             this.dataSharingService.hideLoader();
     });

     this.chartservice.GetUserTransactions().subscribe((data)=>{
      this.userData = data;
      this.dataSharingService.hideLoader();
});
  }

}
