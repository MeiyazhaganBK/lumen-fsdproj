export const Select = ({ children, className }) => {
    return <div className={`relative ${className}`}>{children}</div>;
  };
  
  export const SelectTrigger = ({ children, className }) => {
    return (
      <button
        className={`border rounded px-3 py-2 w-full text-left ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export const SelectValue = ({ value, placeholder }) => {
    return <span>{value || placeholder}</span>;
  };
  
  export const SelectContent = ({ children, className }) => {
    return <div className={`absolute z-10 mt-2 bg-white border rounded shadow ${className}`}>{children}</div>;
  };
  
  export const SelectItem = ({ value, onClick, children, className }) => {
    return (
      <div
        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${className}`}
        onClick={() => onClick(value)}
      >
        {children}
      </div>
    );
  };