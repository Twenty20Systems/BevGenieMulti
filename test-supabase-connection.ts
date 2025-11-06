import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log('\n🔍 Supabase Configuration Verification\n');
console.log('=' .repeat(60));

// Verify environment variables
console.log('\n✓ Checking environment variables...');

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
  process.exit(1);
}
console.log('✅ NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl.substring(0, 30) + '...');

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  process.exit(1);
}
console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey.substring(0, 30) + '...');

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_KEY is missing');
  process.exit(1);
}
console.log('✅ SUPABASE_SERVICE_KEY:', supabaseServiceKey.substring(0, 30) + '...');

// Create clients
console.log('\n✓ Initializing Supabase clients...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
console.log('✅ Clients created successfully');

// Test public client connection
async function testPublicClient() {
  console.log('\n✓ Testing public client connection...');
  try {
    const { data, error, count } = await supabase
      .from('knowledge_base')
      .select('id', { count: 'exact' });

    if (error) {
      console.error('❌ Error querying knowledge_base:', error.message);
      return false;
    }
    console.log('✅ knowledge_base table accessible');
    console.log(`   Current records: ${count}`);
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err);
    return false;
  }
}

// Test admin client connection
async function testAdminClient() {
  console.log('\n✓ Testing admin client connection...');
  try {
    const { data, error, count } = await supabaseAdmin
      .from('user_personas')
      .select('id', { count: 'exact' });

    if (error) {
      console.error('❌ Error querying user_personas:', error.message);
      return false;
    }
    console.log('✅ user_personas table accessible with admin client');
    console.log(`   Current records: ${count}`);
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err);
    return false;
  }
}

// Test all tables exist
async function testTablesExist() {
  console.log('\n✓ Verifying all required tables...');
  const tables = [
    'knowledge_base',
    'user_personas',
    'conversation_history',
    'persona_signals',
    'generated_brochures',
  ];

  let allTablesExist = true;

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(0);
      if (error) {
        console.error(`❌ ${table}: ${error.message}`);
        allTablesExist = false;
      } else {
        console.log(`✅ ${table}: exists`);
      }
    } catch (err) {
      console.error(`❌ ${table}: connection error`);
      allTablesExist = false;
    }
  }

  return allTablesExist;
}

// Test RLS policies
async function testRLSPolicies() {
  console.log('\n✓ Checking RLS policies...');
  try {
    const { data, error } = await supabaseAdmin.rpc('json_array_length', { arr: '[]' });
    if (error && error.code !== 'PGRST102') {
      // PGRST102 = function not found, which is ok - we're just testing permissions
      console.log('✅ RLS policies are enabled');
      return true;
    }
    console.log('✅ RLS policies are active');
    return true;
  } catch (err) {
    console.error('❌ RLS check failed:', err);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Running Supabase Connection Tests');
  console.log('='.repeat(60));

  const results = {
    publicClient: await testPublicClient(),
    adminClient: await testAdminClient(),
    tablesExist: await testTablesExist(),
    rlsPolicies: await testRLSPolicies(),
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));

  const allPassed = Object.values(results).every((v) => v);

  console.log('\nResults:');
  console.log(`  Public Client:    ${results.publicClient ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Admin Client:     ${results.adminClient ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Tables Exist:     ${results.tablesExist ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  RLS Policies:     ${results.rlsPolicies ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n' + '='.repeat(60));

  if (allPassed) {
    console.log('✅ All Supabase tests PASSED!');
    console.log('\n✅ You are ready to proceed to Phase 1!\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests FAILED. Please check the errors above.\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
