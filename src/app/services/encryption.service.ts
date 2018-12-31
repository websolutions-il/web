import { Injectable } from '@angular/core';

@Injectable()
export class EncryptionService{
     
    encode(str) {
        return str.replace(/./g, function(c) {
            return ('00' + c.charCodeAt(0)).slice(-3);
        });
    }
    
     decode(str) {
        return str.replace(/.{3}/g, function(c) {
            return String.fromCharCode(c);
        });
    }
}