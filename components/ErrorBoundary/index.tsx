import React from 'react';

class ErrorBoundary extends React.Component<any, any>{
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false
    }
  }

  static getDerrivedStateFromError(error: any) {
    return {
      hasError: true
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log(error);
    console.log(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;