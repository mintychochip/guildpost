/**
 * Wizard Chat API - AI-powered conversational intent extraction using Gemma (local)
 * POST /api/wizard/chat - Chat with local Gemma AI to refine search intent
 */

import type { APIRoute } from 'astro';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// System prompt for the wizard
const SYSTEM_PROMPT = `You are an AI assistant helping users find game servers on GuildPost. 

Your goal is to extract what the user wants and either:
1. Ask a clarifying question if intent is unclear
2. Confirm you have enough info and provide a search query

Games available: Minecraft (live), Rust (coming soon), CS2 (coming soon)

For Minecraft servers, extract:
- Gamemode: survival, pvp, skyblock, creative, minigames, hardcore, smp, modded, prison, rp
- Features: economy, claims, community, pvp, mmo, events, bedrock, shops, towny, quests, vanilla, kits
- Size: small (1-50), medium (50-200), large (200+)

Respond in JSON format:
{
  "response": "friendly message to user - either asking a question OR confirming search",
  "readyToSearch": boolean,
  "searchQuery": "constructed query if ready (e.g., 'minecraft survival economy small')",
  "extractedIntent": {
    "game": "minecraft|rust|cs2",
    "gamemode": "survival|pvp|etc or null",
    "features": ["economy", "claims"],
    "size": "small|medium|large or null"
  }
}

Rules:
- If user mentions "survival", "smp", "vanilla" → gamemode=survival
- If user mentions "pvp", "factions", "raid" → gamemode=pvp  
- If user mentions "skyblock" → gamemode=skyblock
- Ask for clarification if: no gamemode detected AND less than 2 features
- Be conversational and friendly, use emojis occasionally
- If unclear, ask ONE specific question (don't overwhelm)`;

// Call local Gemma via Ollama
async function callGemma(messages: any[]) {
  // Build conversation prompt
  const conversation = messages.map(m => 
    m.role === 'assistant' ? `Assistant: ${m.content}` : `User: ${m.content}`
  ).join('\n');
  
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${conversation}\nAssistant:`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma:2b',
      prompt: fullPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 500
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.response || '';
  
  try {
    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // Fallback: wrap text in expected format
    return {
      response: text || "I understand you're looking for a server. Could you tell me which game and gamemode you prefer?",
      readyToSearch: false,
      searchQuery: null,
      extractedIntent: { game: null, gamemode: null, features: [], size: null }
    };
  } catch {
    return {
      response: text || "Tell me more about what you're looking for!",
      readyToSearch: false,
      searchQuery: null,
      extractedIntent: { game: null, gamemode: null, features: [], size: null }
    };
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Build conversation for Gemma
    const conversation = [
      ...history.slice(-6), // Keep last 3 exchanges
      { role: 'user', content: message }
    ];

    let result;
    try {
      // Try local Gemma first
      result = await callGemma(conversation);
    } catch (ollamaError) {
      console.log('Ollama failed, falling back to keyword extraction:', ollamaError);
      // Fallback to keyword extraction
      const lower = message.toLowerCase();
      const hasGamemode = /\b(survival|pvp|skyblock|creative|hardcore|minigames|smp|modded)\b/.test(lower);
      const hasFeatures = (lower.match(/\b(economy|claims|community|discord|pvp|events|bedrock|shops|towny|quests)\b/g) || []).length;
      
      result = {
        response: hasGamemode || hasFeatures >= 2 
          ? "I'll search for servers matching what you described!"
          : "I want to make sure I find the right server for you! 🎮\n\nWhat gamemode interests you? (survival, pvp, skyblock, creative, minigames, hardcore)",
        readyToSearch: hasGamemode || hasFeatures >= 2,
        searchQuery: hasGamemode || hasFeatures >= 2 ? `minecraft ${message}` : null,
        extractedIntent: { game: 'minecraft', gamemode: null, features: [], size: null }
      };
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('Wizard chat error:', err);
    return new Response(JSON.stringify({ 
      response: "Gemma AI is waking up... try again in a moment! Or tell me directly: what game and gamemode? (e.g., 'Minecraft survival')",
      readyToSearch: false,
      searchQuery: null,
      fallback: true
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};