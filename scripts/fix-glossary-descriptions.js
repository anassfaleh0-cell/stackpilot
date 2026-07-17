const fs = require('fs');
const path = require('path');

const dir = path.resolve('content/glossary');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const descriptions = {
  'ab-testing': 'A/B testing is a method of comparing two versions of a webpage or app to determine which performs better. Learn how split testing improves conversion rates and user engagement.',
  'agile': 'Agile is a project management methodology focused on iterative development, collaboration, and rapid response to change. Learn how Agile frameworks improve software delivery.',
  'api': 'An API (Application Programming Interface) enables software applications to communicate and share data. Learn how APIs power modern SaaS integrations and workflows.',
  'ats': 'An Applicant Tracking System (ATS) helps organizations manage recruitment workflows. Learn how ATS software streamlines hiring from job posting to onboarding.',
  'bi': 'Business Intelligence (BI) tools transform raw data into actionable insights through dashboards, reports, and visualizations. Learn how BI platforms drive data-driven decisions.',
  'churn-rate': 'Churn rate measures the percentage of customers who stop using a product during a given period. Learn how to calculate, reduce, and manage customer churn.',
  'clv': 'Customer Lifetime Value (CLV) predicts the total revenue a business can expect from a single customer account. Learn how to calculate and optimize CLV.',
  'cms': 'A Content Management System (CMS) lets teams create, manage, and publish digital content without technical expertise. Learn how CMS platforms power modern websites.',
  'containerization': 'Containerization packages software code with its dependencies into isolated units called containers. Learn how Docker and containerization streamline deployment.',
  'crm': 'CRM (Customer Relationship Management) software manages customer interactions, sales pipelines, and support tickets. Learn how CRM platforms improve business relationships.',
  'dashboard': 'A dashboard is a visual display of key metrics and data points for monitoring business performance. Learn how dashboards drive data-driven decision making.',
  'devops': 'DevOps combines software development and IT operations to shorten development cycles. Learn how DevOps practices improve deployment frequency and reliability.',
  'employee-onboarding': 'Employee onboarding is the process of integrating new hires into an organization. Learn how structured onboarding improves retention and productivity.',
  'encryption': 'Encryption converts data into a coded format that can only be accessed with the correct key. Learn how encryption protects sensitive business data.',
  'freemium': 'Freemium is a pricing model that offers basic features for free with paid upgrades for advanced functionality. Learn how freemium drives SaaS adoption.',
  'kpi': 'A Key Performance Indicator (KPI) is a measurable value that tracks progress toward business objectives. Learn how to define and use KPIs effectively.',
  'llm': 'A Large Language Model (LLM) is an AI model trained on massive text datasets to generate human-like text. Learn how LLMs power ChatGPT and AI writing tools.',
  'mvp': 'A Minimum Viable Product (MVP) is the simplest version of a product that delivers core value to early users. Learn how MVPs validate product-market fit.',
  'open-source': 'Open-source software has source code that anyone can inspect, modify, and enhance. Learn how open-source tools drive innovation in the software industry.',
  'payroll': 'Payroll software automates wage calculation, tax withholding, and direct deposit for employees. Learn how payroll systems reduce compliance risk and save time.',
  'roi': 'Return on Investment (ROI) measures the profitability of an investment relative to its cost. Learn how to calculate and maximize software ROI.',
  'saas': 'Software as a Service (SaaS) delivers software over the internet on a subscription basis. Learn how the SaaS model works and its benefits for businesses.',
  'siem': 'Security Information and Event Management (SIEM) provides real-time threat detection and incident response. Learn how SIEM tools protect enterprise infrastructure.',
  'sla': 'A Service Level Agreement (SLA) defines the level of service a provider guarantees. Learn how SLAs protect software buyers and ensure vendor accountability.',
  'sso': 'Single Sign-On (SSO) lets users authenticate once to access multiple applications. Learn how SSO improves security and simplifies user management.',
  'time-tracking': 'Time tracking software records hours worked on tasks and projects. Learn how time tracking tools improve billing accuracy and team productivity.',
  'total-cost-of-ownership': 'Total Cost of Ownership (TCO) measures the complete cost of a software investment over its lifecycle. Learn how to calculate TCO for smarter buying decisions.',
  'ux': 'User Experience (UX) encompasses all aspects of a user\'s interaction with a product. Learn how UX design principles improve software usability and adoption.',
  'video-conferencing': 'Video conferencing enables real-time face-to-face meetings over the internet. Learn how video tools support remote collaboration and distributed teams.',
  'wireframe': 'A wireframe is a low-fidelity visual guide representing the structure of a webpage or app. Learn how wireframing improves design and stakeholder alignment.',
  'workflow-automation': 'Workflow automation uses software to execute repetitive business processes automatically. Learn how automation tools reduce manual work and operational costs.',
  'zero-trust': 'Zero Trust is a security framework that requires continuous verification of every access request. Learn how Zero Trust architecture protects modern enterprises.'
};

let fixed = 0;
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
  if (!data.description) {
    const slug = data.slug || file.replace('.json', '');
    if (descriptions[slug]) {
      data.description = descriptions[slug];
      fs.writeFileSync(path.join(dir, file), JSON.stringify(data, null, 2), 'utf-8');
      fixed++;
      console.log('Added description to: ' + slug);
    } else {
      console.log('MISSING description template for: ' + slug);
    }
  }
}
console.log('\nFixed: ' + fixed + ' glossary terms');
