/**
 * Tests the distribution of random number generation
 * @param {number} min - Minimum value (inclusive)
 * @param {number} iterations - Number of iterations (also used as max value)
 * @returns {{ counts: number[], stdDev: number }}
 */
const testRandomDistribution = (min, iterations) => {
    const max = iterations;
    
    /**
     * Generates a random integer between min and max (inclusive)
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    const getRandom = (min, max) => 
        Math.floor(Math.random() * (max - min + 1)) + min;
    
    const buckets = max - min + 1;
    const finalRes = new Array(buckets).fill(0);

    for (let i = 0; i < iterations; i++) {
        const randomValue = getRandom(min, max);
        finalRes[randomValue - min]++;
    }

    // Stats
    const expected = iterations / buckets;
    const maxCount = Math.max(...finalRes);
    const barWidth = 50;  // Standardized bar width
    
    // Visual histogram
    console.log('\n📊 Distribution Test');
    console.log(`Range: [${min}, ${max}], Buckets: ${buckets}, Iterations: ${iterations}`);
    console.log(`Expected per bucket: ~${expected.toFixed(1)} (${(100/buckets).toFixed(2)}%)\n`);
    
    // Only show a sample if too many buckets
    const showAll = buckets <= 50;
    const step = showAll ? 1 : Math.ceil(buckets / 25);  // Show ~25 rows max
    
    for (let idx = 0; idx < buckets; idx += step) {
        const count = finalRes[idx];
        const actualValue = idx + min;
        
        // Standardized bar: scale relative to max count
        const barLength = Math.round((count / maxCount) * barWidth);
        const bar = '█'.repeat(barLength);
        
        const pct = ((count / iterations) * 100).toFixed(2);
        const label = actualValue.toString().padStart(String(max).length);
        console.log(`${label}: ${bar.padEnd(barWidth)} ${pct}% (${count})`);
    }
    
    if (!showAll) {
        console.log(`\n(Showing every ${step}th bucket. Total buckets: ${buckets})`);
    }

    // Check uniformity
    const variance = finalRes.reduce((sum, v) => sum + Math.pow(v - expected, 2), 0) / buckets;
    const stdDev = Math.sqrt(variance);
    
    // Summary stats
    const minCount = Math.min(...finalRes);
    const actualMin = finalRes.findIndex(v => v === minCount) + min;
    const actualMax = finalRes.findIndex(v => v === maxCount) + min;
    
    console.log(`\n📈 Summary:`);
    console.log(`  Min hits: ${minCount} (value: ${actualMin})`);
    console.log(`  Max hits: ${maxCount} (value: ${actualMax})`);
    console.log(`  Std Dev: ${stdDev.toFixed(2)} (lower = more uniform)`);
    
    return { counts: finalRes, stdDev };
}

// Usage
testRandomDistribution(0, 1000);