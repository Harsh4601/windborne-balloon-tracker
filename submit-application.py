#!/usr/bin/env python3

"""
Submission script for WindBorne Systems Junior Web Developer application

Usage:
    python3 submit-application.py

Make sure to fill in all the required fields before running!
"""

import json
import urllib.request
import urllib.error
import sys

# ============================================
# FILL IN YOUR INFORMATION BELOW
# ============================================

APPLICATION_DATA = {
    "career_application": {
        "name": "Harsh Vivek Londhekar",
        "email": "harsh.londhekar@stonybrook.edu",
        "role": "Junior Web Developer",
        "notes": "I specialize in building interactive web applications with modern JavaScript. I'm passionate about creating data visualizations that make complex information accessible and engaging. I work well in collaborative environments and enjoy solving challenging problems. I chose to integrate OpenWeatherMap API because weather balloons are designed to collect atmospheric data, and combining their positions with real-time weather conditions allows us to visualize the relationship between balloon locations and weather patterns, demonstrating how this constellation provides comprehensive global weather coverage.",
        "submission_url": "https://harsh4601.github.io/windborne-balloon-tracker/",  # Will be updated after deployment
        "portfolio_url": "https://harsh4601.github.io/",
        "resume_url": "https://drive.google.com/uc?export=download&id=114uC2GT73zQuzP1kSr0U19--TDIjpoW-"
    }
}

# ============================================
# SUBMISSION FUNCTION
# ============================================

def submit_application():
    # Validate that all fields are filled
    required_fields = ['name', 'email', 'submission_url', 'portfolio_url', 'resume_url']
    missing_fields = []
    
    for field in required_fields:
        value = APPLICATION_DATA['career_application'][field]
        if not value or value.startswith('YOUR_') or value.strip() == '':
            missing_fields.append(field)
    
    if missing_fields:
        print('❌ Error: Please fill in all required fields:')
        for field in missing_fields:
            print(f'   - {field}')
        sys.exit(1)
    
    url = 'https://windbornesystems.com/career_applications.json'
    data = json.dumps(APPLICATION_DATA).encode('utf-8')
    
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            'Content-Type': 'application/json',
            'Content-Length': len(data)
        }
    )
    
    print('📤 Submitting application to WindBorne Systems...')
    print(f'   Name: {APPLICATION_DATA["career_application"]["name"]}')
    print(f'   Email: {APPLICATION_DATA["career_application"]["email"]}')
    print(f'   Submission URL: {APPLICATION_DATA["career_application"]["submission_url"]}')
    print()
    
    try:
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            response_data = response.read().decode('utf-8')
            
            print(f'📊 Response Status: {status_code}')
            
            if status_code == 200:
                print('✅ Success! Your application has been submitted.')
                print(f'   Response: {response_data}')
            else:
                print(f'❌ Error: Application was not accepted.')
                print(f'   Status Code: {status_code}')
                print(f'   Response: {response_data}')
                sys.exit(1)
                
    except urllib.error.HTTPError as e:
        print(f'❌ HTTP Error: {e.code}')
        print(f'   Response: {e.read().decode("utf-8")}')
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f'❌ Network Error: {e.reason}')
        sys.exit(1)

if __name__ == '__main__':
    submit_application()

