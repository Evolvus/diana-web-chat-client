
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Intent } from 'models/intent';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Message } from '../models/message';
import { browser } from 'protractor';


@Injectable()
export class IntentService {

    NLP_SERVICE_URL = environment.nlpUrl;
    message: Message;
    intentsChanged = new Subject<Message>();
    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(private http: HttpClient) {

    }



    /**
     * 
     * @param input
     */
    public query(input: string) {
        this.http.post(`${this.NLP_SERVICE_URL}/diana?query=${input}`, { headers: this.headers })
            .subscribe((res: any) => {
                console.log(`Response Body Type ${typeof res.body}`);
                if (typeof res.body === 'string') {
                    this.message = new Message(res.body, null, 'diana');
                } else {
                    const randomInt = this.getRandomInt(res.body.displayText.length);
                    if (res.body.type === 'RICH') {
                        const intent = res.body;
                        this.message = new Message(intent.displayText[0], intent, 'diana');
                    } else {
                        console.log(randomInt, res.body.displayText[randomInt]);
                        this.message = new Message(res.body.displayText[randomInt], null, 'diana');
                    }
                }

                this.intentsChanged.next(this.message);
            }, err => {
                console.log('Error ', JSON.stringify(err, null, 2));
                this.message = new Message(err.error.body, null, 'diana');
                this.intentsChanged.next(this.message);
            });
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}