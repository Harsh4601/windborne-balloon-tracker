#!/usr/bin/env node

/**
 * Submission script for WindBorne Systems Junior Web Developer application
 * 
 * Usage:
 *   node submit-application.js
 * 
 * Make sure to fill in all the required fields before running!
 */

const https = require('https');

// ============================================
// FILL IN YOUR INFORMATION BELOW
// ============================================

const APPLICATION_DATA = {
    career_application: {
        name: "Harsh Vivek Londhekar",
        email: "harsh.londhekar@stonybrook.edu",
        role: "Junior Web Developer",
        notes: "I specialize in building interactive web applications with modern JavaScript. I'm passionate about creating data visualizations that make complex information accessible and engaging. I work well in collaborative environments and enjoy solving challenging problems. I chose to integrate OpenWeatherMap API because weather balloons are designed to collect atmospheric data, and combining their positions with real-time weather conditions allows us to visualize the relationship between balloon locations and weather patterns, demonstrating how this constellation provides comprehensive global weather coverage.",
        submission_url: "https://harsh4601.github.io/windborne-balloon-tracker/", // Will be updated after deployment
        portfolio_url: "https://harsh4601.github.io/",
        resume_url: "YOUR_RESUME_URL" // Need direct PDF link - see RESUME_LINK_INSTRUCTIONS.md
    }
};

// ============================================
// SUBMISSION FUNCTION
// ============================================

function submitApplication() {
    // Validate that all fields are filled
    const requiredFields = [
        'name', 'email', 'submission_url', 
        'portfolio_url', 'resume_url'
    ];
    
    const missingFields = requiredFields.filter(field => {
        const value = APPLICATION_DATA.career_application[field];
        return !value || value.startsWith('YOUR_') || value.trim() === '';
    });
    
    if (missingFields.length > 0) {
        console.error('❌ Error: Please fill in all required fields:');
        missingFields.forEach(field => {
            console.error(`   - ${field}`);
        });
        process.exit(1);
    }
    
    const postData = JSON.stringify(APPLICATION_DATA);
    
    const options = {
        hostname: 'windbornesystems.com',
        port: 443,
        path: '/career_applications.json',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    console.log('📤 Submitting application to WindBorne Systems...');
    console.log(`   Name: ${APPLICATION_DATA.career_application.name}`);
    console.log(`   Email: ${APPLICATION_DATA.career_application.email}`);
    console.log(`   Submission URL: ${APPLICATION_DATA.career_application.submission_url}`);
    console.log('');
    
    const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`📊 Response Status: ${res.statusCode}`);
            
            if (res.statusCode === 200) {
                console.log('✅ Success! Your application has been submitted.');
                console.log('   Response:', data);
            } else {
                console.error('❌ Error: Application was not accepted.');
                console.error('   Status Code:', res.statusCode);
                console.error('   Response:', data);
                process.exit(1);
            }
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Network Error:', error.message);
        process.exit(1);
    });
    
    req.write(postData);
    req.end();
}

// Run the submission
submitApplication();

