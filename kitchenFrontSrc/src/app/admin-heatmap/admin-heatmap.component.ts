import { Component, OnInit } from '@angular/core';
declare var google:any;
import { KitchenService} from '../service/index';


@Component({
  selector: 'app-admin-heatmap',
  templateUrl: './admin-heatmap.component.html',
  styleUrls: ['./admin-heatmap.component.css']
})
export class AdminHeatmapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


@Component({
  selector: 'app-admin-heatmap-dashboard',
  templateUrl: './admin-heatmap-dashboard.component.html',
  styleUrls: ['./admin-heatmap.component.css']
})
export class AdminHeatmapDashboardComponent implements OnInit {
    map:any;
    heatmap : any;
    heatmaplatlng: any = [];
  constructor(public kitchenService: KitchenService) { }

  ngOnInit() {
    this.initRun();
  }

  initRun(){
    this.heatmaplatlng = [];
    this.kitchenService.getAllKitchenheatmap().subscribe((data) => {
    var datamessage = data.message;
    var temp_data = [];
    for(var i=0; i<datamessage.length; i++){
       
        if(typeof datamessage[i].lat != 'undefined' && datamessage[i].lat != ''){
        let obj = new google.maps.LatLng(parseFloat(datamessage[i].lat) , parseFloat(datamessage[i].lng));        
        temp_data.push(obj);
        }
        }
       this.heatmaplatlng = temp_data;
       this.initMap();
      });
    }   

initMap() {
  this.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 22.210928, lng: 113.552971},
    mapTypeId: 'satellite'
  });

  this.heatmap = new google.maps.visualization.HeatmapLayer({
    data: this.getPoints(),
    map: this.map
  });
}

toggleHeatmap() {
  this.heatmap.setMap(this.heatmap.getMap() ? null : this.map);
}

 changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  this.heatmap.set('gradient', this.heatmap.get('gradient') ? null : gradient);
}

 changeRadius() {
  this.heatmap.set('radius', this.heatmap.get('radius') ? null : 20);
}

 changeOpacity() {
  this.heatmap.set('opacity', this.heatmap.get('opacity') ? null : 0.2);
}

// Heatmap data: 500 Points
 getPoints() {
  return this.heatmaplatlng;
}
}
