const ErrorBanner = ({ message, onRetry }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
    <span>{message}</span>
    {onRetry && (
      <button onClick={onRetry} className="text-sm underline">Retry</button>
    )}
  </div>
);

export default ErrorBanner;