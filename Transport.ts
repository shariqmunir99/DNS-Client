import * as dgram from 'dgram';
import { DNSPacket } from './DNSPacket';
import * as fs from 'fs';

 export class TransportModule{

    // For now lets only deal with one.
    hostname = ""//used later in packet creation
    serverAddress = "" //Address of the receiving server
    serverPort = 0 //Port through which communication occurs 
    type :string;
    constructor(validatedHostname:string,QTYPE: string, serverAddress:string,serverPort:number)
    {
        this.hostname = validatedHostname
        this.serverAddress = serverAddress
        this.serverPort = serverPort
        this.type = QTYPE.toLowerCase()
    }

    //For now lets only deal with udp4
    createSocket():dgram.Socket{
        return dgram.createSocket('udp4') 
    }

    
    async sendPacket(packet:Buffer, socket:dgram.Socket): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            socket.send(packet,0,packet.length, this.serverPort, this.serverAddress, (err) => {
                if (err) {
                    console.error('Error sending packet:', err);
                    return reject(err);
                }
            });
            socket.on('message', (msg) => {
                resolve(msg);
            });
            socket.on('error', (err) => {
                console.error('Error on socket:', err);
                reject(err);
            });
        });
    };

    generatePacket():DNSPacket{
        let packetHandler = new DNSPacket(this.hostname,this.type)
        return packetHandler
    }

    //Handles the whole transport process. Creates the packet from hostname, the socket for connection and handles the response.
    async Initiate():(Promise<any>){
        let socket = dgram.createSocket('udp4')
        try{
            let packetHandler = this.generatePacket()
            let response:Buffer =  await this.sendPacket(packetHandler.getPacket(), socket)
            fs.writeFile('abc.bin', response, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } 
            });
            //this.Decode(response)
            return packetHandler.Decode(response)
        }
        catch{
            return Buffer.from([0x01])
        }
        finally{
            socket.close()
        }
    }

}