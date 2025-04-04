import { Client, Databases, Storage } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT!;
const client = new Client()
    .setEndpoint(endpoint )
    .setProject(projectId );
    
export const databases = new Databases(client);
export const storage = new Storage(client);
    