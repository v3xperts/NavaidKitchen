import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {	
	
    @Input() rating: number;
    @Input() type: number;
    @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();
    inpustName:string;
			
	ngOnInit() {
	this.inpustName = this.type + '_rating';
	}

	public onClick(rating: number): void {
	this.rating = rating;
	this.ratingClick.emit({
	    type: this.type,
	    rating: rating
	});
	}

}
