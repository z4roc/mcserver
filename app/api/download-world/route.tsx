import { NextRequest } from 'next/server';
import { copyWorldFromContainer } from '@/lib/docker';
import fs from 'fs/promises';

export async function GET(request: NextRequest) {
    const containerId = request.nextUrl.searchParams.get('containerId');
    if (!containerId) {
        return new Response('Container ID is required', { status: 400 });
    }

    try {
        // Copy the world file from the container
        const filePath = await copyWorldFromContainer(containerId);

        // Read the file to return it as a response
        const fileBuffer = await fs.readFile(filePath);

        // Clean up the file after it's read
        await fs.unlink(filePath);

        // Send the response with the correct headers
        return new Response(fileBuffer, {
            headers: {
                'Content-Type': 'application/gzip',
                'Content-Disposition': `attachment; filename="world.tgz"`,
            },
        });
    } catch (error) {
        console.error('Error downloading world file:', error);
        return new Response('Failed to download the world file', { status: 500 });
    }
}
