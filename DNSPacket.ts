import { DNSBuffer } from "./DNSBuffer";
import { DNSHeader } from "./DNSHeader";
import { DNSQuestion } from "./DNSQuestion";
import { DNSAnswer } from "./DNSAnswer";

export class DNSPacket {
    private readonly packet: Buffer

    constructor(hostname: string, qtype: string) {
        let header = DNSHeader.HeaderEncode()
        let question = DNSQuestion.QuestionEncode(hostname, qtype)
        this.packet = Buffer.concat([header, question])
    }

    getPacket(): Buffer {
        return this.packet
    }

    Decode(response: Buffer) {
        //Idhr anCount wala kaam krna hai. Utni loop chalo jitne answers hain aur har iteration mein DNSAnswer se bolo ke buffer se ek answer extact krde.
        let dnsBuffer = new DNSBuffer
        dnsBuffer.replace(response)
        let header = DNSHeader.HeaderDecode(dnsBuffer)
        let question = DNSQuestion.QuestionDecode(dnsBuffer)
        if (header.getANCOUNT() == 0)
            return { ...header, ...question }
        else {
            let answers = DNSAnswer.AnswerDecode(dnsBuffer)
            return { ...header, ...question, ...answers }
        }
    }

}