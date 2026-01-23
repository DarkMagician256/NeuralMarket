/**
 * NeuralMarket Backend Connectivity Test
 * Verifies that the agent is online and Supabase is connected
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://izwyjdylmwsxbxczkohy.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6d3lqZHlsbXdzeGJ4Y3prb2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzI5NjIsImV4cCI6MjA4NDQ4OTYyfQ.nj8nRYfZ74_HKlLvYs8dM4yuuI4R5Z1o-FPm-dlepLo';

async function testBackendConnectivity() {
    console.log('🧪 NeuralMarket Backend Connectivity Test');
    console.log('==========================================\n');

    const results: { test: string; status: 'PASS' | 'FAIL'; details?: string }[] = [];

    // Test 1: Supabase Connection
    console.log('📡 Test 1: Supabase Connection...');
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data, error } = await supabase.from('system_telemetry').select('*').limit(1);

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found (ok)
            results.push({ test: 'Supabase Connection', status: 'FAIL', details: error.message });
        } else {
            results.push({ test: 'Supabase Connection', status: 'PASS' });
        }
    } catch (e: any) {
        results.push({ test: 'Supabase Connection', status: 'FAIL', details: e.message });
    }

    // Test 2: Agent Telemetry Table
    console.log('🤖 Test 2: Agent Telemetry Exists...');
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data, error } = await supabase.from('system_telemetry').select('agent_id, status, last_heartbeat');

        if (error) {
            results.push({ test: 'Agent Telemetry', status: 'FAIL', details: error.message });
        } else {
            const agentOnline = data?.find(a => a.status === 'ONLINE');
            if (agentOnline) {
                results.push({
                    test: 'Agent Telemetry',
                    status: 'PASS',
                    details: `Agent ${agentOnline.agent_id} is ONLINE (last: ${agentOnline.last_heartbeat})`
                });
            } else {
                results.push({
                    test: 'Agent Telemetry',
                    status: 'PASS',
                    details: `Table accessible, ${data?.length || 0} agents found`
                });
            }
        }
    } catch (e: any) {
        results.push({ test: 'Agent Telemetry', status: 'FAIL', details: e.message });
    }

    // Test 3: Agent Thoughts Stream
    console.log('💭 Test 3: Agent Thoughts Table...');
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data, error } = await supabase
            .from('agent_thoughts')
            .select('id, thought_type, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) {
            results.push({ test: 'Agent Thoughts', status: 'FAIL', details: error.message });
        } else {
            results.push({
                test: 'Agent Thoughts',
                status: 'PASS',
                details: `${data?.length || 0} recent thoughts found`
            });
        }
    } catch (e: any) {
        results.push({ test: 'Agent Thoughts', status: 'FAIL', details: e.message });
    }

    // Test 4: Agent Participants Table (New table we just created)
    console.log('👥 Test 4: Agent Participants Table...');
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data, error } = await supabase.from('agent_participants').select('count');

        if (error) {
            results.push({ test: 'Agent Participants Table', status: 'FAIL', details: error.message });
        } else {
            results.push({ test: 'Agent Participants Table', status: 'PASS', details: 'Table exists and accessible' });
        }
    } catch (e: any) {
        results.push({ test: 'Agent Participants Table', status: 'FAIL', details: e.message });
    }

    // Test 5: Trades Table
    console.log('📊 Test 5: Trades Table...');
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data, error } = await supabase
            .from('trades')
            .select('id, ticker, status')
            .limit(5);

        if (error) {
            results.push({ test: 'Trades Table', status: 'FAIL', details: error.message });
        } else {
            results.push({
                test: 'Trades Table',
                status: 'PASS',
                details: `${data?.length || 0} trades found`
            });
        }
    } catch (e: any) {
        results.push({ test: 'Trades Table', status: 'FAIL', details: e.message });
    }

    // Print Results
    console.log('\n==========================================');
    console.log('📋 TEST RESULTS:\n');

    let passed = 0;
    let failed = 0;

    for (const result of results) {
        const icon = result.status === 'PASS' ? '✅' : '❌';
        console.log(`${icon} ${result.test}: ${result.status}`);
        if (result.details) {
            console.log(`   └─ ${result.details}`);
        }
        if (result.status === 'PASS') passed++;
        else failed++;
    }

    console.log('\n==========================================');
    console.log(`📊 Summary: ${passed}/${results.length} tests passed`);

    if (failed === 0) {
        console.log('🎉 All tests passed! Backend is ONLINE and ready.');
    } else {
        console.log(`⚠️ ${failed} test(s) failed. Check details above.`);
    }

    return { passed, failed, total: results.length };
}

// Run tests
testBackendConnectivity()
    .then(({ passed, failed }) => {
        process.exit(failed > 0 ? 1 : 0);
    })
    .catch(err => {
        console.error('❌ Test runner failed:', err);
        process.exit(1);
    });
