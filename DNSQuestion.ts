import { DNSBuffer } from "./DNSBuffer";
import { Helper } from "./Helper";

export class DNSQuestion{

    //Remove static after 
    static QuestionDecode(buffer: DNSBuffer){
        let domainName = Helper.getDomainName(buffer)
        let QTYPE = Helper.getQTYPE(buffer.readUInt(2));
        let QCLASS  = Helper.getQCLASS(buffer.readUInt(2));
        return {labelSequence: domainName, QTYPE, QCLASS}
        
    }

    static QuestionEncode(hostname: string, qtype:string):Buffer{
        let labelSequence = this.getLabelSequence(hostname)
        const QTYPE = this.getQTYPE(qtype)
        

        const QCLASS = Buffer.alloc(2);
        QCLASS.writeUInt16BE(0x0001, 0); // QCLASS: IN (Internet)
        return Buffer.concat([labelSequence, QTYPE, QCLASS]);
    }
    
    static getLabelSequence(hostname:string):Buffer{
        const parts = hostname.split('.');
        const qnameBuffers = parts.map(part => {
            const length = Buffer.alloc(1);
            length.writeUInt8(part.length, 0);
            const namePart = Buffer.from(part);
            return Buffer.concat([length, namePart]);
        });
        const qname = Buffer.concat([...qnameBuffers, Buffer.from([0])]);
        return qname;
    }
    static getQTYPE(qtype:string){
        const QTYPE = Buffer.alloc(2);
        if(qtype == 'ipv4')
            QTYPE.writeUInt16BE(0x0001, 0); // QTYPE: A record
        else 
            QTYPE.writeUInt16BE(0x001C, 0); // QTYPE: AAAA record
        return QTYPE
    }
}