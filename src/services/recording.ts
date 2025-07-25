import AWS from 'aws-sdk';
import axios from 'axios';
import crypto from 'crypto';
import { ZoomRecording } from '@/types/zoom';

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

// Bucket configuration
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'zoom-recordings';
const RECORDINGS_PREFIX = 'recordings';

/**
 * Verifies that the webhook request is genuinely from Zoom
 * @param signature Signature from the x-zm-signature header
 * @param timestamp Timestamp from the x-zm-request-timestamp header
 * @param body Request body as string
 * @returns Boolean indicating if the request is valid
 */
export const verifyZoomWebhook = (
  signature: string,
  timestamp: string,
  body: string
): boolean => {
  try {
    const secret = process.env.ZOOM_WEBHOOK_SECRET_TOKEN;
    if (!secret) {
      console.error('ZOOM_WEBHOOK_SECRET_TOKEN environment variable is missing');
      return false;
    }

    // Construct the message string
    const message = `v0:${timestamp}:${body}`;
    
    // Create HMAC
    const hashForVerify = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex');
    
    // Construct the expected signature
    const expectedSignature = `v0=${hashForVerify}`;
    
    // Verify signatures match
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Error verifying Zoom webhook:', error);
    return false;
  }
};

/**
 * Processes a Zoom recording webhook event
 * Downloads the recording from Zoom and uploads to S3
 */
export const processRecordingWebhook = async (event: ZoomRecordingEvent): Promise<string> => {
  try {
    // Download the recording file
    console.log(`Downloading recording from ${event.download_url}`);
    
    // Fetch download token from Zoom (if required)
    const downloadResponse = await axios({
      method: 'GET',
      url: event.download_url,
      headers: {
        'Authorization': `Bearer ${process.env.ZOOM_JWT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });
    
    if (!downloadResponse.data) {
      throw new Error('Failed to download recording file');
    }
    
    // Generate file key with organized directory structure
    const fileDate = new Date(event.recording_start).toISOString().split('T')[0];
    const fileKey = `${RECORDINGS_PREFIX}/${event.host_id}/${fileDate}/${event.meeting_id}/${event.recording_id}.${event.file_type.toLowerCase()}`;
    
    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: downloadResponse.data,
      ContentType: `video/${event.file_type.toLowerCase()}`,
      // Add metadata
      Metadata: {
        'meeting-id': event.meeting_id,
        'host-email': event.host_email,
        'recording-start': event.recording_start,
        'recording-end': event.recording_end,
      },
      // Enable server-side encryption
      ServerSideEncryption: 'AES256'
    };
    
    console.log(`Uploading recording to S3: ${fileKey}`);
    await s3.upload(uploadParams).promise();
    
    // Generate a pre-signed URL for temporary access (expires in 1 hour)
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Expires: 3600, // URL expires in 1 hour
    });
    
    console.log(`Recording processed successfully: ${fileKey}`);
    return signedUrl;
  } catch (error) {
    console.error('Error processing recording:', error);
    throw new Error(`Failed to process recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a list of recordings for a specific meeting
 * @param meetingId The Zoom meeting ID
 * @returns Array of recording objects with presigned URLs
 */
export const getRecordingsForMeeting = async (meetingId: string): Promise<any[]> => {
  try {
    // List objects in the bucket with the prefix for this meeting
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: `${RECORDINGS_PREFIX}/${meetingId}/`
    };
    
    const listedObjects = await s3.listObjectsV2(params).promise();
    
    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      return [];
    }
    
    // Generate presigned URLs for each recording
    return Promise.all(listedObjects.Contents.map(async (obj) => {
      const signedUrl = s3.getSignedUrl('getObject', {
        Bucket: BUCKET_NAME,
        Key: obj.Key,
        Expires: 3600, // URL expires in 1 hour
      });
      
      // Extract metadata
      if (!obj.Key) {
        throw new Error('Object key is undefined');
      }
      
      const metadata = await s3.headObject({
        Bucket: BUCKET_NAME,
        Key: obj.Key
      }).promise();
      
      return {
        key: obj.Key,
        url: signedUrl,
        size: obj.Size,
        lastModified: obj.LastModified,
        metadata: metadata.Metadata || {}
      };
    }));
  } catch (error) {
    console.error('Error getting recordings:', error);
    throw new Error(`Failed to get recordings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  verifyZoomWebhook,
  processRecordingWebhook,
  getRecordingsForMeeting
}; 