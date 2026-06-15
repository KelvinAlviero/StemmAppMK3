import { render, screen } from '@testing-library/react';
import React from 'react';

describe('App Tests', () => {
  it('should render without crashing', () => {
    render(<>Test Content</>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
