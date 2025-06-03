import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function generatePresignedUrl(fileName: string, fileType: string) {
  const command = new PutObjectCommand({
    Bucket: 'landonsite',
    Key: fileName,
    ContentType: fileType,
    CacheControl: 'max-age=31536000',
    Metadata: {
      'x-amz-meta-uploaded-by': 'landon-travel-site'
    }
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600,
      signableHeaders: new Set([
        'host',
        'x-amz-meta-uploaded-by',
        'content-type',
        'cache-control'
      ])
    });
    return signedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

export async function deleteFile(fileName: string) {
  const command = new DeleteObjectCommand({
    Bucket: 'landonsite',
    Key: fileName,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

export function getFileUrl(fileName: string) {
  return `https://landonsite.s3.us-east-1.amazonaws.com/${fileName}`;
} 