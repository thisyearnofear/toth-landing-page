// src/hooks/useMemecoins.ts

import { useState, useEffect } from "react";
import { MemeToken } from "../types";

export const useMemecoins = (address: string) => {
  const [tokens, setTokens] = useState<MemeToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    console.log(`[Memecoins Debug] ${info}`);
    setDebugInfo((prev) => [...prev, info]);
  };

  const fetchTokensForChain = async (chain: string) => {
    addDebugInfo(`Fetching tokens for ${chain} - Address: ${address}`);
    const url = `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=${chain}`;

    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY || "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const transformedData = data.map((token: any) => ({
        ...token,
        usd_value:
          token.balance && token.decimals
            ? (
                parseFloat(token.balance) /
                Math.pow(10, parseInt(token.decimals))
              ).toString()
            : "0",
      }));

      addDebugInfo(`Found ${transformedData.length} tokens on ${chain}`);
      return transformedData;
    } catch (error) {
      addDebugInfo(`Error fetching ${chain}: ${error}`);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllTokens = async () => {
      if (!address) {
        addDebugInfo("No address provided");
        return;
      }

      setIsLoading(true);
      setError(null);
      addDebugInfo(`Starting token fetch for address: ${address}`);

      try {
        const chains = ["eth", "base", "zksync", "scroll", "linea"];
        const allTokensPromises = chains.map((chain) =>
          fetchTokensForChain(chain)
        );
        const results = await Promise.all(allTokensPromises);

        const validTokens = results
          .flatMap((tokens, index) => {
            const chainTokens = tokens.map((token: MemeToken) => ({
              ...token,
              chain: chains[index],
            }));
            addDebugInfo(
              `${chains[index]}: Found ${chainTokens.length} valid tokens`
            );
            return chainTokens;
          })
          .filter((token) => {
            const value = parseFloat(token.balance);
            addDebugInfo(`Token ${token.symbol} balance: ${value}`);
            return value > 0;
          });

        addDebugInfo(
          `Total valid tokens across all chains: ${validTokens.length}`
        );
        setTokens(validTokens);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch tokens";
        setError(errorMsg);
        addDebugInfo(`Error: ${errorMsg}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTokens();
  }, [address]);

  return { tokens, isLoading, error, debugInfo };
};
