import { app, InvocationContext, Timer } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import { ContainerClient } from "@azure/storage-blob";
import { getTopArtists } from "../lfm.js";

const blobClient = new ContainerClient(process.env.AZURE_STORAGE_URL!, new DefaultAzureCredential())

export async function weeklyTimer(myTimer: Timer, context: InvocationContext): Promise<void> {
    let artists = await getTopArtists();
    context.log(`Got ${artists.length} artists`);

    let data = 
    artists
    .map(artist => 
        [artist.name,artist.playcount, artist.listeners]
        .join("\t")
    )
    .join("\n")

    let currentDate = new Date();
    let currentFileName= `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}.tsv`;
    let blob = blobClient.getBlockBlobClient(currentFileName);
    await blobClient.createIfNotExists();
    await blobClient.setAccessPolicy("blob");
    await blob.uploadData(Buffer.from(data,'utf-8'));
    context.log(`Uploaded ${currentFileName}`);
    let latestBlob = blobClient.getBlockBlobClient("latest");
    await latestBlob.uploadData(Buffer.from(currentFileName,'utf-8'));
    context.log(`Uploaded latest`);
    
}

app.timer('weeklyTimer', {
    schedule: '0 0 0 * * 1',
    handler: weeklyTimer
});
