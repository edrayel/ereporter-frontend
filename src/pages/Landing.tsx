import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LocationMarkerIcon as MapPinIcon,
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon as ExclamationTriangleIcon,
  ViewGridIcon as Squares2X2Icon,
  MenuIcon as ListBulletIcon,
  MapIcon,
  ArrowRightIcon,
  PlayIcon,
  ArrowsExpandIcon,
} from '@heroicons/react/outline';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FullscreenMapModal from '../components/modals/FullscreenMapModal';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ElectionStats {
  totalPollingUnits: number;
  reportedResults: number;
  verifiedResults: number;
  totalVotes: number;
  states: number;
  lgas: number;
}

interface LiveResult {
  id: string;
  state: string;
  lga: string;
  pollingUnit: string;
  totalVotes: number;
  status: 'verified' | 'pending' | 'disputed';
  reportedAt: string;
  latitude: number;
  longitude: number;
  candidates: {
    name: string;
    party: string;
    votes: number;
    percentage: number;
  }[];
}

const Landing: React.FC = () => {
  const [activeView, setActiveView] = useState<'grid' | 'list' | 'map'>('grid');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [showFullscreenMap, setShowFullscreenMap] = useState(false);
  const [stats, setStats] = useState<ElectionStats>({
    totalPollingUnits: 176846,
    reportedResults: 89234,
    verifiedResults: 67891,
    totalVotes: 25678432,
    states: 36,
    lgas: 774,
  });
  const [liveResults, setLiveResults] = useState<LiveResult[]>([]);
  const [loading, setLoading] = useState(true);

  const nigerianStates = [
    'Abia',
    'Adamawa',
    'Akwa Ibom',
    'Anambra',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Edo',
    'Ekiti',
    'Enugu',
    'FCT',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara',
  ];

  useEffect(() => {
    // Simulate loading live results
    const timer = setTimeout(() => {
      setLiveResults(generateMockResults());
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const generateMockResults = (): LiveResult[] => {
    const results: LiveResult[] = [];
    const parties = ['APC', 'PDP', 'LP', 'NNPP', 'ADC'];
    const candidates = {
      APC: 'Bola Tinubu',
      PDP: 'Atiku Abubakar',
      LP: 'Peter Obi',
      NNPP: 'Rabiu Kwankwaso',
      ADC: 'Dumebi Kachikwu',
    };

    // Nigerian states with approximate coordinates
    const stateCoordinates: { [key: string]: { lat: number; lng: number } } = {
      Lagos: { lat: 6.5244, lng: 3.3792 },
      Kano: { lat: 12.0022, lng: 8.592 },
      Rivers: { lat: 4.8156, lng: 6.9778 },
      Kaduna: { lat: 10.5105, lng: 7.4165 },
      Oyo: { lat: 8.0, lng: 4.0 },
      Ogun: { lat: 7.1608, lng: 3.3566 },
      Imo: { lat: 5.4844, lng: 7.0328 },
      Borno: { lat: 11.8846, lng: 13.1502 },
      Anambra: { lat: 6.2209, lng: 6.9957 },
      Delta: { lat: 5.6804, lng: 5.9017 },
      'Akwa Ibom': { lat: 5.0077, lng: 7.8536 },
      Osun: { lat: 7.5629, lng: 4.52 },
      Edo: { lat: 6.335, lng: 5.6037 },
      Kwara: { lat: 8.9669, lng: 4.581 },
      Abia: { lat: 5.4527, lng: 7.5248 },
      Adamawa: { lat: 9.3265, lng: 12.3984 },
      Bauchi: { lat: 10.3158, lng: 9.8442 },
      Bayelsa: { lat: 4.6684, lng: 6.2327 },
      Benue: { lat: 7.1906, lng: 8.134 },
      'Cross River': { lat: 5.963, lng: 8.3405 },
      Ebonyi: { lat: 6.2649, lng: 8.0137 },
      Ekiti: { lat: 7.7193, lng: 5.311 },
      Enugu: { lat: 6.5244, lng: 7.5086 },
      FCT: { lat: 9.0765, lng: 7.3986 },
      Gombe: { lat: 10.2904, lng: 11.167 },
      Jigawa: { lat: 12.23, lng: 9.35 },
      Katsina: { lat: 12.9908, lng: 7.6018 },
      Kebbi: { lat: 12.4539, lng: 4.1975 },
      Kogi: { lat: 7.8006, lng: 6.7393 },
      Nasarawa: { lat: 8.5378, lng: 8.3206 },
      Niger: { lat: 10.4806, lng: 6.5567 },
      Ondo: { lat: 7.25, lng: 5.25 },
      Plateau: { lat: 9.2182, lng: 9.5179 },
      Sokoto: { lat: 13.0059, lng: 5.2476 },
      Taraba: { lat: 7.8731, lng: 9.7886 },
      Yobe: { lat: 12.2939, lng: 11.9668 },
      Zamfara: { lat: 12.1704, lng: 6.2593 },
    };

    for (let i = 0; i < 50; i++) {
      const state = nigerianStates[Math.floor(Math.random() * nigerianStates.length)];
      const stateCoord = stateCoordinates[state] || { lat: 9.082, lng: 8.6753 }; // Default to Nigeria center
      const totalVotes = Math.floor(Math.random() * 5000) + 500;
      const candidateResults = parties
        .map(party => {
          const votes = Math.floor(Math.random() * totalVotes * 0.4);
          return {
            name: candidates[party as keyof typeof candidates],
            party,
            votes,
            percentage: (votes / totalVotes) * 100,
          };
        })
        .sort((a, b) => b.votes - a.votes);

      results.push({
        id: `PU-${i + 1}`,
        state,
        lga: `${state} LGA ${Math.floor(Math.random() * 20) + 1}`,
        pollingUnit: `Ward ${Math.floor(Math.random() * 10) + 1} PU ${Math.floor(Math.random() * 20) + 1}`,
        totalVotes,
        latitude: stateCoord.lat + (Math.random() - 0.5) * 2, // Add some random offset
        longitude: stateCoord.lng + (Math.random() - 0.5) * 2,
        status: ['verified', 'pending', 'disputed'][Math.floor(Math.random() * 3)] as
          | 'verified'
          | 'pending'
          | 'disputed',
        reportedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        candidates: candidateResults,
      });
    }

    return results;
  };

  const filteredResults =
    selectedState === 'all'
      ? liveResults
      : liveResults.filter(result => result.state === selectedState);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className='h-5 w-5 text-green-500' />;
      case 'pending':
        return <ClockIcon className='h-5 w-5 text-yellow-500' />;
      case 'disputed':
        return <ExclamationTriangleIcon className='h-5 w-5 text-red-500' />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <h1 className='text-2xl font-bold text-primary-600'>eReporter</h1>
              </div>
              <nav className='hidden md:ml-8 md:flex md:space-x-8'>
                <a
                  href='#home'
                  className='text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors'
                >
                  Home
                </a>
                <a
                  href='#live'
                  className='text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors'
                >
                  Live Results
                </a>
                <a
                  href='#about'
                  className='text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors'
                >
                  About
                </a>
                <a
                  href='#contact'
                  className='text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors'
                >
                  Contact
                </a>
              </nav>
            </div>
            <div className='flex items-center space-x-4'>
              <Link
                to='/login'
                className='text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors'
              >
                Login
              </Link>
              <Link
                to='/register'
                className='bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors'
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id='home' className='bg-gradient-to-r from-primary-600 to-primary-800 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
          <div className='text-center'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6'>Real-Time Election Results</h1>
            <p className='text-xl md:text-2xl mb-8 text-primary-100'>
              Transparent, Accurate, and Instant Election Reporting Across Nigeria
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href='#live'
                className='bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium inline-flex items-center'
              >
                <PlayIcon className='h-5 w-5 mr-2' />
                View Live Results
              </a>
              <a
                href='#about'
                className='border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-md text-lg font-medium inline-flex items-center'
              >
                Learn More
                <ArrowRightIcon className='h-5 w-5 ml-2' />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-primary-600'>{stats.states}</div>
              <div className='text-sm text-gray-500 mt-1'>States</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-primary-600'>{stats.lgas}</div>
              <div className='text-sm text-gray-500 mt-1'>LGAs</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-primary-600'>
                {stats.totalPollingUnits.toLocaleString()}
              </div>
              <div className='text-sm text-gray-500 mt-1'>Polling Units</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-green-600'>
                {stats.reportedResults.toLocaleString()}
              </div>
              <div className='text-sm text-gray-500 mt-1'>Results Reported</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600'>
                {stats.verifiedResults.toLocaleString()}
              </div>
              <div className='text-sm text-gray-500 mt-1'>Verified Results</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-purple-600'>
                {stats.totalVotes.toLocaleString()}
              </div>
              <div className='text-sm text-gray-500 mt-1'>Total Votes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Results Section */}
      <section id='live' className='bg-gray-50 py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Live Election Results</h2>
            <p className='text-lg text-gray-600'>
              Real-time updates from polling units across all 36 states and 774 LGAs
            </p>
          </div>

          {/* Filters and View Controls */}
          <div className='flex flex-col lg:flex-row justify-between items-center mb-8 space-y-4 lg:space-y-0'>
            <div className='flex items-center space-x-4'>
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
              >
                <option value='all'>All States</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex items-center space-x-2 bg-white rounded-lg p-1 border'>
              <button
                onClick={() => setActiveView('grid')}
                className={`p-2 rounded-md ${activeView === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Squares2X2Icon className='h-5 w-5' />
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`p-2 rounded-md ${activeView === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <ListBulletIcon className='h-5 w-5' />
              </button>
              <button
                onClick={() => setActiveView('map')}
                className={`p-2 rounded-md ${activeView === 'map' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <MapIcon className='h-5 w-5' />
              </button>
            </div>
          </div>

          {loading ? (
            <div className='text-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto'></div>
              <p className='mt-4 text-gray-600'>Loading live results...</p>
            </div>
          ) : (
            <div>
              {activeView === 'grid' && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredResults.slice(0, 12).map(result => (
                    <div key={result.id} className='bg-white rounded-lg shadow-sm border p-6'>
                      <div className='flex justify-between items-start mb-4'>
                        <div>
                          <h3 className='font-semibold text-gray-900'>{result.pollingUnit}</h3>
                          <p className='text-sm text-gray-600'>
                            {result.lga}, {result.state}
                          </p>
                        </div>
                        <div className='flex items-center space-x-2'>
                          {getStatusIcon(result.status)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}
                          >
                            {result.status}
                          </span>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        {result.candidates.slice(0, 3).map((candidate, index) => (
                          <div key={index} className='flex justify-between items-center'>
                            <div>
                              <span className='font-medium text-sm'>{candidate.party}</span>
                              <span className='text-xs text-gray-500 ml-2'>{candidate.name}</span>
                            </div>
                            <div className='text-right'>
                              <div className='font-semibold'>
                                {candidate.votes.toLocaleString()}
                              </div>
                              <div className='text-xs text-gray-500'>
                                {candidate.percentage.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className='mt-4 pt-4 border-t border-gray-200'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Total Votes:</span>
                          <span className='font-semibold'>
                            {result.totalVotes.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeView === 'list' && (
                <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Polling Unit
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Location
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Leading Candidate
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Total Votes
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {filteredResults.slice(0, 20).map(result => (
                        <tr key={result.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm font-medium text-gray-900'>
                              {result.pollingUnit}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm text-gray-900'>{result.lga}</div>
                            <div className='text-sm text-gray-500'>{result.state}</div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm font-medium text-gray-900'>
                              {result.candidates[0]?.party}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {result.candidates[0]?.votes.toLocaleString()} votes
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {result.totalVotes.toLocaleString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center space-x-2'>
                              {getStatusIcon(result.status)}
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}
                              >
                                {result.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeView === 'map' && (
                <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
                  <div className='p-4 border-b border-gray-200'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='text-lg font-medium text-gray-900 mb-2'>
                          Interactive Map View
                        </h3>
                        <p className='text-gray-600'>
                          Real-time election results across Nigeria's 36 states and 774 LGAs.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowFullscreenMap(true)}
                        className='flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors'
                      >
                        <ArrowsExpandIcon className='h-5 w-5' />
                        <span>Fullscreen</span>
                      </button>
                    </div>
                  </div>
                  <div className='h-96 relative'>
                    <MapContainer
                      center={[9.082, 8.6753]} // Center of Nigeria
                      zoom={6}
                      style={{ height: '100%', width: '100%' }}
                      className='z-0'
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                      />
                      {filteredResults.map(result => {
                        const getMarkerColor = (status: string) => {
                          switch (status) {
                            case 'verified':
                              return '#10b981'; // green
                            case 'pending':
                              return '#f59e0b'; // yellow
                            case 'disputed':
                              return '#ef4444'; // red
                            default:
                              return '#6b7280'; // gray
                          }
                        };

                        return (
                          <CircleMarker
                            key={result.id}
                            center={[result.latitude, result.longitude]}
                            radius={8}
                            fillColor={getMarkerColor(result.status)}
                            color='white'
                            weight={2}
                            opacity={1}
                            fillOpacity={0.8}
                          >
                            <Popup>
                              <div className='p-2 min-w-64'>
                                <h4 className='font-semibold text-gray-900 mb-2'>
                                  {result.pollingUnit}
                                </h4>
                                <p className='text-sm text-gray-600 mb-2'>
                                  {result.lga}, {result.state}
                                </p>
                                <div className='space-y-1 mb-3'>
                                  {result.candidates.slice(0, 3).map((candidate, index) => (
                                    <div key={index} className='flex justify-between text-sm'>
                                      <span className='font-medium'>{candidate.party}</span>
                                      <span>
                                        {candidate.votes.toLocaleString()} (
                                        {candidate.percentage.toFixed(1)}%)
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <div className='flex justify-between items-center pt-2 border-t border-gray-200'>
                                  <span className='text-sm text-gray-600'>Total Votes:</span>
                                  <span className='font-semibold'>
                                    {result.totalVotes.toLocaleString()}
                                  </span>
                                </div>
                                <div className='flex justify-between items-center mt-1'>
                                  <span className='text-sm text-gray-600'>Status:</span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}
                                  >
                                    {result.status}
                                  </span>
                                </div>
                              </div>
                            </Popup>
                          </CircleMarker>
                        );
                      })}
                    </MapContainer>
                  </div>
                  <div className='p-4 bg-gray-50 border-t border-gray-200'>
                    <div className='flex items-center justify-center space-x-6 text-sm'>
                      <div className='flex items-center space-x-2'>
                        <div className='w-3 h-3 rounded-full bg-green-500'></div>
                        <span className='text-gray-700'>Verified</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
                        <span className='text-gray-700'>Pending</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div className='w-3 h-3 rounded-full bg-red-500'></div>
                        <span className='text-gray-700'>Disputed</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id='about' className='bg-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>About eReporter</h2>
            <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
              eReporter is Nigeria's premier election reporting platform, providing transparent,
              accurate, and real-time election results from polling units across all 36 states and
              774 LGAs.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4'>
                <EyeIcon className='h-8 w-8 text-primary-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>Transparency</h3>
              <p className='text-gray-600'>
                Complete transparency in election reporting with real-time updates and verification
                processes.
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4'>
                <ChartBarIcon className='h-8 w-8 text-primary-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>Accuracy</h3>
              <p className='text-gray-600'>
                Rigorous verification processes ensure the highest level of accuracy in reported
                results.
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4'>
                <UserGroupIcon className='h-8 w-8 text-primary-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>Accessibility</h3>
              <p className='text-gray-600'>
                Easy access for all citizens to view election results in multiple formats and
                layouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id='contact' className='bg-gray-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div>
              <h3 className='text-lg font-semibold mb-4'>eReporter</h3>
              <p className='text-gray-400'>
                Transparent, accurate, and real-time election reporting for Nigeria.
              </p>
            </div>
            <div>
              <h4 className='text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4'>
                Quick Links
              </h4>
              <ul className='space-y-2'>
                <li>
                  <a href='#home' className='text-gray-400 hover:text-white'>
                    Home
                  </a>
                </li>
                <li>
                  <a href='#live' className='text-gray-400 hover:text-white'>
                    Live Results
                  </a>
                </li>
                <li>
                  <a href='#about' className='text-gray-400 hover:text-white'>
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4'>
                Support
              </h4>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-400 hover:text-white'>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-400 hover:text-white'>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-400 hover:text-white'>
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4'>
                Contact
              </h4>
              <p className='text-gray-400 text-sm'>
                Email: info@ereporter.ng
                <br />
                Phone: +234 800 123 4567
              </p>
            </div>
          </div>
          <div className='border-t border-gray-800 mt-8 pt-8 text-center'>
            <p className='text-gray-400 text-sm'>© 2024 eReporter. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Fullscreen Map Modal */}
      <FullscreenMapModal
        isOpen={showFullscreenMap}
        onClose={() => setShowFullscreenMap(false)}
        results={filteredResults.map(result => ({
          id: result.id,
          pollingUnit: result.pollingUnit,
          location: `${result.lga}, ${result.state}`,
          leadingCandidate: result.candidates[0]?.name || 'N/A',
          totalVotes: result.totalVotes,
          status: result.status,
          timestamp: result.reportedAt,
          latitude: result.latitude,
          longitude: result.longitude,
        }))}
      />
    </div>
  );
};

export default Landing;
