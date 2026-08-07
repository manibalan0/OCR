import React from 'react';

const StatusBadge = ({ status }) => {
  const getLabel = (s) => {
    switch (s) {
      case 'PENDING':
        return 'Pending Review';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'RESOLVED':
        return 'Resolved';
      case 'REJECTED':
        return 'Rejected';
      default:
        return s || 'Unknown';
    }
  };

  return (
    <span className={`status-pill ${status || 'PENDING'}`}>
      <span className="status-pill-dot" />
      {getLabel(status)}
    </span>
  );
};

export default StatusBadge;
