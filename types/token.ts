export interface TokenMetadata {
  tokenName: string;
  tokenSymbol: string;
  uom?: string;
  tokenDescription: {
    tokenData: {
      "Project Name": string;
      "Token Name": string;
      "Currency Type": string;
      "Wallet Cost": number;
      "Token Symbol": string;
      "Maximum Number of Wallets Allowed": number;
      "Number of Tokens per Wallet": number;
      "Token Description"?: string;
    };
    projectData: {
      "Consumable Name"?: string;
      "Media Type"?: string;
      Msrp?: number;
      "Number of Pages per Pack"?: number;
      Size?: string;
      SKU?: string;
      [key: string]: unknown;
    };
  };
}

export interface Token {
  name: string;
  symbol: string;
  metadata: TokenMetadata;
  balance: number;
  mintAddress: string;
}

export interface ProjectData {
  date: string;
  inCirculation: number;
  consumed: number;
}
