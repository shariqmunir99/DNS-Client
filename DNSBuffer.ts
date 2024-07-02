import { Helper } from "./Helper";

export class DNSBuffer {
    buffer: Buffer;
    offset = 0;
    
    create(length:number){
        //Creates a buffer of length and sets offset to 0
        this.buffer = Buffer.alloc(length)
        this.offset = 0
    }

    replace(buf: Buffer)
    {
        //Replaces the current buffer with buf and sets the offset value to 0.
        this.buffer = buf
        this.offset = 0
    }

    peek(length: number): string {
        //Reads 2 bytes from buffer and increments offset by 2
        //Return the binaryValue of bytes as a string.
        if (!this.checkLength(length)) {
            //This Packet is Corrupt.Do something!!!.
        }
        let bytesRead = this.buffer.slice(this.offset, this.offset + length)
        let hexString = bytesRead.toString('hex')
        let bytesToReturn = Helper.convertHexToBinary(hexString)
        return bytesToReturn
    }

    writeIntBE2(value:number){
        this.buffer.writeUInt16BE(value, this.offset)
        this.offset += 2
    }

    



    readUInt(length: number): number {
        //Read the first byte of buffer and increments offset by 1.
        //Returns the hexValue of the byte as a string.
        if (!this.checkLength(length)) {
            //The packet is Corrupt. Do something!!!!
        }
        let bytesRead = this.buffer.slice(this.offset, this.offset + length)
        let bytesToReturn = bytesRead.toString("hex")
        this.offset += length
        return parseInt(bytesToReturn, 16)

    }

    readBufferFrom(offset: number): Buffer{
        return this.buffer.slice(offset);
    }
    
    readAscii(length: number, flag: boolean = false): string {
        if (!this.checkLength(length)) {
            //The packet is Corrupt. Do something!!!!
        }
        let bytesRead = this.buffer.slice(this.offset, this.offset + length)
        let bytesToReturn = bytesRead.toString("ascii")
        this.offset += length

        //Flag is set to true only when we know that the next character is null.
        if (flag) this.offset += 1

        return bytesToReturn
    }


    readBinaryByte(length: number) {
        //Reads 2 bytes from buffer and increments offset by 2
        //Return the binaryValue of bytes as a string.
        if (!this.checkLength(length)) {
            //This Packet is Corrupt.Do something!!!.
        }
        let bytesRead = this.buffer.slice(this.offset, this.offset + length)
        let hexString = bytesRead.toString('hex')
        let bytesToReturn = Helper.convertHexToBinary(hexString)
        this.offset += 2
        return bytesToReturn
    }



    


    checkLength(bytesRequested: number) {
        return this.offset + bytesRequested <= this.buffer.length
    }

}


