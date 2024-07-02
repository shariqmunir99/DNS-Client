import { DNSBuffer } from "./DNSBuffer";
import { DNSHeader } from "./DNSHeader";
import { DNSQuestion } from "./DNSQuestion";

export class DNSPacket{
    private readonly packet: Buffer

    constructor(hostname:string, qtype:string){
        let header = DNSHeader.HeaderEncode()
        let question = DNSQuestion.QuestionEncode(hostname,qtype)
        this.packet = Buffer.concat([header, question])
    }

    getPacket():Buffer{
        return this.packet
    }

}