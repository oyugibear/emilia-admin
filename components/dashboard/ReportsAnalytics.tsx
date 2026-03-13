'use client'

import React from 'react'
import { FaChartLine, FaDownload, FaCalendarAlt, FaDollarSign } from 'react-icons/fa'
import { MdReport, MdTrendingUp, MdTrendingDown } from 'react-icons/md'

// Sample data - in real app this would come from API/props
const reportData = {
  occupancyRate: 78,
  revenue: 15420,
  avgStayLength: 3.2,
  customerSatisfaction: 4.6,
  monthlyRevenue: [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 13200 },
    { month: 'Mar', revenue: 14800 },
    { month: 'Apr', revenue: 13900 },
    { month: 'May', revenue: 15100 },
    { month: 'Jun', revenue: 16300 },
    { month: 'Jul', revenue: 17200 },
    { month: 'Aug', revenue: 16800 },
    { month: 'Sep', revenue: 15900 },
    { month: 'Oct', revenue: 14600 },
    { month: 'Nov', revenue: 15420 }
  ],
  topRooms: [
    { room: '2B01', bookings: 28, revenue: 5040 },
    { room: 'S001', bookings: 32, revenue: 2720 },
    { room: '1B02', bookings: 25, revenue: 3000 },
    { room: '2B02', bookings: 24, revenue: 4320 },
    { room: 'S003', bookings: 30, revenue: 2550 }
  ],
  recentReports: [
    { id: 'RPT001', name: 'Monthly Revenue Report', date: '2025-11-01', status: 'completed', type: 'Financial' },
    { id: 'RPT002', name: 'Occupancy Analysis', date: '2025-10-28', status: 'completed', type: 'Occupancy' },
    { id: 'RPT003', name: 'Maintenance Cost Report', date: '2025-10-25', status: 'completed', type: 'Maintenance' },
    { id: 'RPT004', name: 'Guest Satisfaction Survey', date: '2025-10-20', status: 'in-progress', type: 'Customer' },
    { id: 'RPT005', name: 'Inventory Turnover Report', date: '2025-10-15', status: 'completed', type: 'Inventory' }
  ]
}

export default function ReportsAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Track performance and generate insights</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#1D4E56] text-white px-4 py-2 rounded-md hover:bg-[#2a6670] transition-colors flex items-center gap-2">
            <MdReport className="text-lg" />
            Generate Report
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2">
            <FaDownload />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-3xl font-bold text-blue-600">{reportData.occupancyRate}%</p>
            </div>
            <FaChartLine className="text-blue-500 text-2xl" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MdTrendingUp className="text-green-500" />
            <span className="text-green-600 font-medium">+5.2%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-green-600">${reportData.revenue.toLocaleString()}</p>
            </div>
            <FaDollarSign className="text-green-500 text-2xl" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MdTrendingUp className="text-green-500" />
            <span className="text-green-600 font-medium">+8.1%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Stay Length</p>
              <p className="text-3xl font-bold text-purple-600">{reportData.avgStayLength} days</p>
            </div>
            <FaCalendarAlt className="text-purple-500 text-2xl" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MdTrendingDown className="text-red-500" />
            <span className="text-red-600 font-medium">-0.3 days</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfaction</p>
              <p className="text-3xl font-bold text-yellow-600">{reportData.customerSatisfaction}/5.0</p>
            </div>
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MdTrendingUp className="text-green-500" />
            <span className="text-green-600 font-medium">+0.2</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FaChartLine className="text-4xl text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Revenue chart would be displayed here</p>
            <p className="text-sm text-gray-500">Integrate with charting library (Chart.js, Recharts, etc.)</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-4">
          {reportData.monthlyRevenue.slice(-6).map((item, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-gray-500">{item.month}</p>
              <p className="font-semibold text-gray-900">${item.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Rooms */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Rooms</h3>
          <div className="space-y-4">
            {reportData.topRooms.map((room, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1D4E56] text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Room {room.room}</p>
                    <p className="text-sm text-gray-600">{room.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${room.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            <button className="text-sm text-[#1D4E56] hover:text-[#2a6670] font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {reportData.recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-600">{report.date}</p>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{report.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {report.status === 'completed' ? 'Ready' : 'Processing'}
                  </span>
                  {report.status === 'completed' && (
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaDownload className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Report Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Report Generation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FaDollarSign className="text-green-500 text-xl mb-2" />
            <p className="font-medium text-gray-900">Revenue Report</p>
            <p className="text-sm text-gray-600">Financial performance</p>
          </button>
          
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FaChartLine className="text-blue-500 text-xl mb-2" />
            <p className="font-medium text-gray-900">Occupancy Report</p>
            <p className="text-sm text-gray-600">Room utilization</p>
          </button>
          
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <MdReport className="text-purple-500 text-xl mb-2" />
            <p className="font-medium text-gray-900">Maintenance Report</p>
            <p className="text-sm text-gray-600">Service requests</p>
          </button>
          
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FaCalendarAlt className="text-orange-500 text-xl mb-2" />
            <p className="font-medium text-gray-900">Booking Report</p>
            <p className="text-sm text-gray-600">Reservation trends</p>
          </button>
        </div>
      </div>
    </div>
  )
}
