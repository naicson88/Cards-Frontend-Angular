import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as ClassicEditor from '../../../../../ckeditor5/build/ckeditor';


@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.css']
})
export class CkeditorComponent implements OnInit {

  @Input() myEditor: any;

  constructor() { }

  public Editor = ClassicEditor  

  ngOnInit() {
    
  }

    
  getData(element:any):string {
    let data = element.data
    return data;
  }

}
