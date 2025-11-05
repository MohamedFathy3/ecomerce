import { cookies } from 'next/headers';

export async function getLanguageFromStorage(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const languageCookie = cookieStore.get('Lan');
    
    if (languageCookie?.value) {
      return languageCookie.value;
    }
    
    // أو جيب من localStorage simulation
    // ده هيحتاج middleware أو حاجة تانيه
    
    return 'nl'; // افتراضي
  } catch (error) {
    return 'nl';
  }
}