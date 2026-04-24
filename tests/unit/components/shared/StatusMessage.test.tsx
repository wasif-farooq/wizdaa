import { render, screen } from '@testing-library/react';
import { StatusMessage } from '../../../../src/components/shared/StatusMessage';

describe('StatusMessage', () => {
  it('renders success message', () => {
    render(<StatusMessage type="success" text="Request submitted successfully" />);
    expect(screen.getByText('Request submitted successfully')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<StatusMessage type="error" text="Failed to submit request" />);
    expect(screen.getByText('Failed to submit request')).toBeInTheDocument();
  });

  it('renders info message', () => {
    render(<StatusMessage type="info" text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders empty text message', () => {
    render(<StatusMessage type="info" text="" />);
    const container = document.body.querySelector('[class*="bg-blue-50"]');
    expect(container).toBeInTheDocument();
  });
});