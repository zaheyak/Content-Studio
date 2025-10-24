#!/usr/bin/env node

/**
 * Comprehensive Test Runner for Content Studio Backend
 * Executes all test suites with detailed reporting
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      suites: []
    };
    this.startTime = Date.now();
  }

  async runAllTests() {
    console.log('🧪 Starting Comprehensive Test Suite for Content Studio Backend\n');
    
    const testSuites = [
      { name: 'Unit Tests', pattern: 'tests/domain/**/*.test.js' },
      { name: 'Application Tests', pattern: 'tests/application/**/*.test.js' },
      { name: 'Infrastructure Tests', pattern: 'tests/infrastructure/**/*.test.js' },
      { name: 'Integration Tests', pattern: 'tests/integration/**/*.test.js' },
      { name: 'Performance Tests', pattern: 'tests/performance/**/*.test.js' },
      { name: 'Security Tests', pattern: 'tests/security/**/*.test.js' }
    ];

    for (const suite of testSuites) {
      await this.runTestSuite(suite);
    }

    this.generateReport();
  }

  async runTestSuite(suite) {
    console.log(`\n📋 Running ${suite.name}...`);
    
    try {
      const command = `npx jest ${suite.pattern} --verbose --coverage --passWithNoTests`;
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: process.cwd()
      });

      const suiteResult = this.parseJestOutput(output);
      this.results.suites.push({
        name: suite.name,
        ...suiteResult
      });

      console.log(`✅ ${suite.name} completed: ${suiteResult.passed}/${suiteResult.total} tests passed`);
      
    } catch (error) {
      console.log(`❌ ${suite.name} failed: ${error.message}`);
      this.results.suites.push({
        name: suite.name,
        passed: 0,
        total: 0,
        failed: 1,
        error: error.message
      });
    }
  }

  parseJestOutput(output) {
    const lines = output.split('\n');
    let total = 0;
    let passed = 0;
    let failed = 0;

    for (const line of lines) {
      if (line.includes('Test Suites:')) {
        const match = line.match(/(\d+) passed, (\d+) total/);
        if (match) {
          passed = parseInt(match[1]);
          total = parseInt(match[2]);
        }
      }
      if (line.includes('Tests:')) {
        const match = line.match(/(\d+) passed, (\d+) total/);
        if (match) {
          passed = parseInt(match[1]);
          total = parseInt(match[2]);
        }
      }
    }

    return { total, passed, failed: total - passed };
  }

  generateReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    // Calculate totals
    this.results.total = this.results.suites.reduce((sum, suite) => sum + suite.total, 0);
    this.results.passed = this.results.suites.reduce((sum, suite) => sum + suite.passed, 0);
    this.results.failed = this.results.total - this.results.passed;

    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE TEST REPORT');
    console.log('='.repeat(80));
    
    console.log(`\n⏱️  Total Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`📈 Total Tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📊 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);

    console.log('\n📋 Test Suite Breakdown:');
    console.log('-'.repeat(80));
    
    this.results.suites.forEach(suite => {
      const status = suite.failed > 0 ? '❌' : '✅';
      const percentage = suite.total > 0 ? ((suite.passed / suite.total) * 100).toFixed(1) : '0.0';
      console.log(`${status} ${suite.name.padEnd(20)} ${suite.passed}/${suite.total} (${percentage}%)`);
    });

    // Generate detailed report file
    this.generateDetailedReport(duration);
    
    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }

  generateDetailedReport(duration) {
    const report = {
      timestamp: new Date().toISOString(),
      duration: duration,
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: ((this.results.passed / this.results.total) * 100).toFixed(1)
      },
      suites: this.results.suites,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };

    const reportPath = path.join(process.cwd(), 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
