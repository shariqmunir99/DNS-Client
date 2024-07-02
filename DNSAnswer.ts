import { DNSBuffer } from "./DNSBuffer";
import { DNSPacket } from "./DNSPacket";
import { utils } from "./utils";

interface Answer{
    Domain_Name: string;
    QTYPE: string;
    QCLASS: string;
    TTL: number;
    LEN: number;
    IP: string;
}


export class DNSAnswer{
private constructor(
    private readonly name:string,
    private readonly qType:string,
    private readonly qClass:string,
    private readonly TTL:number,
    private readonly LEN:number,
    private readonly IP:string,
){}

    static AnswerDecode(buffer: DNSBuffer):DNSAnswer{
        let answers: Answer; 
        let Domain_Name = this.getDomainName(buffer)
        let QTYPE = utils.getQTYPE(buffer.readUInt(2))
        let QCLASS = utils.getQCLASS(buffer.readUInt(2))
        let TTL = buffer.readUInt(4)
        let LEN = buffer.readUInt(2)
        let IP = "";
        // use macros for 4.
        if(LEN == 4)
            IP = this.getIPv4(buffer)
        else
            IP = this.getIPv6(buffer)
    

        return new DNSAnswer(Domain_Name, QTYPE, QCLASS, TTL,LEN, IP)
    }



    //Getters
    getName():string{
        return this.name
    }

    getQTYPE():string{
        return this.name
    }

    getQCLASS():string{
        return this.name
    }

    getTTL():number{
        return this.TTL
    }

    getLEN():number{
        return this.LEN
    }

    getIP():string{
        return this.IP
    }


    static getDomainName(buffer: DNSBuffer): string{
        let offsetCheck = buffer.peek(1)
        let isOffset = false
        if (offsetCheck.slice(0, 2) === "11"){
            isOffset = true;
        }
        else {
            isOffset = false
        }

        if(isOffset){
            //Extracting the last 14 bits and converting them to base 10 to get offset value.
            let offset = parseInt(buffer.readBinaryByte(2).slice(2), 2)
            let domainNameBuffer: Buffer = buffer.readBufferFrom(offset)
            let dnsBuffer = new DNSBuffer;
            dnsBuffer.replace(domainNameBuffer)
            return utils.getDomainName(dnsBuffer)
            
        }
        else{
            return utils.getDomainName(buffer)
        }

    }

    static getIPv4(buffer:DNSBuffer):string{
        let ip = buffer.readUInt(1) + "." + buffer.readUInt(1) + "." + buffer.readUInt(1) + "." + buffer.readUInt(1)
        return ip
    }

    static getIPv6(buffer:DNSBuffer):string{
        let ip = buffer.readUInt(2) + ":" + buffer.readUInt(2) + ":" + buffer.readUInt(2) + ":" + buffer.readUInt(2) + ":" + buffer.readUInt(2) + ":" + buffer.readUInt(2) + ":" + this.getIPv4(buffer) 
        return ip
    }



}