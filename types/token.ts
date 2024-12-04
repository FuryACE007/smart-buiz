export interface TokenMetadata {
  tokenName: string;
  tokenSymbol: string;
  tokenDescription: {
    tokenData: {
      "Project Name": string;
      "Token Name": string;
      "Currency Type"?: string;
      "currency_type"?: string;
      "Wallet Cost": number;
      "Token Symbol": string;
      "Maximum Number of Wallets Allowed": number;
      "Number of Tokens per Wallet": number;
      "Token Description"?: string;
    };
    projectData: {
      "Consumable Name"?: string;
      "consumable_name"?: string;
      "Msrp"?: number | string;
      "msrp"?: string;
      "Color"?: string;
      "color"?: string;
      "Number Of Pages Yield"?: number;
      "number_of_pages_yield"?: string;
      [key: string]: unknown; // For additional dynamic fields
    };
  };
}

export interface Token {
  name: string;
  symbol: string;
  metadata: TokenMetadata[];
  balance: number;
  mintAddress: string;
}

export interface ProjectData {
  date: string;
  inCirculation: number;
  consumed: number;
} 