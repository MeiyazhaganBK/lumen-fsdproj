export const Dialog = ({ children }) => {
    return <div>{children}</div>;
  };
  
  export const DialogTrigger = ({ children, onClick, className }) => {
    return (
      <button onClick={onClick} className={`px-4 py-2 ${className}`}>
        {children}
      </button>
    );
  };
  
  export const DialogContent = ({ children, className }) => {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ${className}`}
      >
        <div className="bg-white rounded p-6">{children}</div>
      </div>
    );
  };
  
  export const DialogHeader = ({ children, className }) => {
    return <div className={`mb-4 ${className}`}>{children}</div>;
  };
  
  export const DialogTitle = ({ children, className }) => {
    return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
  };