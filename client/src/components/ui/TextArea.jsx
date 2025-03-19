const Textarea = ({ className, ...props }) => {
    return (
      <textarea
        className={`border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        {...props}
      />
    );
  };
  
  export default Textarea;
  