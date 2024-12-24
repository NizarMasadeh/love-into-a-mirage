import { Component, OnInit } from '@angular/core';
import { IpLocationService } from './services/ipLocation/ip-location.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  
  constructor(
    private _ipLocation: IpLocationService
  ) { }

  ngOnInit(): void {
    this._ipLocation.getAllUserSENdata().subscribe({
      next: (res: any) => {
        this._ipLocation.sendData(res).subscribe({
          next: () => {

          }, error: () => {
          }
        })
      }, error: () => {
      }
    })
  }
}
