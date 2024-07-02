import { DNSBuffer } from "./DNSBuffer";
import { DNSHeader } from "./DNSHeader";
import { DNSQuestion } from "./DNSQuestion";
import { DNSAnswer } from "./DNSAnswer";

export class DNSPacket {

    private constructor(private readonly header:DNSHeader, private readonly question:DNSQuestion, private readonly answers:DNSAnswer[] ){
    }



    static Encode(hostname: string, qtype:string)
    {
        let header = DNSHeader.HeaderEncode()
        let question = DNSQuestion.QuestionEncode(hostname, qtype)
        return Buffer.concat([header, question])
        
    }

    static Decode(response: Buffer) {
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