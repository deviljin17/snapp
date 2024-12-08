export const shareResults = async (matches: any[]) => {
  const shareData = {
    title: 'StyleRo Fashion Finds',
    text: `Check out these similar styles I found using StyleRo!\n\n${
      matches.map(m => `${m.name} - $${m.price}`).join('\n')
    }`,
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
      return false;
    }
  }
  
  return false;
};