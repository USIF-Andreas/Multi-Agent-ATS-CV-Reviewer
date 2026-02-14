<div align="center">

# 🤖 Multi-Agent ATS Resume Analyzer

**A production-ready multi-agent system that analyzes, scores, and provides actionable feedback on resumes against job descriptions — powered by 8 specialized AI agents.**

[![Python 3.9+](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![spaCy](https://img.shields.io/badge/spaCy-09A3D5?logo=spacy&logoColor=white)](https://spacy.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📌 Overview

Traditional ATS systems rely on simple keyword matching and miss qualified candidates who use different terminology. This project solves that by orchestrating **8 specialized agents** — each handling a distinct part of the screening pipeline — from CV parsing and semantic analysis to bias detection and feedback generation.

The result: a comprehensive, fair, and explainable resume analysis report with an overall ATS score, semantic match insights, formatting checks, compliance flags, and actionable improvement suggestions.

---

## ✨ Key Features

- **Multi-Agent Architecture** — 8 purpose-built agents collaborate through a structured pipeline
- **Semantic Matching** — Goes beyond keywords using sentence embeddings (`all-MiniLM-L6-v2`) to catch synonym matches
- **ATS Scoring** — Weighted scoring across skills, experience, and title similarity
- **Format Validation** — Detects tables, columns, images, and icons that break ATS parsers
- **Bias & Compliance** — Flags age, gender, and nationality indicators for ethical screening
- **Actionable Feedback** — Generates rewritten bullet points and prioritized improvement checklists
- **Visual Layout Analysis** — Uses `pdfplumber` to analyze spatial positioning of resume sections
- **REST API** — Production-ready FastAPI endpoint with ngrok tunneling for deployment
- **Web Interface** — React-based frontend for uploading resumes and viewing results

---

## 🏗️ Architecture

```
CV (PDF/DOCX) ──────┐
                     │
                     ├──► [1] CV Parsing Agent
                     │         │
Job Description ─────┤         │
                     │         ├──► [2] JD Understanding Agent
                     │         │           │
                     └─────────┴───────────┤
                                           │
                        ┌──────────────────┴──────────────────┐
                        │                                      │
                  [3] ATS Scoring              [4] Semantic Similarity
                        │                                      │
                        │                                      │
                  [5] Format Validator          [6] Bias Checker
                        │                                      │
                        └──────────────────┬──────────────────┘
                                           │
                                  [7] Feedback Agent
                                           │
                                  [8] Orchestrator
                                           │
                                    Final Report
```

### Agent Breakdown

| # | Agent | Type | Responsibility |
|:-:|-------|------|----------------|
| 1 | **CV Parsing Agent** | Extractor (Tool-augmented) | Extracts structured data (skills, experience, education) from PDF/DOCX/TXT resumes |
| 2 | **JD Understanding Agent** | Semantic Analyst | Analyzes job postings to extract must-have / nice-to-have skills using NLP + knowledge base |
| 3 | **ATS Scoring Agent** | Rule-Based Evaluator | Simulates traditional ATS keyword scoring with weighted sub-scores |
| 4 | **Semantic Similarity Agent** | Semantic Reasoning | Uses sentence embeddings to find synonym & contextual matches beyond keywords |
| 5 | **Formatting Validator Agent** | Validator / Inspector | Checks for ATS-unfriendly formatting (tables, columns, images, icons) |
| 6 | **Bias & Compliance Agent** | Policy / Safety | Flags age, gender, and nationality info to ensure ethical screening |
| 7 | **Feedback & Rewrite Agent** | Generative Coach | Provides actionable bullet-point suggestions and rewrites for missing skills |
| 8 | **Orchestrator Agent** | Manager | Coordinates all agents, resolves conflicts, and produces the final report |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **NLP** | spaCy (`en_core_web_sm`) — tokenization, NER, POS tagging |
| **Embeddings** | Sentence-Transformers (`all-MiniLM-L6-v2`) — 384-dim semantic vectors |
| **PDF Parsing** | PyPDF2 + pdfplumber — text extraction and visual layout analysis |
| **DOCX Parsing** | python-docx |
| **API** | FastAPI + Uvicorn |
| **Tunneling** | pyngrok (for public URL deployment) |
| **Frontend** | React 18 + Tailwind CSS |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- pip

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/USIF-Andreas/Multi-Agent-ATS-CV-Reviewer.git
   cd Multi-Agent-ATS-CV-Reviewer
   ```

2. **Install dependencies**

   ```bash
   pip install PyPDF2 python-docx spacy sentence-transformers pdfplumber fastapi uvicorn pyngrok
   python -m spacy download en_core_web_sm
   ```

3. **Run the notebook**

   Open `multi-agents.ipynb` in Jupyter Notebook or VS Code and execute the cells sequentially.

4. **Launch the API** *(optional)*

   The notebook includes a FastAPI server cell that starts an API endpoint with ngrok. Configure your `NGROK_TOKEN` and run the deployment cells.

5. **Open the web interface** *(optional)*

   Open `ats-interface.html` in a browser and point it at the running API URL.

---

## 📂 Project Structure

```
Multi-Agent-ATS-CV-Reviewer/
├── multi-agents.ipynb     # Main notebook — all 8 agents + API server
├── ats-interface.html     # Standalone HTML/React frontend
├── ats-interface.jsx      # JSX source for the frontend component
├── App.js                 # React app entry point
├── index.html             # HTML entry point
├── index.js               # JS entry point
├── package.json           # Node.js dependencies (lucide-react)
└── README.md              # This file
```

---

## 📊 Sample Output

The system produces a `FinalReport` containing:

| Field | Description |
|-------|-------------|
| **Decision** | `PASS` / `BORDERLINE` / `REJECT` |
| **Overall Score** | Weighted ATS score (0–100) |
| **Skill Match Score** | Percentage of must-have skills matched |
| **Missing Skills** | Critical skills not found in the CV |
| **Semantic Similarity** | Cosine similarity between CV and JD embeddings |
| **Format Issues** | ATS compatibility problems detected |
| **Bias Flags** | Compliance issues (age, gender, nationality) |
| **Improvement Checklist** | Prioritized, actionable suggestions |

---

## 🗺️ Roadmap

- [ ] LLM integration (Claude / GPT) for richer feedback generation
- [ ] Database storage for tracking candidate improvements over time
- [ ] Batch processing for bulk resume screening
- [ ] Industry-specific scoring models (Tech, Finance, Healthcare)
- [ ] Multi-language resume support
- [ ] Authentication & rate limiting for the API
- [ ] CI/CD pipeline and comprehensive test suite

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change, then submit a pull request.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Andreas](https://github.com/USIF-Andreas)**

</div>