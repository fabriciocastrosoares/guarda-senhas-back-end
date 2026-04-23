import { Injectable } from '@nestjs/common';
import Cryptr from 'cryptr';


@Injectable()
export class CryptrService {
    private SALT = 10;
    private cryptr: Cryptr;

    constructor() {
        const Cryptr = require("cryptr");
        this.cryptr = new Cryptr(process.env.CRYPTR_SECRET, { saltLength: this.SALT });
    }

    encrypt(data: string) {
        return this.cryptr.encrypt(data);
    }

    decrypt(encryptedValue: string) {
        return this.cryptr.decrypt(encryptedValue);
    }

}
