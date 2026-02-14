import { FormField } from '../utils/api';

interface DynamicFormFieldProps {
  field: FormField;
  value: any;
  onChange: (fieldKey: string, value: any) => void;
  error?: string;
}

export default function DynamicFormField({ field, value, onChange, error }: DynamicFormFieldProps) {
  const handleChange = (newValue: any) => {
    onChange(field.fieldKey, newValue);
  };

  const renderField = () => {
    switch (field.fieldType) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <input
            type={field.fieldType}
            id={field.fieldKey}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.fieldKey}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.fieldKey}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            id={field.fieldKey}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multi_select':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValue = Array.isArray(value) ? value : [];
                    const newValue = e.target.checked
                      ? [...currentValue, option]
                      : currentValue.filter((v) => v !== option);
                    handleChange(newValue);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
      case 'boolean':
        return (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id={field.fieldKey}
              checked={value || false}
              onChange={(e) => handleChange(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.fieldKey} className="text-sm cursor-pointer">
              {field.helpText || field.label}
            </label>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            id={field.fieldKey}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );

      case 'file':
        return (
          <div>
            <input
              type="file"
              id={field.fieldKey}
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleChange(file || null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={field.required}
              accept="image/*"
            />
            {value && typeof value === 'object' && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {value.name}
              </p>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={field.fieldKey}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={field.fieldKey} className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {field.helpText && !['checkbox', 'boolean'].includes(field.fieldType) && (
        <p className="text-xs text-gray-500">{field.helpText}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
