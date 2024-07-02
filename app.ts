import { resolve } from "path";
import { TransportModule } from "./Transport";
import { DNSHeader } from "./DNSHeader";
import { DNSAnswer } from "./DNSAnswer";
import { DNSBuffer } from "./DNSBuffer";
import { DNSQuestion } from "./DNSQuestion";
import { decode } from "punycode";
import { exit } from "process";

const DNS_SERVER = '8.8.8.8'
const DNS_PORT = 53
const QTYPES  = ["ipv4", "ipv6"]

function Decode(response:Buffer) {
    let dnsBuffer = new DNSBuffer
    dnsBuffer.replace(response)
    let header = DNSHeader.HeaderDecode(dnsBuffer)
    let question = DNSQuestion.QuestionDecode(dnsBuffer)
    if (header.ANCOUNT == 0)
        return {...header, ...question}
    else
        { 
            let answers = DNSAnswer.AnswerDecode(dnsBuffer)
            //console.log({...header, ...question, ...answers})
            return {...header, ...question, ...answers}
        }
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
    let decodedResponse =  Decode(response)
    parseOutput(decodedResponse)
}

start()