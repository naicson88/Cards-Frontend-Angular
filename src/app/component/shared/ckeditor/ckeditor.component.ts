import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '../../../../../ckeditor5/build/ckeditor';


@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.css']
})
export class CkeditorComponent implements OnInit {

  constructor() { }

  public Editor = ClassicEditor  
  
  public config = {
    toolbar: [ 'heading', '|',
      'fontfamily','fontsize',
      'alignment',
      'fontColor','fontBackgroundColor', '|',
      'bold', 'italic', 'custombutton', 'strikethrough','underline','subscript','superscript','|',
      'link','|',
      'outdent','indent','|',
      'bulletedList','numberedList','|',
      'code','codeBlock','|',
      'insertTable','|',
      'imageUpload','blockQuote','|',
      'undo','redo','|',
      'youtube',
      'mediaEmbed'
    ]
  }

  ngOnInit() {

  }

}
