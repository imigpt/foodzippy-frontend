interface Section2Data {
  ownerName: string;
  ownerEmail: string;
  ownerMobile: string;
  additionalMobile: string;
}

interface Section2Props {
  data: Section2Data;
  onUpdate: (data: Section2Data) => void;
  errors?: { [key: string]: string };
}

function Section2({ data, onUpdate, errors = {} }: Section2Props) {
  const handleChange = (field: keyof Section2Data, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Owner Information</h2>
        <p className="text-slate-600">Tell us about the restaurant owner</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Owner Full Name
          </label>
          <input
            type="text"
            value={data.ownerName}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            placeholder="Enter owner's full name"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.ownerName ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.ownerName && (
            <p className="text-red-500 text-sm mt-2">{errors.ownerName}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Owner Email Address
          </label>
          <input
            type="email"
            value={data.ownerEmail}
            onChange={(e) => handleChange('ownerEmail', e.target.value)}
            placeholder="owner@example.com"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.ownerEmail ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.ownerEmail && (
            <p className="text-red-500 text-sm mt-2">{errors.ownerEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Owner Mobile Number
          </label>
          <input
            type="tel"
            value={data.ownerMobile}
            onChange={(e) => handleChange('ownerMobile', e.target.value)}
            placeholder="XXXXX XXXXX"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.ownerMobile ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.ownerMobile && (
            <p className="text-red-500 text-sm mt-2">{errors.ownerMobile}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Additional Mobile Number <span className="text-slate-500 font-normal">(Mandatory)</span>
          </label>
          <input
            type="tel"
            value={data.additionalMobile}
            onChange={(e) => handleChange('additionalMobile', e.target.value)}
            placeholder="XXXXX XXXXX"
            className="w-full px-4 py-3 text-lg border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

export default Section2;
