import { TransportModule } from "./Transport";
import { DNSHeader } from "./DNSHeader";
import { DNSAnswer } from "./DNSAnswer";
import { DNSBuffer } from "./DNSBuffer";
import { DNSQuestion } from "./DNSQuestion";

const DNS_SERVER = '8.8.8.8'
const DNS_PORT = 53
const QTYPES  = ["ipv4", "ipv6"]

function Decode(response:Buffer) {
    
}


function parseOutput(decodedResponse){
    const id = decodedResponse.id
    const ansCount  = decodedResponse.ANCOUNT
    console.log(`Request ID: ${id}`)

    if(ansCount === 0){
        console.log(`Total Answers : No Answer exists for ${decodedResponse.QTYPE} message against the Host Name:  ${decodedResponse.labelSequence}`)
        return
    }
    console.log(`Total Answers: ${ansCount}`)
    console.log("==========================================")
    for(let i = 0;i < ansCount;i++){
        console.log("--------------------------------------")
        console.log(`Answer: ${i + 1}`)
        console.log(decodedResponse[i])
    }
    console.log("==========================================")


}
async function start(){
    const domain = process.argv[2]
    const QTYPE = process.argv[3]
    if(!QTYPES.includes(QTYPE)){
        console.log("QTYPE Not Supported.")
        return
    }
    const transport = new TransportModule(domain, QTYPE, DNS_SERVER, DNS_PORT)
    let response = await transport.Initiate();
    parseOutput(response)
}

start()