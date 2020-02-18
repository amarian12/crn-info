import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public items1: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.items1 = [
            {label: 'Home', icon: 'fas fa-house-damage'},
            {label: 'Crns', icon: 'fas fa-compress-arrows-alt'},
            {label: 'Legders', icon: 'fas fa-fw fa-book'},
            {label: 'Token', icon: 'fas fa-cubes'},
            {label: 'Nodes', icon: 'fas fa-share-alt'},
            {label: 'More', icon: 'fas fa-bars'},
            {label: 'Social', icon: 'fab fa-twitter'}
        ];
  }

}
