export async function chatWithClaude(messages) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error calling Chat API:', error);
      throw error;
    }
  }