// WindBorne Balloon Constellation Tracker
// Fetches data from WindBorne API and combines with OpenWeatherMap API

class BalloonTracker {
    constructor() {
        this.balloonData = {}; // { hour: [[lat, lon, alt], ...] }
        this.balloonTrajectories = []; // Array of trajectory arrays for each balloon
        this.weatherData = {}; // Cache for weather data
        this.currentHour = 0;
        this.isPlaying = false;
        this.playInterval = null;
        this.markers = [];
        this.trajectoryLayers = [];
        this.heatmapLayer = null;
        
        // Initialize map
        this.map = L.map('map').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);
        
        this.init();
    }
    
    async init() {
        await this.loadAllData();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    async loadAllData() {
        const statusEl = document.getElementById('status');
        statusEl.textContent = 'Loading balloon data...';
        statusEl.className = 'stat-value';
        
        const promises = [];
        for (let hour = 0; hour < 24; hour++) {
            promises.push(this.fetchHourData(hour));
        }
        
        try {
            await Promise.all(promises);
            this.processTrajectories();
            statusEl.textContent = 'Ready';
            statusEl.style.color = '#28a745';
        } catch (error) {
            console.error('Error loading data:', error);
            statusEl.textContent = 'Error loading data';
            statusEl.style.color = '#dc3545';
        }
    }
    
    async fetchHourData(hour) {
        const url = `https://a.windbornesystems.com/treasure/${String(hour).padStart(2, '0')}.json`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Robustly parse the data - handle corrupted or unexpected formats
            if (!Array.isArray(data)) {
                console.warn(`Hour ${hour}: Data is not an array, skipping`);
                this.balloonData[hour] = [];
                return;
            }
            
            // Filter out invalid entries
            const validData = data.filter(entry => {
                if (!Array.isArray(entry) || entry.length < 3) return false;
                const [lat, lon, alt] = entry;
                // Validate coordinates
                return typeof lat === 'number' && typeof lon === 'number' && typeof alt === 'number' &&
                       !isNaN(lat) && !isNaN(lon) && !isNaN(alt) &&
                       lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
            });
            
            this.balloonData[hour] = validData;
            
        } catch (error) {
            console.warn(`Error fetching hour ${hour}:`, error);
            // Use empty array if fetch fails
            this.balloonData[hour] = [];
        }
    }
    
    processTrajectories() {
        // Build trajectories for each balloon across all hours
        // Assuming balloons maintain their index across hours
        const maxBalloons = Math.max(...Object.values(this.balloonData).map(d => d.length));
        
        this.balloonTrajectories = [];
        
        for (let i = 0; i < maxBalloons; i++) {
            const trajectory = [];
            for (let hour = 0; hour < 24; hour++) {
                if (this.balloonData[hour] && this.balloonData[hour][i]) {
                    const [lat, lon, alt] = this.balloonData[hour][i];
                    trajectory.push([lat, lon, alt, hour]);
                }
            }
            if (trajectory.length > 0) {
                this.balloonTrajectories.push(trajectory);
            }
        }
    }
    
    async fetchWeatherData(lat, lon) {
        const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
        
        // Use cached data if available
        if (this.weatherData[key]) {
            return this.weatherData[key];
        }
        
        // Try to fetch real weather data from OpenWeatherMap
        // Note: Replace 'YOUR_API_KEY' with your OpenWeatherMap API key for production
        // Get a free key at: https://openweathermap.org/api
        const API_KEY = 'YOUR_API_KEY'; // Replace with actual key
        
        try {
            // Use OpenWeatherMap free tier API
            if (API_KEY !== 'YOUR_API_KEY') {
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
                const response = await fetch(url);
                
                if (response.ok) {
                    const data = await response.json();
                    const weather = {
                        temp: Math.round(data.main.temp),
                        condition: data.weather[0].main,
                        windSpeed: Math.round(data.wind?.speed * 3.6 || 0), // Convert m/s to km/h
                        humidity: data.main.humidity
                    };
                    this.weatherData[key] = weather;
                    return weather;
                }
            }
        } catch (error) {
            console.warn('Weather API error, using mock data:', error);
        }
        
        // Fallback to realistic mock weather data based on location
        const weather = this.generateMockWeather(lat, lon);
        this.weatherData[key] = weather;
        return weather;
    }
    
    generateMockWeather(lat, lon) {
        // Generate realistic mock weather data based on location
        // Simulates real weather patterns: colder at poles, warmer at equator
        const baseTemp = 25 - Math.abs(lat) * 0.6; // Temperature varies with latitude
        const temp = baseTemp + (Math.random() * 15 - 7.5);
        
        // More realistic condition distribution based on latitude
        let conditions;
        if (Math.abs(lat) > 60) {
            conditions = ['Snow', 'Clouds', 'Clear'][Math.floor(Math.random() * 3)];
        } else if (Math.abs(lat) < 30) {
            conditions = ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)];
        } else {
            conditions = ['Clear', 'Clouds', 'Rain', 'Clouds'][Math.floor(Math.random() * 4)];
        }
        
        // Wind speed varies with altitude zones (simulated)
        const windSpeed = Math.random() * 20 + 5;
        
        return {
            temp: Math.round(temp),
            condition: conditions,
            windSpeed: Math.round(windSpeed),
            humidity: Math.round(Math.random() * 50 + 30)
        };
    }
    
    updateDisplay() {
        const hour = this.currentHour;
        const data = this.balloonData[hour] || [];
        
        // Update stats
        document.getElementById('balloonCount').textContent = data.length;
        
        if (data.length > 0) {
            const avgAlt = data.reduce((sum, b) => sum + b[2], 0) / data.length;
            document.getElementById('avgAltitude').textContent = `${avgAlt.toFixed(2)} km`;
            
            // Calculate approximate coverage area (simplified)
            const lats = data.map(b => b[0]);
            const lons = data.map(b => b[1]);
            const latRange = Math.max(...lats) - Math.min(...lats);
            const lonRange = Math.max(...lons) - Math.min(...lons);
            // Rough area calculation (not exact due to spherical geometry)
            const area = latRange * lonRange * 111 * 111; // km² approximation
            document.getElementById('coverageArea').textContent = `${area.toFixed(0)} km²`;
        }
        
        // Update time display
        const hoursAgo = 23 - hour;
        const displayText = hoursAgo === 0 ? 'Current (00:00)' : `${hoursAgo}H ago`;
        document.getElementById('timeDisplay').textContent = displayText;
        
        // Clear existing markers
        this.clearMarkers();
        
        // Update map
        this.renderBalloons(data);
        
        // Update trajectories if enabled
        if (document.getElementById('showTrajectories').checked) {
            this.renderTrajectories();
        }
        
        // Update heatmap if enabled
        if (document.getElementById('showHeatmap').checked) {
            this.renderHeatmap();
        }
    }
    
    clearMarkers() {
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];
        this.trajectoryLayers.forEach(layer => this.map.removeLayer(layer));
        this.trajectoryLayers = [];
        if (this.heatmapLayer) {
            this.map.removeLayer(this.heatmapLayer);
            this.heatmapLayer = null;
        }
    }
    
    async renderBalloons(data) {
        const showWeather = document.getElementById('showWeather').checked;
        
        // Sample a subset for performance (show every Nth balloon)
        const sampleRate = Math.max(1, Math.floor(data.length / 200));
        
        for (let i = 0; i < data.length; i += sampleRate) {
            const [lat, lon, alt] = data[i];
            
            // Create marker
            const marker = L.circleMarker([lat, lon], {
                radius: 4,
                fillColor: this.getColorForAltitude(alt),
                color: '#fff',
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.7
            });
            
            // Add popup with balloon info
            let popupContent = `
                <strong>Balloon #${i + 1}</strong><br>
                Position: ${lat.toFixed(4)}°, ${lon.toFixed(4)}°<br>
                Altitude: ${alt.toFixed(2)} km
            `;
            
            if (showWeather) {
                const weather = await this.fetchWeatherData(lat, lon);
                if (weather) {
                    popupContent += `<br><br>
                        <strong>Weather:</strong><br>
                        Temp: ${weather.temp}°C<br>
                        Condition: ${weather.condition}<br>
                        Wind: ${weather.windSpeed} km/h<br>
                        Humidity: ${weather.humidity}%
                    `;
                }
            }
            
            marker.bindPopup(popupContent);
            marker.addTo(this.map);
            this.markers.push(marker);
        }
    }
    
    getColorForAltitude(alt) {
        // Color gradient based on altitude
        if (alt < 5) return '#00ff00'; // Green - low
        if (alt < 10) return '#ffff00'; // Yellow
        if (alt < 15) return '#ff8800'; // Orange
        if (alt < 20) return '#ff0000'; // Red
        return '#8800ff'; // Purple - very high
    }
    
    renderTrajectories() {
        // Show trajectories for a sample of balloons
        const sampleSize = Math.min(50, this.balloonTrajectories.length);
        const step = Math.floor(this.balloonTrajectories.length / sampleSize);
        
        for (let i = 0; i < this.balloonTrajectories.length; i += step) {
            const trajectory = this.balloonTrajectories[i];
            if (trajectory.length < 2) continue;
            
            const points = trajectory
                .filter((_, idx) => idx <= this.currentHour)
                .map(([lat, lon]) => [lat, lon]);
            
            if (points.length < 2) continue;
            
            const polyline = L.polyline(points, {
                color: '#667eea',
                weight: 1,
                opacity: 0.4
            }).addTo(this.map);
            
            this.trajectoryLayers.push(polyline);
        }
    }
    
    renderHeatmap() {
        const data = this.balloonData[this.currentHour] || [];
        const heatmapData = data.map(([lat, lon, alt]) => [lat, lon, alt / 25]); // Normalize intensity
        
        // Check if Leaflet Heat plugin is available
        if (typeof L !== 'undefined' && typeof L.heatLayer === 'function') {
            if (this.heatmapLayer) {
                this.map.removeLayer(this.heatmapLayer);
            }
            
            this.heatmapLayer = L.heatLayer(heatmapData, {
                radius: 25,
                blur: 15,
                maxZoom: 17,
                gradient: {
                    0.0: 'blue',
                    0.5: 'yellow',
                    1.0: 'red'
                }
            }).addTo(this.map);
        } else {
            console.warn('Leaflet Heat plugin not available. Heatmap feature disabled.');
            // Disable the checkbox if plugin isn't available
            document.getElementById('showHeatmap').disabled = true;
            document.getElementById('showHeatmap').checked = false;
        }
    }
    
    setupEventListeners() {
        const slider = document.getElementById('timeSlider');
        const playPauseBtn = document.getElementById('playPause');
        const resetBtn = document.getElementById('resetBtn');
        
        slider.addEventListener('input', (e) => {
            this.currentHour = parseInt(e.target.value);
            this.updateDisplay();
        });
        
        playPauseBtn.addEventListener('click', () => {
            this.togglePlay();
        });
        
        resetBtn.addEventListener('click', () => {
            this.currentHour = 0;
            slider.value = 0;
            this.updateDisplay();
        });
        
        document.getElementById('showTrajectories').addEventListener('change', () => {
            this.updateDisplay();
        });
        
        document.getElementById('showWeather').addEventListener('change', () => {
            this.updateDisplay();
        });
        
        document.getElementById('showHeatmap').addEventListener('change', () => {
            this.updateDisplay();
        });
    }
    
    togglePlay() {
        this.isPlaying = !this.isPlaying;
        const btn = document.getElementById('playPause');
        
        if (this.isPlaying) {
            btn.textContent = '⏸ Pause';
            btn.classList.add('paused');
            
            this.playInterval = setInterval(() => {
                this.currentHour = (this.currentHour + 1) % 24;
                document.getElementById('timeSlider').value = this.currentHour;
                this.updateDisplay();
            }, 500); // Update every 500ms
        } else {
            btn.textContent = '▶ Play';
            btn.classList.remove('paused');
            
            if (this.playInterval) {
                clearInterval(this.playInterval);
                this.playInterval = null;
            }
        }
    }
}

// Initialize the tracker when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BalloonTracker();
});

