export async function uploadImage(file: File): Promise<{
  imageUrl: string;
  analysis: {
    items: Array<{
      label: string;
      confidence: number;
      boundingBox: {
        left: number;
        top: number;
        width: number;
        height: number;
      };
    }>;
    timestamp: string;
  };
}> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  const { data } = await response.json();
  return data;
}