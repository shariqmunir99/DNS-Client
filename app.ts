import { TransportModule } from "./Transport";
import { DNSHeader } from "./DNSHeader";
import { DNSAnswer } from "./DNSAnswer";
import { DNSBuffer } from "./DNSBuffer";
import { DNSQuestion } from "./DNSQuestion";
import { DNSPacket } from "./DNSPacket";

const DNS_SERVER = '8.8.8.8'
const DNS_PORT = 53
const SUPPORTED_QTYPES = ["ipv4", "ipv6"]

function parseOutput(decodedPacket: DNSPacket) {

    let header = decodedPacket.getHeader()
    let question = decodedPacket.getQuestion()
    let answers = decodedPacket.getAnswer()

    const id = header.getID()
    const ansCount = header.getANCOUNT()
    console.log(`Request ID: ${id}`)

    if (ansCount === 0) {
        console.log(`Total Answers : No Answer exists for ${question.getQTYPE()} message against the Host Name:  ${question.getDomainName()}`)
        return
    }
    console.log(`Total Answers: ${ansCount}`)
    console.log("==========================================")
    for (let i = 0; i < ansCount; i++) {
        console.log("--------------------------------------")
        console.log(`Answer: ${i + 1}`)
        console.log(answers[i])
    }
    console.log("==========================================")


}
async function start() {
    const domain = process.argv[2]
    const QTYPE = process.argv[3]
    if (!SUPPORTED_QTYPES.includes(QTYPE)) {
        console.log("QTYPE Not Supported.")
        return
    }
    const transport = new TransportModule(domain, QTYPE, DNS_SERVER, DNS_PORT)
    let responsePacket = await transport.Initiate();
    parseOutput(responsePacket)
}

start()