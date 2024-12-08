import * as ort from 'onnxruntime-node';
import sharp from 'sharp';

// Initialize ONNX Runtime session
let session: ort.InferenceSession | null = null;

async function initializeModel() {
  if (!session) {
    session = await ort.InferenceSession.create('./models/feature_extractor.onnx');
  }
  return session;
}

export async function extractFeatures(imageBuffer: Buffer): Promise<Float32Array> {
  try {
    const model = await initializeModel();

    // Preprocess image
    const processedImage = await sharp(imageBuffer)
      .resize(224, 224, { fit: 'cover' })
      .removeAlpha()
      .raw()
      .toBuffer();

    // Prepare input tensor
    const input = new Float32Array(processedImage.length);
    for (let i = 0; i < processedImage.length; i++) {
      input[i] = processedImage[i] / 255.0; // Normalize to [0,1]
    }

    // Run inference
    const tensorData = new ort.Tensor('float32', input, [1, 3, 224, 224]);
    const results = await model.run({ input: tensorData });
    const features = results.output.data as Float32Array;

    return features;
  } catch (error) {
    console.error('Feature extraction error:', error);
    throw new Error('Failed to extract features from image');
  }
}