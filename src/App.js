import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

// Mock API Client (replace with actual API calls)
const api = {
  async getRoutes() {
    return [
      { routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, isBaseline: true },
      { routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200, isBaseline: false },
      { routeId: 'R003', vesselType: 'Tanker', fuelType: 'MGO', year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700, isBaseline: false },
      { routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO', year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300, isBaseline: false },
      { routeId: 'R005', vesselType: 'Container', fuelType: 'LNG', year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400, isBaseline: false }
    ];
  },
  
  async setBaseline(routeId) {
    console.log('Setting baseline for:', routeId);
    return { success: true };
  },
  
  async getComparison() {
    const routes = await this.getRoutes();
    const baseline = routes.find(r => r.isBaseline);
    const target = 89.3368;
    
    return routes.map(route => ({
      ...route,
      percentDiff: ((route.ghgIntensity / baseline.ghgIntensity - 1) * 100).toFixed(2),
      vsTarget: ((route.ghgIntensity / target - 1) * 100).toFixed(2),
      compliant: route.ghgIntensity <= target
    }));
  },
  
  async getComplianceBalance(year) {
    return {
      year,
      cb_before: 1500.5,
      applied: 0,
      cb_after: 1500.5,
      unit: 'gCO2eq'
    };
  },
  
  async bankSurplus(amount) {
    return { success: true, banked: amount };
  },
  
  async applyBanked(amount) {
    return { success: true, applied: amount };
  },
  
  async getAdjustedCB(year) {
    return [
      { shipId: 'S001', name: 'MV Atlantic', adjustedCB: 2500 },
      { shipId: 'S002', name: 'MV Pacific', adjustedCB: -1200 },
      { shipId: 'S003', name: 'MV Nordic', adjustedCB: 800 },
      { shipId: 'S004', name: 'MV Southern', adjustedCB: -300 }
    ];
  },
  
  async createPool(members) {
    return {
      poolId: 'P001',
      members: members.map(m => ({
        ...m,
        cb_after: m.adjustedCB > 0 ? m.adjustedCB * 0.8 : m.adjustedCB * 0.9
      })),
      totalCB: members.reduce((sum, m) => sum + m.adjustedCB, 0)
    };
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('routes');
  const [routes, setRoutes] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [cbData, setCbData] = useState(null);
  const [ships, setShips] = useState([]);
  const [selectedShips, setSelectedShips] = useState([]);
  const [poolResult, setPoolResult] = useState(null);
  const [filters, setFilters] = useState({ vesselType: '', fuelType: '', year: '' });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === 'routes') {
      const data = await api.getRoutes();
      setRoutes(data);
    } else if (activeTab === 'compare') {
      const data = await api.getComparison();
      setComparison(data);
    } else if (activeTab === 'banking') {
      const data = await api.getComplianceBalance(2024);
      setCbData(data);
    } else if (activeTab === 'pooling') {
      const data = await api.getAdjustedCB(2024);
      setShips(data);
    }
  };

  const handleSetBaseline = async (routeId) => {
    await api.setBaseline(routeId);
    loadData();
  };

  const handleBankSurplus = async () => {
    if (cbData && cbData.cb_after > 0) {
      await api.bankSurplus(cbData.cb_after);
      loadData();
    }
  };

  const handleApplyBanked = async (amount) => {
    await api.applyBanked(amount);
    loadData();
  };

  const toggleShipSelection = (shipId) => {
    setSelectedShips(prev => 
      prev.includes(shipId) 
        ? prev.filter(id => id !== shipId)
        : [...prev, shipId]
    );
  };

  const handleCreatePool = async () => {
    const members = ships.filter(s => selectedShips.includes(s.shipId));
    const result = await api.createPool(members);
    setPoolResult(result);
  };

  const filteredRoutes = routes.filter(route => {
    return (!filters.vesselType || route.vesselType === filters.vesselType) &&
           (!filters.fuelType || route.fuelType === filters.fuelType) &&
           (!filters.year || route.year.toString() === filters.year);
  });

  const totalPoolCB = ships
    .filter(s => selectedShips.includes(s.shipId))
    .reduce((sum, s) => sum + s.adjustedCB, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">FuelEU Maritime Compliance</h1>
          <p className="text-indigo-600">Monitoring & Management Dashboard</p>
        </header>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white rounded-lg p-2 shadow-md">
          {['routes', 'compare', 'banking', 'pooling'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Routes Tab */}
        {activeTab === 'routes' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Routes Overview</h2>
            
            {/* Filters */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <select
                value={filters.vesselType}
                onChange={(e) => setFilters({...filters, vesselType: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Vessel Types</option>
                <option value="Container">Container</option>
                <option value="BulkCarrier">Bulk Carrier</option>
                <option value="Tanker">Tanker</option>
                <option value="RoRo">RoRo</option>
              </select>
              
              <select
                value={filters.fuelType}
                onChange={(e) => setFilters({...filters, fuelType: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Fuel Types</option>
                <option value="HFO">HFO</option>
                <option value="LNG">LNG</option>
                <option value="MGO">MGO</option>
              </select>
              
              <select
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Route ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Vessel Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Fuel Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Year</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">GHG Intensity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Fuel (t)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Distance (km)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Emissions (t)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.map(route => (
                    <tr key={route.routeId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{route.routeId}</td>
                      <td className="px-4 py-3">{route.vesselType}</td>
                      <td className="px-4 py-3">{route.fuelType}</td>
                      <td className="px-4 py-3">{route.year}</td>
                      <td className="px-4 py-3">{route.ghgIntensity} gCO₂e/MJ</td>
                      <td className="px-4 py-3">{route.fuelConsumption.toLocaleString()}</td>
                      <td className="px-4 py-3">{route.distance.toLocaleString()}</td>
                      <td className="px-4 py-3">{route.totalEmissions.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleSetBaseline(route.routeId)}
                          disabled={route.isBaseline}
                          className={`px-3 py-1 rounded text-sm ${
                            route.isBaseline
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {route.isBaseline ? '✓ Baseline' : 'Set Baseline'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance Comparison</h2>
            <p className="text-gray-600 mb-6">Target: 89.3368 gCO₂e/MJ (2% below baseline)</p>
            
            <div className="overflow-x-auto mb-8">
              <table className="w-full">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Route ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Vessel Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">GHG Intensity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">% vs Baseline</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">% vs Target</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map(route => (
                    <tr key={route.routeId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{route.routeId}</td>
                      <td className="px-4 py-3">{route.vesselType}</td>
                      <td className="px-4 py-3">{route.ghgIntensity} gCO₂e/MJ</td>
                      <td className="px-4 py-3">
                        <span className={route.percentDiff < 0 ? 'text-green-600' : 'text-red-600'}>
                          {route.percentDiff}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={route.vsTarget < 0 ? 'text-green-600' : 'text-red-600'}>
                          {route.vsTarget}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {route.compliant ? (
                          <CheckCircle className="text-green-600" size={20} />
                        ) : (
                          <AlertCircle className="text-red-600" size={20} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="routeId" />
                <YAxis label={{ value: 'GHG Intensity (gCO₂e/MJ)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="ghgIntensity" fill="#4f46e5" name="GHG Intensity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Banking Tab */}
        {activeTab === 'banking' && cbData && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Banking Management</h2>
            <p className="text-gray-600 mb-6">Article 20 - Compliance Balance Banking</p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">CB Before</h3>
                <p className="text-3xl font-bold text-blue-700">{cbData.cb_before.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">gCO₂eq</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-purple-900 mb-2">Applied</h3>
                <p className="text-3xl font-bold text-purple-700">{cbData.applied.toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">gCO₂eq</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-green-900 mb-2">CB After</h3>
                <p className="text-3xl font-bold text-green-700">{cbData.cb_after.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">gCO₂eq</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleBankSurplus}
                disabled={cbData.cb_after <= 0}
                className={`px-6 py-3 rounded-lg font-medium ${
                  cbData.cb_after > 0
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <TrendingUp className="inline mr-2" size={20} />
                Bank Surplus
              </button>
              
              <button
                onClick={() => handleApplyBanked(500)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                <TrendingDown className="inline mr-2" size={20} />
                Apply Banked
              </button>
            </div>
          </div>
        )}

        {/* Pooling Tab */}
        {activeTab === 'pooling' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pooling Management</h2>
            <p className="text-gray-600 mb-6">Article 21 - Compliance Balance Pooling</p>

            <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-indigo-900">Total Pool CB:</span>
                <span className={`text-2xl font-bold ${totalPoolCB >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalPoolCB.toLocaleString()} gCO₂eq
                </span>
              </div>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Select</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Ship ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Adjusted CB</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ships.map(ship => (
                    <tr key={ship.shipId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedShips.includes(ship.shipId)}
                          onChange={() => toggleShipSelection(ship.shipId)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">{ship.shipId}</td>
                      <td className="px-4 py-3">{ship.name}</td>
                      <td className="px-4 py-3">
                        <span className={ship.adjustedCB >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {ship.adjustedCB.toLocaleString()} gCO₂eq
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {ship.adjustedCB >= 0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Surplus</span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">Deficit</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleCreatePool}
              disabled={selectedShips.length < 2 || totalPoolCB < 0}
              className={`px-6 py-3 rounded-lg font-medium ${
                selectedShips.length >= 2 && totalPoolCB >= 0
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create Pool
            </button>

            {poolResult && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">Pool Created Successfully!</h3>
                <p className="text-sm text-green-700">Pool ID: {poolResult.poolId}</p>
                <p className="text-sm text-green-700">Total CB: {poolResult.totalCB.toLocaleString()} gCO₂eq</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;