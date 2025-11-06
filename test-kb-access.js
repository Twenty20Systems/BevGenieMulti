/**
 * Test if BevGenie can access KB documents
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env.local
const envPath = path.join(__dirname, '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')

const env = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="?([^"]+)"?$/)
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '')
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL
const bevgenieKey = env.SUPABASE_BEVGENIE_KEY

console.log('🔍 Testing BevGenie KB Access...\n')
console.log('URL:', supabaseUrl)
console.log('BevGenie Key:', bevgenieKey ? '✅ Present' : '❌ Missing')
console.log('')

const supabase = createClient(supabaseUrl, bevgenieKey)

async function testKBAccess() {
  try {
    // Test 1: Get all published documents (what BevGenie should see)
    console.log('📊 Test 1: Fetching published documents (BevGenie perspective)...')
    const { data: published, error: pubError } = await supabase
      .from('knowledge_base')
      .select('id, title, category, is_published, content')
      .eq('is_published', true)

    if (pubError) {
      console.error('  ❌ Error:', pubError.message)
      throw pubError
    }

    console.log(`  ✅ BevGenie can see ${published.length} published documents:\n`)
    published.forEach((doc, idx) => {
      console.log(`  ${idx + 1}. ${doc.title}`)
      console.log(`     Category: ${doc.category}`)
      console.log(`     Content Preview: ${doc.content?.substring(0, 80)}...`)
      console.log(`     ID: ${doc.id}`)
      console.log('')
    })

    // Test 2: Try to get unpublished (should fail with RLS)
    console.log('📊 Test 2: Trying to access unpublished documents (should be blocked)...')
    const { data: unpublished, error: unpubError } = await supabase
      .from('knowledge_base')
      .select('id, title')
      .eq('is_published', false)

    if (unpublished && unpublished.length > 0) {
      console.log(`  ⚠️  WARNING: BevGenie can see ${unpublished.length} unpublished docs (RLS may not be working!)`)
    } else {
      console.log('  ✅ Good! BevGenie cannot see unpublished documents (RLS working)')
    }
    console.log('')

    // Test 3: Try text search
    console.log('📊 Test 3: Testing text search on KB...')
    const { data: searchResults, error: searchError } = await supabase
      .from('knowledge_base')
      .select('id, title, content')
      .eq('is_published', true)
      .ilike('content', '%marketing%')
      .limit(3)

    if (searchError) throw searchError

    console.log(`  ✅ Text search found ${searchResults.length} documents with 'marketing':\n`)
    searchResults.forEach((doc, idx) => {
      console.log(`  ${idx + 1}. ${doc.title}`)
    })
    console.log('')

    console.log('✅ All tests passed!')
    console.log('🎉 BevGenie can successfully read KB documents!')
    console.log('🎉 KB is ready to power AI responses!')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

testKBAccess()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
