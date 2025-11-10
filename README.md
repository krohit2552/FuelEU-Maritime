# FuelEU Maritime Compliance Dashboard

A comprehensive React-based dashboard for monitoring and managing FuelEU Maritime compliance, featuring route analysis, performance comparison, banking management, and pooling capabilities.

## 🌟 Features

### 📊 Routes Overview
- View and filter shipping routes by vessel type, fuel type, and year
- Monitor GHG intensity, fuel consumption, distance, and total emissions
- Set baseline routes for compliance comparison

<img width="1755" height="816" alt="image" src="https://github.com/user-attachments/assets/59ca2fee-778e-4e37-a6ef-36845163d9a0" />


### 📈 Performance Comparison
- Compare route performance against baseline and target values
- Visualize GHG intensity data with interactive charts
- Compliance status indicators with color-coded metrics.
  
<img width="1765" height="806" alt="image" src="https://github.com/user-attachments/assets/6fe534b8-8b9b-4a0b-b0a1-dda7cdfcaa36" />


### 🏦 Banking Management
- Track Compliance Balance (CB) before and after adjustments
- Bank surplus compliance balances for future use
- Apply banked balances to meet compliance requirements
- Supports Article 20 - Compliance Balance Banking

<img width="1777" height="783" alt="image" src="https://github.com/user-attachments/assets/0d5e9c10-12c3-4cbb-952f-096a97f89ed7" />

### 🤝 Pooling Management
- Create compliance pools with multiple vessels
- Visualize surplus and deficit positions
- Calculate total pool compliance balance
- Supports Article 21 - Compliance Balance Pooling
<img width="1777" height="831" alt="image" src="https://github.com/user-attachments/assets/bc3ec0d2-2a7a-45c2-853b-4a1803e4a0c6" />

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Create the project:**
```bash
npx create-react-app fueleu-Maritime
cd fueleu-Maritime
Install dependencies:


npm install recharts lucide-react
Replace the default App.js:
Copy the provided React code into src/App.js

Start the development server:

npm start
Open your browser:
Navigate to http://localhost:3000

🛠️ Alternative Setup Methods
Using Vite (Faster Development)
bash
npm create vite@latest fueleu-Maritime -- --template react
cd fueleu-Maritime
npm install
npm install recharts lucide-react
npm run dev
📁 Project Structure
text
fueleu-dashboard/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js          # Main application component
│   ├── index.js        # Application entry point
│   └── index.css       # Global styles
├── package.json
└── README.md
🎯 Usage Guide
Routes Tab
Filter routes using the dropdown filters

Set baseline by clicking "Set Baseline" on any route

View metrics including GHG intensity, fuel consumption, and emissions

Compare Tab
Monitor compliance against the target of 89.3368 gCO₂e/MJ

Visualize data with interactive bar charts

Color-coded indicators show performance vs baseline and target

Banking Tab
View CB balance in the summary cards

Bank surplus when CB after is positive

Apply banked balances to meet compliance needs

Pooling Tab
Select ships for pooling by checking the boxes

Monitor total CB in the summary section

Create pools with 2 or more ships having positive total CB

🔧 API Integration
The current implementation uses mock API functions. To integrate with real backend services:

Replace the api object methods with actual API calls

Update endpoints in api.getRoutes(), api.setBaseline(), etc.

Add authentication headers if required

📊 Data Model
Route Object
javascript
{
  routeId: string,
  vesselType: 'Container' | 'BulkCarrier' | 'Tanker' | 'RoRo',
  fuelType: 'HFO' | 'LNG' | 'MGO',
  year: number,
  ghgIntensity: number,      // gCO₂e/MJ
  fuelConsumption: number,   // tons
  distance: number,          // km
  totalEmissions: number,    // tons
  isBaseline: boolean
}
🐛 Troubleshooting
Common Issues
Dependencies not found:

bash
npm install
Port already in use:

bash
npm start -- --port 3001
Build errors:

npm run build
🔒 Compliance Features
FuelEU Maritime Regulation Support
Article 6: GHG intensity calculation

Article 20: Compliance balance banking

Article 21: Compliance balance pooling

Note: This is a frontend demonstration application. For production use, integrate with proper backend services and implement comprehensive error handling.

Name -Rohit Kumar
mobile: 8651712231
gmail:kumarrohit2551997@gmail.com
github link: https://github.com/krohit2552/FuelEU-Maritime
demo: https://claude.ai/public/artifacts/12c5c466-9fb3-4c60-a30e-43078d876615
