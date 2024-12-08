interface ShareData {
  title: string;
  description: string;
  imageUrl?: string;
  matches?: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  }>;
}

export async function generateShareableLink(data: ShareData): Promise<string> {
  try {
    const response = await fetch('/api/share/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to generate share link');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Share link generation error:', error);
    // Fallback to current URL if API fails
    return window.location.href;
  }
}