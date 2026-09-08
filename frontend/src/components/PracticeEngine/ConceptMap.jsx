import React from 'react';

export default function ConceptMap({ solvedCount, targetRole, onSelectConcept }) {
  // Concept Nodes Definition
  const nodes = [
    { id: 'ds', label: 'Data Structures', x: 50, y: 190, reqSolved: 0 },
    { id: 'algo', label: 'Algorithms', x: 190, y: 90, reqSolved: 1 },
    { id: 'ml', label: 'AI & Machine Learning', x: 190, y: 290, reqSolved: 2 },
    { id: 'sys', label: 'System Design', x: 330, y: 90, reqSolved: 3 },
    { id: 'cloud', label: 'DevOps & Cloud', x: 330, y: 290, reqSolved: 4 }
  ];

  // Connection definitions for drawing SVG lines
  const links = [
    { from: 'ds', to: 'algo' },
    { from: 'ds', to: 'ml' },
    { from: 'algo', to: 'sys' },
    { from: 'algo', to: 'cloud' },
    { from: 'ml', to: 'cloud' }
  ];

  // Helper to determine node status
  const getNodeStatus = (node) => {
    if (solvedCount > node.reqSolved + 1) return 'completed';
    if (solvedCount >= node.reqSolved) return 'unlocked';
    return 'locked';
  };

  return (
    <div className="concept-map-container" style={{ position: 'relative', width: '100%', height: '380px' }}>
      {/* SVG Connections Overlay */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none' }}>
        {links.map((link, idx) => {
          const fromNode = nodes.find(n => n.id === link.from);
          const toNode = nodes.find(n => n.id === link.to);
          
          if (!fromNode || !toNode) return null;
          
          // Determine status color of the link
          const fromStatus = getNodeStatus(fromNode);
          const toStatus = getNodeStatus(toNode);
          
          let strokeColor = 'rgba(255, 255, 255, 0.08)';
          if (fromStatus === 'completed' && toStatus !== 'locked') {
            strokeColor = 'rgba(139, 92, 246, 0.4)';
          }
          if (fromStatus === 'completed' && toStatus === 'completed') {
            strokeColor = 'rgba(16, 185, 129, 0.5)';
          }

          return (
            <line
              key={idx}
              x1={fromNode.x + 60}
              y1={fromNode.y + 20}
              x2={toNode.x + 60}
              y2={toNode.y + 20}
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeDasharray={toStatus === 'locked' ? '5,5' : 'none'}
              transition="stroke 0.3s ease"
            />
          );
        })}
      </svg>

      {/* Interactive HTML Nodes */}
      {nodes.map((node) => {
        const status = getNodeStatus(node);
        let statusBadge = '🔒 Locked';
        if (status === 'completed') statusBadge = '✅ Mastered';
        if (status === 'unlocked') statusBadge = '⚡ Ready';

        const isInteractable = status === 'unlocked' || status === 'completed';

        return (
          <div
            key={node.id}
            className={`concept-node ${status}`}
            onClick={() => {
              if (isInteractable && onSelectConcept) {
                onSelectConcept(node.label);
              }
            }}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              width: '180px',
              height: '65px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '10px',
              textAlign: 'center',
              padding: '0.25rem 0.5rem',
              cursor: isInteractable ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              transform: 'scale(1)',
              boxShadow: isInteractable ? '0 4px 12px rgba(139, 92, 246, 0.15)' : 'none',
              border: isInteractable ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--glass-border)'
            }}
            onMouseEnter={(e) => {
              if (isInteractable) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 15px var(--accent)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }
            }}
            onMouseLeave={(e) => {
              if (isInteractable) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, margin: 0, color: isInteractable ? '#fff' : 'var(--text-muted)' }}>
              {node.label}
            </div>
            <div style={{ fontSize: '0.6rem', opacity: 0.8, marginTop: '2px', color: isInteractable ? 'var(--secondary)' : 'var(--text-muted)' }}>
              {statusBadge}
            </div>
          </div>
        );
      })}
    </div>
  );
}
