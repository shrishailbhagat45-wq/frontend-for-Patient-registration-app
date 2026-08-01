import { useState, useEffect } from 'react';

/**
 * Blood Pressure Input Component
 * Automatically adds "/" after 3 digits (e.g., 120/ becomes 120/80)
 * Format: XXX/YY or XXX/YYY
 */
export default function BloodPressureInput({
  value,
  onChange,
  placeholder = "e.g. 120/80",
  className = "",
  disabled = false,
  ...props
}) {
  const [displayValue, setDisplayValue] = useState(value || '');

  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const formatBloodPressure = (input) => {
    // Remove all non-numeric characters except "/"
    let cleaned = input.replace(/[^\d/]/g, '');
    
    // Remove multiple slashes, keep only first one
    const slashCount = (cleaned.match(/\//g) || []).length;
    if (slashCount > 1) {
      const firstSlashIndex = cleaned.indexOf('/');
      cleaned = cleaned.substring(0, firstSlashIndex + 1) + cleaned.substring(firstSlashIndex + 1).replace(/\//g, '');
    }
    
    // Split by slash
    const parts = cleaned.split('/');
    
    // Limit systolic (first part) to 3 digits
    if (parts[0] && parts[0].length > 3) {
      parts[0] = parts[0].substring(0, 3);
    }
    
    // If no slash exists and we have exactly 3 digits, add it automatically
    if (parts.length === 1 && parts[0].length === 3) {
      return parts[0] + '/';
    }
    
    // If user is typing after the slash, limit diastolic to 3 digits
    if (parts.length > 1) {
      if (parts[1] && parts[1].length > 3) {
        parts[1] = parts[1].substring(0, 3);
      }
      return parts[0] + '/' + parts[1];
    }
    
    // Return as-is if less than 3 digits
    return parts[0];
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formatted = formatBloodPressure(input);
    
    setDisplayValue(formatted);
    onChange(formatted);
  };

  const handleBlur = () => {
    // Optional: You can add additional validation on blur if needed
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      inputMode="numeric"
      {...props}
    />
  );
}
