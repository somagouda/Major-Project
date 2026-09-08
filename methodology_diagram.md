<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Figure 4.1 Diagram</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body { font-family: sans-serif; background-color: #ffffff; display: flex; flex-direction: column; align-items: center; padding: 40px; margin: 0; }
        .mermaid { background: white; padding: 20px; border: 1px solid #ddd; }
        button { margin-bottom: 20px; padding: 10px 20px; background-color: #007bff; color: white; border: none; cursor: pointer; font-size: 16px; border-radius: 5px; }
        button:hover { background-color: #0056b3; }
        .instructions { max-width: 800px; margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>

    <div class="instructions">
        <h2>Figure 4.1: Overall Methodology of the Proposed System</h2>
        <p>This is a high-resolution, pixel-perfect render for your IEEE paper. <br>
        <b>To save:</b> Right-click the diagram below and select <b>"Save image as..."</b> or take a high-res screenshot.</p>
    </div>

    <div class="mermaid">
flowchart TD
    %% Define Styles
    classDef startEnd fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef coreModule fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px;
    classDef subModule fill:#fff3e0,stroke:#ff9800,stroke-width:2px;
    classDef finalOutput fill:#e8f5e9,stroke:#4caf50,stroke-width:2px;
    
    %% Nodes
    Start(["User Registration & Profile Creation"]):::startEnd
    
    subgraph InputData [Input Data]
        A1[Academic Details]
        A2[Career Interests]
        A3[Resume Upload]
    end
    
    RM["Resume Analysis Module<br/>(NLP & Machine Learning)"]:::coreModule
    
    subgraph ResumeProcessing [Resume Processing]
        R1[Extract Technical Skills & Projects]
        R2[Compare with Industry Requirements]
        R3[Generate ATS Compatibility Score]
    end
    
    %% Branching Modules
    AL["Adaptive Learning Module"]:::coreModule
    MI["AI Mock Interview Module"]:::coreModule
    BA["Behavioral Analytics Module"]:::coreModule
    
    subgraph LearningActivities [Learning Activities]
        L1[Coding Problems & Quizzes]
        L2[Aptitude Tests]
        L3[Interview Prep Materials]
    end
    
    subgraph InterviewSimulation [Interview Simulation]
        I1[Domain-Specific Questions]
        I2[Evaluate Tech & Comm Skills]
        I3[Provide Detailed Feedback]
    end
    
    subgraph AnalyticsTracking [Analytics Tracking]
        B1[Learning Consistency]
        B2[Assessment Scores]
        B3[Engagement Patterns]
    end
    
    PR["Placement Readiness Prediction Module"]:::coreModule
    
    Dashboard(["Interactive Student Dashboard<br/>(Readiness Score & Progress Reports)"]):::finalOutput

    %% Connections
    Start --> InputData
    InputData --> RM
    
    RM --> ResumeProcessing
    ResumeProcessing --> AL
    ResumeProcessing --> MI
    
    AL --> LearningActivities
    MI --> InterviewSimulation
    
    LearningActivities --> BA
    InterviewSimulation --> BA
    BA --> AnalyticsTracking
    
    ResumeProcessing --> PR
    LearningActivities --> PR
    InterviewSimulation --> PR
    AnalyticsTracking --> PR
    
    PR --> Dashboard
    </div>

    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    </script>
</body>
</html>
