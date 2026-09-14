import React from 'react';

function CorrelationBadge({ correlationId }) {
  if (!correlationId) return null;

  return (
    <div className="correlation-badge" title="Trace this exact request in the backend logs">
      <span className="dot" />
      Last request ID: <code>{correlationId}</code>
    </div>
  );
}

export default CorrelationBadge;
