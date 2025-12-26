export async function uploadToImageKit(file: File): Promise<{ url: string; fileId: string }> {
    try {
        // Verificar credenciales
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
        const url_upload = process.env.IMAGEKIT_URL_UPLOAD;
        console.log(privateKey)
        console.log(publicKey)
        console.log(url_upload)
        if (!privateKey || !publicKey || !url_upload) {
            throw new Error('ImageKit credentials missing');
        }

        // Convertir File a base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64File = buffer.toString('base64');

        // Crear FormData
        const formData = new FormData();
        formData.append('file', base64File);
        formData.append('fileName', file.name);
        formData.append('folder', '/DevEvent');
        formData.append('useUniqueFileName', 'true');

        // Configurar headers
        const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`;

        // Hacer la petición DIRECTA (sin proxy)
        const response = await fetch(url_upload!, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('ImageKit response error:', response.status, errorText);
            throw new Error(`ImageKit upload failed: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Upload exitoso:', result.url);

        return {
            url: result.url,
            fileId: result.fileId
        };

    } catch (error) {
        console.error('Error en uploadToImageKit:', error);
        throw error;
    }
}