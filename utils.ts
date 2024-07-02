import { DNSBuffer } from "./DNSBuffer";

export class utils {

    // Given a string of Hex Values, returns a string holding the binary bits of the hex.
    static convertHexToBinary(hexString: string) {
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
    static getQTYPE(number: Number): string {
        if (number == 1) return "A";
        if (number == 28) return "AAAA";
        return "Invalid QTYPE";
    }

    //Given a number, return the Class of DNSQuery according to the UDP Message Protocol
    static getQCLASS(number: Number): string {
        if (number == 1) return "IN";
        return "Invalid QCLASS";
    }


    //Recursively fetches the domain name from a buffer.
    static getDomainName(buff: DNSBuffer): string {
        let nextByte = buff.peek(1)
        let str = ""

        //Base Case
        if (nextByte === "00000000") // Checking if the next byte is null or not.
        {
            //Reading 1 bytes to increment the offset by 1 for null character
            buff.readUInt(1);
            return ""
        }
        else if (nextByte.slice(0, 2) === "11") {
            let offset = parseInt(buff.readBinaryByte(2).slice(2), 2)
            let domainNameBuffer: Buffer = buff.readBufferFrom(offset)
            let dnsBuffer = new DNSBuffer;
            dnsBuffer.replace(domainNameBuffer)
            str += this.getDomainName(dnsBuffer)
        }
        else {
            let length = buff.readUInt(1)
            let name = buff.readAscii(length);
            str += name + "." + this.getDomainName(buff)
        }
        return str;
    }

}