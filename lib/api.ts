import { Token } from "@/types/token";

const API_BASE_URL = "https://aisplit.com/inventory/token-data";

export async function getTokenData(walletAddress: string): Promise<Token[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/${walletAddress}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
}

// export async function getTokenBalance(mintAddress: string): Promise<number> {
//   // TODO: Implement the API call to get token balance once the endpoint is ready
//   const response = await fetch(`${API_BASE_URL}/token-balance/${mintAddress}`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch token balance");
//   }
//   return response.json();
// }
