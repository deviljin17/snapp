import { PineconeClient } from '@pinecone-database/pinecone';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const pinecone = new PineconeClient();

interface SimilarProduct {
  id: string;
  similarity: number;
  exactMatch: boolean;
  sustainabilityScore: number;
  metadata: {
    name: string;
    brand: string;
    price: number;
    imageUrl: string;
    color: string;
    style: string;
    sustainability: any;
    features: string[];
  };
}

interface MatchCriteria {
  brand?: string;
  color?: string;
  style?: string;
  sustainability?: {
    ecoFriendly?: boolean;
    recycledMaterials?: boolean;
    secondHand?: boolean;
    organicMaterials?: boolean;
    minScore?: number;
  };
  features?: string[];
}

export async function initializePinecone() {
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT || '',
    apiKey: process.env.PINECONE_API_KEY || ''
  });
}

export async function findSimilarProducts(
  features: Float32Array,
  category: string,
  criteria?: MatchCriteria,
  limit: number = 10
): Promise<SimilarProduct[]> {
  const index = pinecone.Index('products');
  
  // Query Pinecone
  const filter: Record<string, any> = { category };
  if (criteria?.brand) {
    filter.brand = criteria.brand;
  }

  const queryResponse = await index.query({
    vector: Array.from(features),
    filter,
    topK: limit,
    includeMetadata: true
  });

  // Get full product details from database
  const productIds = queryResponse.matches.map(match => match.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  // Calculate match scores and sort results
  const results = queryResponse.matches.map(match => {
    const product = products.find(p => p.id === match.id);
    if (!product) return null;

    // Calculate exact match criteria
    const isExactMatch = criteria ? checkExactMatch(product, criteria) : false;
    const sustainabilityBoost = calculateSustainabilityBoost(product, criteria?.sustainability);

    // Calculate boosted similarity score
    let similarityScore = match.score;
    if (isExactMatch) {
      similarityScore *= 1.5; // Boost exact matches by 50%
    }
    similarityScore *= (1 + sustainabilityBoost);

    return {
      id: match.id,
      similarity: similarityScore,
      exactMatch: isExactMatch,
      sustainabilityScore: product.sustainability?.score,
      metadata: {
        name: product?.name || '',
        brand: product?.brand || '',
        price: product?.price || 0,
        imageUrl: product?.imageUrl || '',
        color: product?.color || '',
        style: product?.style || '',
        sustainability: product?.sustainability || null,
        features: product?.features || []
      }
    };
  }).filter((result): result is SimilarProduct => result !== null)
   .sort((a, b) => {
     // Sort by exact match first, then by similarity score
     if (a.exactMatch && !b.exactMatch) return -1;
     if (!a.exactMatch && b.exactMatch) return 1;
     return b.similarity - a.similarity;
   })
   .slice(0, limit);

  return results;
}

function checkExactMatch(product: any, criteria: MatchCriteria): boolean {
  const matches = {
    brand: !criteria.brand || product.brand === criteria.brand,
    color: !criteria.color || product.color === criteria.color,
    style: !criteria.style || product.style === criteria.style,
    features: !criteria.features?.length || 
      criteria.features.every(f => product.features.includes(f))
  };

  // Product must match all specified criteria to be considered an exact match
  return Object.values(matches).every(match => match);
}

function calculateSustainabilityBoost(
  product: any,
  criteria?: MatchCriteria['sustainability']
): number {
  if (!criteria || !product.sustainability) return 0;

  let boost = 0;

  // Boost for matching sustainability criteria
  if (criteria.ecoFriendly && product.sustainability.ecoFriendly) boost += 0.1;
  if (criteria.recycledMaterials && product.sustainability.recycledMaterials) boost += 0.1;
  if (criteria.secondHand && product.sustainability.secondHand) boost += 0.15;
  if (criteria.organicMaterials && product.sustainability.organicMaterials) boost += 0.1;

  // Boost based on overall sustainability score
  if (criteria.minScore && product.sustainability.score >= criteria.minScore) {
    boost += 0.2;
  }

  return boost;
}