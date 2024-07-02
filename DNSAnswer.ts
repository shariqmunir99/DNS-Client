import { DNSBuffer } from "./DNSBuffer";
import { DNSPacket } from "./DNSPacket";
import { utils } from "./utils";

interface Answer {
    Domain_Name: string;
    QTYPE: string;
    QCLASS: string;
    TTL: number;
    LEN: number;
    Record: string;
}


export class DNSAnswer {
    private constructor(
        private readonly name: string,
        private readonly qType: string,
        private readonly qClass: string,
        private readonly TTL: number,
        private readonly LEN: number,
        private readonly Record: string,
    ) { }

    static AnswerDecode(buffer: DNSBuffer): DNSAnswer {
        let answers: Answer;
        let Domain_Name = utils.getDomainName(buffer)
        let QTYPE = utils.parseQTYPE(buffer.readUInt(2))
        let QCLASS = utils.getQCLASS(buffer.readUInt(2))
        let TTL = buffer.readUInt(4)
        let LEN = buffer.readUInt(2)
        let Record = "";
        // use macros for 4.
        if (LEN == 4)
            Record = this.getIPv4(buffer)
        else if(LEN == 16)
            Record = this.getIPv6(buffer)
        else
            Record = utils.getDomainName(buffer)


        return new DNSAnswer(Domain_Name, QTYPE, QCLASS, TTL, LEN, Record)
    }



    //Getters
    getName(): string {
        return this.name
    }

    getQTYPE(): string {
        return this.name
    }

    getQCLASS(): string {
        return this.name
    }

    getTTL(): number {
        return this.TTL
    }

    getLEN(): number {
        return this.LEN
    }

    getRecord(): string {
        return this.Record
    }



    static getIPv4(buffer: DNSBuffer): string {
        let ip = buffer.readUInt(1) + "." + buffer.readUInt(1) + "." + buffer.readUInt(1) + "." + buffer.readUInt(1)
        return ip
    }

    static getIPv6(buffer: DNSBuffer): string {
        let ip = buffer.readUInt(2) + ":" + buffer.readUInt(2) + ":" + buffer.readUInt(2) + ":" + buffer.readUInt(2) + ":" + buffer.readUInt(2) + ":" + buffer.readUInt(2) + ":" + this.getIPv4(buffer)
        return ip
    }



}