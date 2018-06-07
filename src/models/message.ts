import { Intent } from './intent';

export class Message {

    message: string;
    richMessage: Intent;
    user: string;

    constructor(message: any, richMessage: Intent, user: string) {
        this.message = message;
        this.richMessage = richMessage;
        this.user = user;
    }
}