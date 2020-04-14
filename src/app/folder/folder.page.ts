import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute) { 
    let systemDark = window.matchMedia("(prefers-color-scheme: light)");
    systemDark.addListener(this.colorTest);

      document.body.setAttribute('data-theme', 'light');
  }

  colorTest(systemInitiatedDark) {
    if (systemInitiatedDark.matches) {
      document.body.setAttribute('data-theme', 'dark');		
    } else {
      document.body.setAttribute('data-theme', 'light');
    }
  }
  

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }


}
