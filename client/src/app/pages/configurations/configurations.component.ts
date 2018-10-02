import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MyAuthService } from '../../services/auth.service';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css']
})
export class ConfigurationsComponent implements OnInit {

  currentUser: any;

  constructor(private router: Router, private authService: MyAuthService) {

   }

  ngOnInit() {
    var that = this;
    this.authService.userAuth.subscribe(function(userData){
      that.currentUser = userData;
      if(!that.currentUser || that.currentUser == null){
          console.log("No USER FOUND IN PlacesPage: >>> ");
      }else{
          that.fetchAnalytics();
      }
    });
  }

  fetchAnalytics(){
    console.log("In fetchAnalytics: >> ");
  }

}
