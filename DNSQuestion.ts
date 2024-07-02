import { DNSBuffer } from "./DNSBuffer";
import { utils } from "./utils";

export class DNSQuestion{

    private constructor(private readonly domainName: string,
        private readonly qType: string,
        private readonly qClass: string
    ){}
    //Remove static after 
    static QuestionDecode(buffer: DNSBuffer){
        let domainName = utils.getDomainName(buffer)
        let QTYPE = utils.getQTYPE(buffer.readUInt(2));
        let QCLASS  = utils.getQCLASS(buffer.readUInt(2));
        return new DNSQuestion(domainName, QTYPE, QCLASS)
        
    }

    static QuestionEncode(hostname: string, qtype:string):Buffer{
        let domainName = this.parseDomainName(hostname)
        const QTYPE = this.parseQTYPE(qtype)
        

        const QCLASS = Buffer.alloc(2);
        QCLASS.writeUInt16BE(0x0001, 0); // QCLASS: IN (Internet)
        return Buffer.concat([domainName, QTYPE, QCLASS]);
    }
    
    static parseDomainName(hostname:string):Buffer{
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
    static parseQTYPE(qtype:string){
        const QTYPE = Buffer.alloc(2);
        if(qtype == 'ipv4')
            QTYPE.writeUInt16BE(0x0001, 0); // QTYPE: A record
        else 
            QTYPE.writeUInt16BE(0x001C, 0); // QTYPE: AAAA record
        return QTYPE
    }


    //getters
    getQTYPE():string{
        return this.qType
    }

    getDomainName():string{
        return this.domainName
    }
}