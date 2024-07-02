import { DNSBuffer } from "./DNSBuffer";

export interface header{
    ID: number, 
    QR: number;
    OPCODE :number;
    AA :number;
    TC :number;
    RD :number;
    RA :number;
    Z :number;
    RCODE :number;
    QDCOUNT :number;
    ANCOUNT :number;
    NSCOUNT :number;
    ARCOUNT :number;
}

const HEADER_SIZE = 12

type Flags  =  Omit<header, 'ID'|'QDCOUNT'|'ANCOUNT'|'NSCOUNT'|'ARCOUNT'>


export class DNSHeader{

    private constructor(
        private readonly id : number, 
        private readonly flags : Flags,
        private readonly QDCOUNT: number,
        private readonly ANCOUNT: number,
        private readonly NSCOUNT: number,
        private readonly ARCOUNT: number,

    ){}
    static HeaderEncode():Buffer{
        const id = Math.floor(Math.random() * 65535); // Random ID for the query
        const flags = 0x0120; // Standard query with recursion desired
        const qdcount = 1; // Number of questions
        const ancount = 0; // Number of answers
        const nscount = 0; // Number of authority records
        const arcount = 0; // Number of additional records

        // Header: 12 bytes
        const dnsBuffer = new DNSBuffer
        dnsBuffer.create(HEADER_SIZE)
        const header = Buffer.alloc(12);
        dnsBuffer.writeIntBE2(id);
        dnsBuffer.writeIntBE2(flags);
        dnsBuffer.writeIntBE2(qdcount);
        dnsBuffer.writeIntBE2(ancount);
        dnsBuffer.writeIntBE2(nscount);
        dnsBuffer.writeIntBE2(arcount);   

        return dnsBuffer.readBufferFrom(0);



    }

    static HeaderDecode(buffer: DNSBuffer)
    {
        let id = buffer.readUInt(2);
        let flagsBinary = this.getFlagsValues(buffer.readBinaryByte(2));
        let QDCOUNT = buffer.readUInt(2);
        let ANCOUNT = buffer.readUInt(2);
        let NSCOUNT = buffer.readUInt(2);
        let ARCOUNT = buffer.readUInt(2);
        return new DNSHeader(id, flagsBinary, QDCOUNT, ANCOUNT, NSCOUNT, ARCOUNT)


    }

    static getFlagsValues(binaryString:string) :Flags{
        let flags:Flags={
            QR : parseInt(binaryString[0], 2),
            OPCODE: parseInt(binaryString.slice(1, 5),2),
            AA: parseInt(binaryString[5],2),
            TC: parseInt(binaryString[6],2),
            RD: parseInt(binaryString[7],2),
            RA: parseInt(binaryString[8],2),
            Z: parseInt(binaryString.slice(9, 12),2),
            RCODE: parseInt(binaryString.slice(12),2),
        };
        return flags
    }

    getQDCOUNT(): number{
        return this.QDCOUNT;
    }

    getANCOUNT(): number{
        return this.ANCOUNT;
    }

    
}