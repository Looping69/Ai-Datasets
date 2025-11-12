import React from 'react';
import { BrainIcon } from './icons/BrainIcon';
import { SearchIcon } from './icons/SearchIcon';
import { DataSourceIcon } from './icons/DataSourceIcon';
import { RefineIcon } from './icons/RefineIcon';
import { CrawlIcon } from './icons/CrawlIcon';

export interface AgentActivity {
  agent: 'discovery' | 'validation' | 'analysis' | 'strategy' | 'refinement';
  status: 'idle' | 'working' | 'success' | 'error';
  message: string;
  timestamp: number;
  details?: {
    url?: string;
    progress?: number;
    total?: number;
    duration?: number;
  };
}

interface AgentMonitorProps {
  activities: AgentActivity[];
  isActive: boolean;
}

const AgentMonitor: React.FC<AgentMonitorProps> = ({ activities, isActive }) => {
  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'discovery':
        return <SearchIcon className="w-5 h-5" />;
      case 'validation':
        return <CrawlIcon className="w-5 h-5" />;
      case 'analysis':
        return <DataSourceIcon className="w-5 h-5" />;
      case 'strategy':
        return <BrainIcon className="w-5 h-5" />;
      case 'refinement':
        return <RefineIcon className="w-5 h-5" />;
      default:
        return <BrainIcon className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getAgentName = (agent?: string) => {
    if (!agent || typeof agent !== 'string') {
      return 'Unknown Agent';
    }
    return agent.charAt(0).toUpperCase() + agent.slice(1) + ' Agent';
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const recentActivities = activities.slice(-10).reverse();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainIcon className="w-5 h-5 text-white" />
          <h3 className="text-white font-semibold">Agent Activity Monitor</h3>
        </div>
        {isActive && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Active</span>
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {recentActivities.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <BrainIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No agent activity yet</p>
            <p className="text-sm mt-1">Start a search to see agents in action</p>
          </div>
        ) : (
          recentActivities.map((activity, index) => (
            <div 
              key={`${activity.timestamp}-${index}`}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                activity.status === 'working' ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'working' ? 'bg-blue-100 text-blue-600' :
                  activity.status === 'success' ? 'bg-green-100 text-green-600' :
                  activity.status === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {getAgentIcon(activity.agent)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {getAgentName(activity.agent)}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{activity.message}</p>

                  {activity.details && (
                    <div className="space-y-1">
                      {activity.details.url && (
                        <div className="text-xs text-gray-500 truncate">
                          <span className="font-medium">URL:</span> {activity.details.url}
                        </div>
                      )}
                      
                      {activity.details.progress !== undefined && activity.details.total && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Progress</span>
                            <span>{activity.details.progress}/{activity.details.total}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all ${getStatusColor(activity.status)}`}
                              style={{ 
                                width: `${(activity.details.progress / activity.details.total) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {activity.details.duration && (
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Duration:</span> {activity.details.duration}ms
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'working' ? 'bg-blue-100 text-blue-700' :
                      activity.status === 'success' ? 'bg-green-100 text-green-700' :
                      activity.status === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(activity.status)} ${
                        activity.status === 'working' ? 'animate-pulse' : ''
                      }`}></div>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgentMonitor;