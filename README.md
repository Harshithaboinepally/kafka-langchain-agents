Kafka Microservices & Multi-Agent Coordination System

This repository contains two connected works that explore distributed systems and AI agent orchestration using Apache Kafka and LangChain. Both projects demonstrate how event-driven architectures enable modular, scalable, and intelligent communication between components or agents — a foundation for modern AI and microservice ecosystems.

##Kafka-Based User Management Microservice (CRUD over RPC)

Objective:
Extend a Kafka RPC demo to implement a User Management Microservice that performs full CRUD operations — Create, Retrieve, Update, Delete, and List — via Kafka message queues instead of HTTP APIs.

Highlights:
Built using Node.js with Kafka Producers and Consumers.
Users are stored in-memory, and each operation is handled asynchronously.
Validates data (e.g., email format, age constraints) and returns structured JSON responses.
Demonstrates Kafka RPC-style communication, showing how backend services can communicate through topics rather than direct REST calls.

Relevance:
This mirrors how microservices in cloud and enterprise systems (e.g., Netflix, Uber, LinkedIn) use Kafka for asynchronous, decoupled service orchestration — ensuring scalability, reliability, and resilience.

# Kafka + LangChain Multi-Agent System

Objective:
Build a three-agent AI system (Planner, Writer, Reviewer) that coordinates entirely via Kafka topics, demonstrating how LLM-powered agents can communicate asynchronously in an event-driven pipeline.

Workflow:
User → inbox → tasks → drafts → final
        Planner → Writer → Reviewer


Agent Roles:
 Planner: Reads user questions and generates a plan (topic: tasks).
 Writer: Consumes plans, writes short answers using LangChain + Ollama (topic: drafts).
 Reviewer: Reviews drafts, approves or rejects results (topic: final).

Relevance:
This project connects directly to current trends in AI orchestration and multi-agent frameworks like LangGraph, AutoGen, and CrewAI — where Kafka serves as the backbone for asynchronous agent communication, mimicking production-grade AI microservice pipelines used in RAG systems and AI automation frameworks.

Tech Stack:
Apache Kafka (Dockerized) — Message brokering & topic management
Node.js — Kafka RPC microservice backend
Python + LangChain + Ollama — Intelligent agent creation and LLM integration
Docker Compose — Containerized Kafka environment

Key Takeaways:
-Showcases asynchronous microservice design using Kafka instead of REST APIs.
-Demonstrates AI agent communication pipelines with Kafka event streaming.
-Integrates LangChain with local LLMs (Ollama) for offline reasoning.
-Provides a foundation for scalable, distributed AI workflows.
