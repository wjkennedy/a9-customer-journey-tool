# Customer Journey Mapping & Process Mining Tool

*A9 Consulting Group - Atlassian System of Work Integration*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/wjkennedys-projects/v0-customer-journey-tool)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/um8DRjUDKok)

## Overview

The Customer Journey Mapping Tool brings **process mining** capabilities directly into Atlassian team workflows, enabling organizations to systematically discover, visualize, and optimize customer journeys while identifying opportunities for **agentic AI integration**.

### Purpose

This tool addresses a critical gap for Atlassian teams navigating the AI transformation: **How do we understand where agentic AI can fit in, complement, or offload work?**

By incorporating process mining methodologies into workflow design, teams can:
- **Map current-state journeys** with complete visibility into touchpoints, handoffs, and decision points
- **Identify automation opportunities** through systematic bottleneck and inefficiency analysis
- **Discover AI agent potential** by analyzing repetitive tasks, decision patterns, and data-heavy processes
- **Design future-state workflows** that leverage agentic AI to augment human capabilities
- **Export deterministic models** (JSON, DAG) for integration with Atlassian Rovo and System of Work

## Key Features

### Process Mining & Journey Mapping
- **Interactive DAG Visualization**: Build customer journeys using directed acyclic graphs (ReactFlow)
- **Comprehensive Node Types**: Touchpoints, decisions, handoffs, processes, and endpoints
- **Actor & Criteria Tracking**: Document who does what, when, and under what conditions
- **Transition Analysis**: Map dependencies, handoffs, and workflow state changes

### AI & Automation Intelligence
- **Automation Opportunity Detection**: Automatically identifies repetitive tasks, manual processes, and bottlenecks
- **AI Agent Potential Scoring**: Analyzes nodes for suitability as AI-assisted or AI-autonomous tasks
- **Workflow Optimization**: Highlights inefficiencies, long cycle times, and process improvements
- **Risk Assessment**: Flags high-risk transitions and decision points requiring human oversight

### Integration & Export
- **JSON Export**: Complete journey data model for integration with external systems
- **Graphviz DAG Export**: Standard directed graph format for process mining tools
- **Atlassian Rovo Alignment**: Designed to complement Atlassian's System of Work methodology
- **Deterministic Models**: Reproducible, version-controlled journey definitions

## Use Cases for Atlassian Teams

### 1. Understanding AI Readiness
Map existing workflows to identify where AI agents can add value:
- Which customer touchpoints involve repetitive data entry?
- Where do decision trees rely on pattern matching AI could handle?
- What handoffs between teams could be automated with intelligent routing?

### 2. Designing AI-Augmented Workflows
Create future-state journeys that blend human expertise with AI capabilities:
- AI agents handling tier-1 support while escalating complex issues
- Automated data gathering with human review and decision-making
- Intelligent process orchestration with human checkpoints

### 3. Process Mining for Optimization
Discover hidden inefficiencies in current customer journeys:
- Bottleneck identification through cycle time analysis
- Handoff optimization by reducing unnecessary transitions
- Decision point streamlining through criteria analysis

### 4. Compliance & Documentation
Maintain clear, auditable journey maps for:
- Regulatory compliance requirements
- Team onboarding and training
- Process standardization across departments
- Change management and version control

## Technology Stack

- **Next.js 16** - React framework with App Router
- **ReactFlow** - DAG visualization and interactive canvas
- **Zustand** - Lightweight state management
- **TypeScript** - Type-safe data models
- **Atlassian Design System** - UI components and styling standards

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/a9-customer-journey-tool.git

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to start mapping journeys.

### Creating Your First Journey

1. **Add Nodes**: Click toolbar buttons to add touchpoints, decisions, processes, or handoffs
2. **Connect Flows**: Drag from node handles to create transitions
3. **Define Properties**: Select nodes to edit labels, actors, criteria, and metadata
4. **Analyze**: Review the Analysis panel for automation opportunities and AI potential
5. **Export**: Download as JSON or Graphviz DOG for external processing

## Data Model

### Journey Node Types
- **Touchpoint**: Customer interaction points (web, phone, email, in-person)
- **Decision**: Choice points requiring criteria evaluation
- **Handoff**: Transitions between actors, teams, or systems
- **Process**: Internal workflows or system operations
- **Start/End**: Journey entry and exit points

### Node Properties
- **Label**: Descriptive name
- **Actor**: Person, team, or system responsible
- **Criteria**: Conditions triggering transitions
- **Metadata**: Duration, cost, risk level, automation score

### Edge Properties
- **Transition Type**: Sequential, conditional, or parallel
- **Conditions**: Rules governing flow
- **SLA**: Expected completion time

## Atlassian Integration

This tool is designed to complement:
- **Atlassian Rovo**: AI-powered workflow intelligence
- **Jira**: Task and project management integration
- **Confluence**: Journey documentation and collaboration
- **Compass**: Service catalog and dependency mapping

Export journey maps as JSON or DAG and import into Atlassian tools for end-to-end workflow orchestration.

## Roadmap

- [ ] Real-time collaboration for multi-user journey mapping
- [ ] Atlassian Rovo API integration
- [ ] Advanced process mining algorithms (conformance checking, variant analysis)
- [ ] AI agent simulation and testing
- [ ] BPMN 2.0 export format
- [ ] Role-based access control and journey versioning

## About A9 Consulting Group

A9 Consulting Group specializes in AI transformation and workflow optimization for enterprise teams. We help organizations navigate the shift to agentic AI by combining proven process mining methodologies with cutting-edge AI capabilities.

## Deployment

Your project is live at:

**[https://vercel.com/wjkennedys-projects/v0-customer-journey-tool](https://vercel.com/wjkennedys-projects/v0-customer-journey-tool)**

## Continue Development

Build and modify your app on:

**[https://v0.app/chat/um8DRjUDKok](https://v0.app/chat/um8DRjUDKok)**

## License

Copyright © 2026 A9 Consulting Group. All rights reserved.
