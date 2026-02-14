import React, { useState } from 'react';
import { Upload, FileText, Zap, CheckCircle, AlertCircle, XCircle, Settings, TrendingUp } from 'lucide-react';

const ATSInterface = () => {
  const [apiUrl, setApiUrl] = useState('https://abhorrently-threadless-reina.ngrok-free.dev');
  const [apiKey, setApiKey] = useState('secret123');
  const [jobDescription, setJobDescription] = useState('');
  const [cvText, setCvText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'file'
  const [showConfig, setShowConfig] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['.pdf', '.docx', '.txt'];
      const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      if (validTypes.includes(ext)) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a PDF, DOCX, or TXT file');
        setFile(null);
      }
    }
  };

  const analyzeText = async () => {
    if (!jobDescription || !cvText) {
      setError('Please provide both job description and CV text');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          job_description: jobDescription,
          cv_text: cvText
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeFile = async () => {
    if (!jobDescription || !file) {
      setError('Please provide both job description and CV file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('job_description', jobDescription);
      formData.append('cv_file', file);

      const response = await fetch(`${apiUrl}/api/analyze-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDecisionIcon = (decision) => {
    switch(decision?.toLowerCase()) {
      case 'pass':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'borderline':
        return <AlertCircle className="w-8 h-8 text-yellow-500" />;
      case 'reject':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">ATS Multi-Agent System</h1>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Config</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Configuration Panel */}
        {showConfig && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API URL</label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://your-ngrok-url.ngrok-free.dev"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="secret123"
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              Input Details
            </h2>

            {/* Job Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-40"
                placeholder="Paste the job description here..."
              />
            </div>

            {/* Tab Selection */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  activeTab === 'text'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Text Input
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  activeTab === 'file'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                File Upload
              </button>
            </div>

            {/* CV Input */}
            {activeTab === 'text' ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV/Resume Text *
                </label>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-64"
                  placeholder="Paste the CV/resume text here..."
                />
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV/Resume File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Click to upload
                  </label>
                  <p className="text-gray-500 text-sm mt-2">PDF, DOCX, or TXT (max 10MB)</p>
                  {file && (
                    <p className="mt-4 text-sm text-green-600 font-medium">
                      ✓ {file.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={activeTab === 'text' ? analyzeText : analyzeFile}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              Analysis Results
            </h2>

            {!result ? (
              <div className="text-center py-16 text-gray-400">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Results will appear here after analysis</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Decision Card */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getDecisionIcon(result.decision)}
                      <div>
                        <h3 className="text-2xl font-bold capitalize">{result.decision}</h3>
                        <p className="text-gray-600">Overall Decision</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-4xl font-bold ${getScoreColor(result.overall_score)}`}>
                        {result.overall_score}
                      </div>
                      <p className="text-gray-600">Score</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{result.summary}</p>
                </div>

                {/* Score Breakdown */}
                <div>
                  <h3 className="font-semibold mb-3">Score Breakdown</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Skill Match</span>
                        <span className="text-sm font-medium">{result.ats_score.skill_match_score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${result.ats_score.skill_match_score}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Experience</span>
                        <span className="text-sm font-medium">{result.ats_score.experience_score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${result.ats_score.experience_score}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Title Similarity</span>
                        <span className="text-sm font-medium">{result.ats_score.title_similarity_score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${result.ats_score.title_similarity_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matched Skills */}
                {result.ats_score.matched_skills && result.ats_score.matched_skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-green-700">✓ Matched Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.ats_score.matched_skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {result.ats_score.missing_must_have && result.ats_score.missing_must_have.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-red-700">✗ Missing Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.ats_score.missing_must_have.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Checklist */}
                <div>
                  <h3 className="font-semibold mb-3">Improvement Checklist</h3>
                  <div className="space-y-2">
                    {result.improvement_checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-indigo-600 mt-0.5">•</span>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSInterface;
