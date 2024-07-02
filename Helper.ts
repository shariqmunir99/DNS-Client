import { DNSBuffer } from "./DNSBuffer";

 export class Helper{
    
    // Given a string of Hex Values, returns a string holding the binary bits of the hex.
    static  convertHexToBinary(hexString: string) {
        let binaryString: string = ""

        //convert Flags Hex String to its equivalent Binary String.
        for (let i = 0; i < hexString.length; i += 2) {

            const hexPair = hexString.substr(i, 2);
            const decimalValue = parseInt(hexPair, 16);
            const binaryValue = decimalValue.toString(2).padStart(8, '0');

            binaryString += binaryValue;
        }
        return binaryString
    }

    //Given a number, return the type of DNSQuery according to the UDP Message Protocol
    static getQTYPE(number: Number): string{
        if(number == 1) return "A";
        if(number == 28) return "AAAA";
        return "Invalid QTYPE";
    }

    //Given a number, return the Class of DNSQuery according to the UDP Message Protocol
    static getQCLASS(number: Number): string{
        if(number == 1) return "IN";
        return "Invalid QCLASS";
    }

    static getDomainName(buffer: DNSBuffer): string{
        
        let domainName = ""
        
        //Parsing Second Level Domain
        let sldLength = buffer.readUInt(1)
        let sld = buffer.readAscii(sldLength)

        let tldLength = buffer.readUInt(1)
        let tld = buffer.readAscii(tldLength, true)
        //Combing both to form domain name
        domainName = sld + "." + tld
        return domainName
    }

}