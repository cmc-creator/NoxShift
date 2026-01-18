#!/usr/bin/env node
/**
 * NoxShift Setup Verification Script
 * Run this after following setup instructions to verify everything is configured correctly
 * Usage: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 NoxShift Setup Verification\n');
console.log('=' .repeat(50));

let errorCount = 0;
let warningCount = 0;

// Check 1: Node.js version
console.log('\n1. Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 18) {
  console.log(`   ✅ Node.js ${nodeVersion} (OK - v18+ required)`);
} else {
  console.log(`   ❌ Node.js ${nodeVersion} (ERROR - v18+ required)`);
  errorCount++;
}

// Check 2: package.json exists
console.log('\n2. Checking package.json...');
if (fs.existsSync('package.json')) {
  console.log('   ✅ package.json exists');
} else {
  console.log('   ❌ package.json not found');
  errorCount++;
}

// Check 3: node_modules exists
console.log('\n3. Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ node_modules exists');
} else {
  console.log('   ❌ node_modules not found - Run: npm install');
  errorCount++;
}

// Check 4: .env file exists
console.log('\n4. Checking environment configuration...');
if (fs.existsSync('.env')) {
  console.log('   ✅ .env file exists');
  
  // Check .env content
  const envContent = fs.readFileSync('.env', 'utf8');
  
  // Check JWT_SECRET
  if (envContent.includes('JWT_SECRET=') && !envContent.includes('JWT_SECRET="your-')) {
    console.log('   ✅ JWT_SECRET is configured');
  } else {
    console.log('   ⚠️  JWT_SECRET needs to be set (currently using default)');
    warningCount++;
  }
  
  // Check DATABASE_URL
  if (envContent.includes('DATABASE_URL=')) {
    console.log('   ✅ DATABASE_URL is configured');
  } else {
    console.log('   ❌ DATABASE_URL is missing');
    errorCount++;
  }
  
  // Check VITE_API_URL
  if (envContent.includes('VITE_API_URL=')) {
    console.log('   ✅ VITE_API_URL is configured');
  } else {
    console.log('   ⚠️  VITE_API_URL is missing (using default)');
    warningCount++;
  }
} else {
  console.log('   ❌ .env file not found - Copy from .env.example');
  errorCount++;
}

// Check 5: Prisma schema exists
console.log('\n5. Checking database setup...');
if (fs.existsSync('prisma/schema.prisma')) {
  console.log('   ✅ Prisma schema exists');
} else {
  console.log('   ❌ Prisma schema not found');
  errorCount++;
}

// Check 6: Prisma client generated
if (fs.existsSync('node_modules/@prisma/client')) {
  console.log('   ✅ Prisma client generated');
} else {
  console.log('   ❌ Prisma client not generated - Run: npx prisma generate');
  errorCount++;
}

// Check 7: Database file exists
if (fs.existsSync('dev.db')) {
  console.log('   ✅ Database file exists');
} else {
  console.log('   ⚠️  Database file not found - Run: npx prisma db push');
  warningCount++;
}

// Check 8: Source directories exist
console.log('\n6. Checking project structure...');
const requiredDirs = ['src', 'server', 'prisma', 'public'];
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   ✅ ${dir}/ directory exists`);
  } else {
    console.log(`   ❌ ${dir}/ directory not found`);
    errorCount++;
  }
});

// Check 9: Key source files exist
console.log('\n7. Checking key files...');
const keyFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'server/index.js',
  'vite.config.ts',
  'tsconfig.json'
];
keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} not found`);
    errorCount++;
  }
});

// Final summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Summary:');

if (errorCount === 0 && warningCount === 0) {
  console.log('   ✅ Perfect! Everything is set up correctly.');
  console.log('\n🚀 Next steps:');
  console.log('   1. Terminal 1: npm run server');
  console.log('   2. Terminal 2: npm run dev');
  console.log('   3. Open http://localhost:5173\n');
  process.exit(0);
} else if (errorCount === 0) {
  console.log(`   ⚠️  Setup is OK but has ${warningCount} warning(s).`);
  console.log('   The app should work but you may want to address warnings.\n');
  console.log('🚀 You can try starting the servers:');
  console.log('   1. Terminal 1: npm run server');
  console.log('   2. Terminal 2: npm run dev\n');
  process.exit(0);
} else {
  console.log(`   ❌ Found ${errorCount} error(s) and ${warningCount} warning(s).`);
  console.log('   Please fix the errors above before starting the servers.\n');
  
  // Provide specific guidance
  if (!fs.existsSync('node_modules')) {
    console.log('🔧 Quick fix: Run these commands:');
    console.log('   npm install');
  }
  if (!fs.existsSync('.env')) {
    console.log('   cp .env.example .env');
    console.log('   # Then edit .env and set JWT_SECRET');
  }
  if (!fs.existsSync('node_modules/@prisma/client')) {
    console.log('   npx prisma generate');
  }
  if (!fs.existsSync('dev.db')) {
    console.log('   npx prisma db push');
  }
  console.log('');
  process.exit(1);
}
