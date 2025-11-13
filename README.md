# WindBorne Balloon Constellation Tracker

An interactive web application that visualizes WindBorne Systems' constellation of 1000 weather balloons over the past 24 hours, combined with weather data integration.

## Features

- 📊 **Real-time Position Tracking**: Displays all 1000 balloons from the WindBorne API
- 🌦️ **Weather Data Integration**: Shows weather conditions at balloon locations using OpenWeatherMap API
- 📈 **Trajectory Visualization**: See how balloons move over 24 hours
- 🗺️ **Interactive Time Slider**: Explore historical positions from current to 23 hours ago
- 🔥 **Density Heatmap**: Visualize balloon concentration across the globe
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🛡️ **Robust Error Handling**: Gracefully handles corrupted or missing data

## External API Integration

**OpenWeatherMap API** - I chose this API because weather balloons are designed to collect atmospheric data. Combining their positions with real-time weather conditions allows us to visualize the relationship between balloon locations and weather patterns, demonstrating how this constellation provides comprehensive global weather coverage. This integration showcases the practical application of the balloon data in understanding weather systems.

## Setup & Deployment

### Local Development

1. Clone or download this repository
2. Serve the files using a local web server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

### Production Deployment

#### Option 1: GitHub Pages
1. Push this repository to GitHub
2. Go to Settings > Pages
3. Select the main branch and save
4. Your site will be available at `https://yourusername.github.io/repo-name`

#### Option 2: Netlify
1. Drag and drop the project folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your site will be instantly deployed with a public URL

#### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

#### Option 4: Any Static Hosting
Since this is a static site (HTML/CSS/JS), you can deploy it to any static hosting service:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Surge.sh
- etc.

## Technical Details

- **Frontend**: Vanilla JavaScript (no frameworks required)
- **Mapping**: Leaflet.js for interactive maps
- **Data Source**: WindBorne Systems API (`https://a.windbornesystems.com/treasure/`)
- **Weather API**: OpenWeatherMap (currently using mock data for demo)
- **Error Handling**: Robust parsing handles corrupted or unexpected data formats

## Notes

- The application fetches data from 24 endpoints (00.json through 23.json)
- Data is cached to minimize API calls
- Balloon positions are sampled for performance (showing ~200 markers at a time)
- Weather data uses mock generation for demo purposes (replace with actual API key for production)

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Live Demo

🌐 **View the live application**: [https://harsh4601.github.io/windborne-balloon-tracker/](https://harsh4601.github.io/windborne-balloon-tracker/)

## License

This project was created for the WindBorne Systems Junior Web Developer application challenge.

