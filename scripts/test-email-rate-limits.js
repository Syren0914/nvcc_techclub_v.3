// Script to test email rate limits and batch processing
// Run this with: node scripts/test-email-rate-limits.js

const RATE_LIMIT_DELAY = 500 // 500ms = 2 requests per second

async function simulateEmailBatch(recipientCount) {
  console.log(`🚀 Simulating email batch to ${recipientCount} recipients`);
  console.log(`⏱️  Rate limit: 2 emails per second (${RATE_LIMIT_DELAY}ms delay)`);
  console.log(`📊 Estimated time: ~${Math.ceil(recipientCount / 2)} seconds\n`);

  const startTime = Date.now();
  
  for (let i = 0; i < recipientCount; i++) {
    // Add delay between requests (except for first one)
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }
    
    // Simulate email sending
    console.log(`📧 Sending email ${i + 1}/${recipientCount} to recipient${i + 1}@example.com`);
  }
  
  const endTime = Date.now();
  const actualTime = Math.round((endTime - startTime) / 1000);
  
  console.log(`\n✅ Batch completed in ${actualTime} seconds`);
  console.log(`📈 Rate: ${Math.round((recipientCount / actualTime) * 100) / 100} emails per second`);
}

// Test different batch sizes
async function runTests() {
  console.log('🧪 Testing Email Rate Limits\n');
  
  const testSizes = [5, 10, 20, 50];
  
  for (const size of testSizes) {
    await simulateEmailBatch(size);
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('📋 Rate Limit Guidelines:');
  console.log('• Resend free tier: 2 emails per second');
  console.log('• Small batches (< 10): ~5 seconds');
  console.log('• Medium batches (10-50): ~25 seconds');  
  console.log('• Large batches (50+): Consider chunking');
  console.log('\n💡 Tips:');
  console.log('• Use "Save as Draft" for large announcements');
  console.log('• Send during off-peak hours for better delivery');
  console.log('• Monitor failed deliveries and retry if needed');
}

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { simulateEmailBatch };
