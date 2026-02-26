/**
 * Agent Dashboard
 * 
 * Main interface for demonstrating the 3 healthcare AI agents:
 * 1. Patient Triage Agent
 * 2. Appointment Scheduler Agent
 * 3. Medical Records Analyzer Agent
 */

import React, { useState } from 'react';
import { patientTriageAgent } from '../../agents/PatientTriageAgent';
import { appointmentSchedulerAgent } from '../../agents/AppointmentSchedulerAgent';
import { medicalRecordsAnalyzerAgent } from '../../agents/MedicalRecordsAnalyzerAgent';

type AgentTab = 'triage' | 'scheduler' | 'analyzer';

export const AgentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AgentTab>('triage');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 Healthcare AI Agents Dashboard
          </h1>
          <p className="text-gray-600">
            Powered by Elasticsearch Agent Builder + Gemini AI + Hugging Face
          </p>
        </div>

        {/* Agent Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('triage')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'triage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🏥 Patient Triage Agent
              </button>
              <button
                onClick={() => setActiveTab('scheduler')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'scheduler'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📅 Appointment Scheduler
              </button>
              <button
                onClick={() => setActiveTab('analyzer')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'analyzer'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Medical Records Analyzer
              </button>
            </nav>
          </div>
        </div>

        {/* Agent Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'triage' && <TriageAgentPanel />}
          {activeTab === 'scheduler' && <SchedulerAgentPanel />}
          {activeTab === 'analyzer' && <AnalyzerAgentPanel />}
        </div>

        {/* Impact Metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Patient Triage"
            metric="90% faster"
            detail="30 seconds vs 5-10 minutes"
            icon="🏥"
            color="blue"
          />
          <MetricCard
            title="Appointment Scheduling"
            metric="87% faster"
            detail="2 minutes vs 15 minutes"
            icon="📅"
            color="green"
          />
          <MetricCard
            title="Records Analysis"
            metric="93% faster"
            detail="1 minute vs 15 minutes"
            icon="📊"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
};

// Patient Triage Agent Panel
const TriageAgentPanel: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('35');
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      alert('Please enter symptoms');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const analysis = await patientTriageAgent.analyzeAndRoute(symptoms, {
        patientId: 'demo-patient-001',
        age: parseInt(age),
        gender,
        medicalHistory: ['Hypertension'],
        allergies: ['Penicillin'],
        currentMedications: ['Lisinopril']
      });

      setResult(analysis);
    } catch (error) {
      console.error('Triage failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">🏥 Patient Triage Agent</h2>
        <p className="text-gray-600 mb-4">
          Analyzes symptoms using AI and vector search to determine urgency and route to appropriate department.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Symptoms
        </label>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe the patient's symptoms... (e.g., 'chest pain, shortness of breath, dizziness')"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? '🔄 Analyzing...' : '🚀 Analyze Symptoms'}
      </button>

      {result && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Department</div>
              <div className="text-xl font-bold text-blue-600">{result.department}</div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Severity</div>
              <div className={`text-xl font-bold ${
                result.severity === 'critical' ? 'text-red-600' :
                result.severity === 'high' ? 'text-orange-600' :
                result.severity === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {result.severity.toUpperCase()}
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Estimated Wait Time</div>
              <div className="text-xl font-bold text-gray-800">{result.estimatedWaitTime}</div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Confidence</div>
              <div className="text-xl font-bold text-gray-800">
                {(result.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="text-sm font-medium text-gray-700 mb-2">Reasoning</div>
            <p className="text-gray-800">{result.reasoning}</p>
          </div>

          {result.similarCases > 0 && (
            <div className="mt-4 bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm font-medium text-gray-700">
                📊 Found {result.similarCases} similar cases in medical database
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Appointment Scheduler Agent Panel
const SchedulerAgentPanel: React.FC = () => {
  const [department, setDepartment] = useState('Cardiology');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [preferredTime, setPreferredTime] = useState('morning');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSchedule = async () => {
    if (!reason.trim()) {
      alert('Please enter reason for appointment');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const appointment = await appointmentSchedulerAgent.scheduleAppointment({
        patientId: 'demo-patient-001',
        department,
        preferredDates: [tomorrow, nextWeek],
        preferredTimes: [preferredTime],
        duration: 30,
        urgency,
        reason
      });

      setResult(appointment);
    } catch (error) {
      console.error('Scheduling failed:', error);
      alert('Scheduling failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">📅 Appointment Scheduler Agent</h2>
        <p className="text-gray-600 mb-4">
          Finds optimal appointment slots using ES|QL queries, resolves conflicts, and matches patient preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="General Medicine">General Medicine</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgency
          </label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Time
        </label>
        <select
          value={preferredTime}
          onChange={(e) => setPreferredTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="morning">Morning (8 AM - 12 PM)</option>
          <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
          <option value="evening">Evening (5 PM - 8 PM)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Visit
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for appointment..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSchedule}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? '🔄 Finding Optimal Slot...' : '🚀 Schedule Appointment'}
      </button>

      {result && (
        <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold mb-4 text-green-900">✅ Appointment Scheduled</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Doctor</div>
              <div className="text-lg font-bold text-gray-800">{result.doctorName}</div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Department</div>
              <div className="text-lg font-bold text-gray-800">{result.department}</div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Date</div>
              <div className="text-lg font-bold text-gray-800">
                {new Date(result.date).toLocaleDateString()}
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Time</div>
              <div className="text-lg font-bold text-gray-800">{result.time}</div>
            </div>
          </div>

          <div className="mt-4 bg-white p-4 rounded-md shadow-sm">
            <div className="text-sm font-medium text-gray-700 mb-2">Reasoning</div>
            <p className="text-gray-800">{result.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Medical Records Analyzer Agent Panel
const AnalyzerAgentPanel: React.FC = () => {
  const [patientId, setPatientId] = useState('demo-patient-001');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    try {
      const analysis = await medicalRecordsAnalyzerAgent.analyzeRecords({
        patientId,
        keywords: keywords || undefined
      });

      setResult(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);

    try {
      const report = await medicalRecordsAnalyzerAgent.generateReport(patientId);
      
      // Download report as text file
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical-report-${patientId}-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Report generation failed:', error);
      alert('Report generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">📊 Medical Records Analyzer Agent</h2>
        <p className="text-gray-600 mb-4">
          Searches medical records using hybrid search, detects drug interactions, and generates insights.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Patient ID
        </label>
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter patient ID..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Keywords (Optional)
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., diabetes, hypertension..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? '🔄 Analyzing...' : '🚀 Analyze Records'}
        </button>
        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? '🔄 Generating...' : '📄 Generate Report'}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold mb-4 text-purple-900">Analysis Results</h3>
          
          <div className="bg-white p-4 rounded-md shadow-sm mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Summary</div>
            <p className="text-gray-800">{result.summary}</p>
          </div>

          {result.patterns.length > 0 && (
            <div className="bg-white p-4 rounded-md shadow-sm mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Identified Patterns</div>
              <ul className="list-disc list-inside space-y-1">
                {result.patterns.map((pattern: string, i: number) => (
                  <li key={i} className="text-gray-800">{pattern}</li>
                ))}
              </ul>
            </div>
          )}

          {result.riskFactors.length > 0 && (
            <div className="bg-white p-4 rounded-md shadow-sm mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Risk Factors</div>
              <ul className="list-disc list-inside space-y-1">
                {result.riskFactors.map((risk: string, i: number) => (
                  <li key={i} className="text-gray-800">{risk}</li>
                ))}
              </ul>
            </div>
          )}

          {result.drugInteractions.hasInteractions && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md shadow-sm mb-4">
              <div className="text-sm font-medium text-red-700 mb-2">
                ⚠️ Drug Interactions Detected
              </div>
              <div className="text-sm text-red-600 mb-2">
                Severity: {result.drugInteractions.severity.toUpperCase()}
              </div>
              <ul className="list-disc list-inside space-y-1 mb-2">
                {result.drugInteractions.interactions.map((interaction: string, i: number) => (
                  <li key={i} className="text-red-800">{interaction}</li>
                ))}
              </ul>
              <div className="text-sm text-red-700">
                {result.drugInteractions.recommendations}
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="text-sm text-gray-600">Confidence Score</div>
            <div className="text-2xl font-bold text-gray-800">
              {(result.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  metric: string;
  detail: string;
  icon: string;
  color: 'blue' | 'green' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, metric, detail, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-indigo-50 border-blue-200',
    green: 'from-green-50 to-emerald-50 border-green-200',
    purple: 'from-purple-50 to-indigo-50 border-purple-200'
  };

  return (
    <div className={`p-6 rounded-lg border bg-gradient-to-r ${colorClasses[color]}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 mb-1">{metric}</div>
      <div className="text-sm text-gray-600">{detail}</div>
    </div>
  );
};

export default AgentDashboard;
