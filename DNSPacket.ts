import { DNSBuffer } from "./DNSBuffer";
import { DNSHeader } from "./DNSHeader";
import { DNSQuestion } from "./DNSQuestion";
import { DNSAnswer } from "./DNSAnswer";

export class DNSPacket {

    private constructor(private readonly header: DNSHeader, private readonly question: DNSQuestion, private readonly answers: DNSAnswer[]) {
    }



    static Encode(hostname: string, qtype: string) {
        let header = DNSHeader.HeaderEncode()
        let question = DNSQuestion.QuestionEncode(hostname, qtype)
        return Buffer.concat([header, question])

    }

    static Decode(response: Buffer) {
        let dnsBuffer = new DNSBuffer
        dnsBuffer.replace(response)
        let header = DNSHeader.HeaderDecode(dnsBuffer)
        let question = DNSQuestion.QuestionDecode(dnsBuffer)
        let answers: DNSAnswer[] = [];
        for (let i = 0; i < header.getANCOUNT(); i++) {
            answers.push(DNSAnswer.AnswerDecode(dnsBuffer))
        }
        return new DNSPacket(header, question, answers)
    }

    //Getters

    getHeader(): DNSHeader {
        return this.header
    }

    getQuestion(): DNSQuestion {
        return this.question
    }

    getAnswer(): DNSAnswer[] {
        return this.answers
    }

}