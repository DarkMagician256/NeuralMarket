/**
 * Simple test to verify DeepSeek R1 is working via Ollama
 * Run: node scripts/test-ollama.js
 */

const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'deepseek-r1-8b:latest';

async function testDeepSeek() {
    console.log('🧪 Testing DeepSeek R1 via Ollama...\n');
    console.log(`📡 Server: ${OLLAMA_URL}`);
    console.log(`🧠 Model: ${MODEL}\n`);

    const prompt = `You are Oraculo Sentient, an autonomous AI trading agent specialized in prediction markets. 

Analyze this scenario and give your trading recommendation:
"Bitcoin is at $105,000. The US Federal Reserve just announced they will keep interest rates unchanged. Sentiment on social media is mixed."

Provide:
1. Your market analysis (2 sentences)
2. Trading recommendation (BUY/SELL/HOLD)
3. Confidence level (LOW/MEDIUM/HIGH)
4. Key reasoning (1 sentence)`;

    try {
        console.log('💭 Sending prompt to DeepSeek R1...\n');
        const startTime = Date.now();

        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 300
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('═══════════════════════════════════════════');
        console.log('🤖 ORACULO SENTIENT (DeepSeek R1) RESPONSE:');
        console.log('═══════════════════════════════════════════\n');
        console.log(data.response);
        console.log('\n═══════════════════════════════════════════');
        console.log(`⏱️  Response time: ${elapsed}s`);
        console.log(`📊 Tokens generated: ${data.eval_count || 'N/A'}`);
        console.log('═══════════════════════════════════════════\n');

        console.log('✅ DeepSeek R1 is working! The bot CAN think locally!\n');
        console.log('💰 Cost of this query: $0.00 (FREE)\n');

        return true;
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Make sure Ollama is running: ollama serve');
        console.log('   2. Check if model exists: ollama list');
        console.log('   3. Pull model if needed: ollama pull deepseek-r1:8b');
        return false;
    }
}

testDeepSeek();
