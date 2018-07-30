import { Component, OnInit, ViewChild } from '@angular/core';

import { IntentService } from '../../services/intent.service';
import { Message } from '../../models/message';
import { Subscription } from 'rxjs/Subscription';
import { Howl } from 'howler';
import { NgxAutoScroll } from 'ngx-auto-scroll';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild(NgxAutoScroll) ngxAutoScroll: NgxAutoScroll;

  text = '';
  messages: Message[];
  subscription: Subscription;

  sound: any;
  constructor(private intentService: IntentService) {

    this.sound = new Howl({
      src: ['assets/tone.mp3'],
      html5: true
    });
  }

  ngOnInit() {
    this.messages = [];
    this.subscription = this.intentService.intentsChanged.subscribe((msg: Message) => {
      this.messages.push(msg);
      this.sound.play();
    });
  }

  getQuery() {
    if (this.text.trim() !== '') {
      const msg = new Message(this.text.trim(), null, 'user');
      //this.sound.play();
      this.messages.push(msg);
      this.intentService.query(this.text);
      this.text = '';
    }
  }

  btnClick(input: string) {
    this.text = input;
    this.getQuery();
  }

  public forceScrollDown(): void {
    this.ngxAutoScroll.forceScrollDown();
  }

  onKey(event: any) { // without type info
    if (event.keyCode === 13) {
      this.getQuery();
    }
  }


}
