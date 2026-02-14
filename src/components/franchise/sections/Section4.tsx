interface Section4Data {
  documentSubmissionMethod: string;
}

interface Section4Props {
  data: Section4Data;
  onUpdate: (data: Section4Data) => void;
  errors?: { [key: string]: string };
}

function Section4({ data, onUpdate, errors = {} }: Section4Props) {
  const handleChange = (value: string) => {
    onUpdate({ documentSubmissionMethod: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Document Submission</h2>
        <p className="text-slate-600">How have you submitted your documents?</p>
      </div>

      <div className="space-y-4">
        {[
          { value: 'email', label: 'Email' },
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'in-person', label: 'In Person' },
          { value: 'portal', label: 'Online Portal' },
          { value: 'not-submitted', label: 'Not Yet Submitted' },
        ].map((option) => (
          <label key={option.value} className="flex items-center p-4 border-2 border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors" style={{ borderColor: data.documentSubmissionMethod === option.value ? '#EF4444' : '#CBD5E1' }}>
            <input
              type="radio"
              name="documentMethod"
              value={option.value}
              checked={data.documentSubmissionMethod === option.value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-5 h-5 text-red-500 cursor-pointer"
            />
            <span className="ml-4 text-lg font-medium text-slate-900">{option.label}</span>
          </label>
        ))}
        {errors.documentSubmissionMethod && (
          <p className="text-red-500 text-sm mt-2">{errors.documentSubmissionMethod}</p>
        )}
      </div>
    </div>
  );
}

export default Section4;
