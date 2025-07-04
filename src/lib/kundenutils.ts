import { config } from "./config";

// Environment Variable
// const backendHost = process.env.Backend_Host ?? "localhost";


export async function plz2ort(plz: string) {
    const response = await fetch(`${config.backendUrl}/api/v1/orte/getname?plz=${plz}`);
    const data = await response.json();
    return data.result;
    
}
