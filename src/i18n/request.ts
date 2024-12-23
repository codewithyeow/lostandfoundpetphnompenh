import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import fs from 'fs/promises';
import path from 'path';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value || 'en') as string;

  try {
    // Ensure the path is correct and accessible from the root directory
    const messagesPath = path.join(process.cwd(), 'public', 'messages', `${locale}.json`);
    console.log(`Messages path: ${messagesPath}`); // Log the path for debugging
    const messages = JSON.parse(await fs.readFile(messagesPath, 'utf-8'));

    return {
      locale,
      messages,
    };
  } catch (error) {
    console.error(`Error loading locale messages for ${locale}:`, error);

    // Fallback to 'en' if the specific locale messages are not found
    const fallbackPath = path.join(process.cwd(), 'public', 'messages', 'en.json');
    const fallbackMessages = JSON.parse(await fs.readFile(fallbackPath, 'utf-8'));

    return {
      locale: 'en',
      messages: fallbackMessages,
    };
  }
});
