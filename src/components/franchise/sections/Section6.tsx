interface Section6Data {
  zomatoListed: string;
  zomatoMonths: string;
  swiggyListed: string;
  swiggyMonths: string;
  remarks: string;
}

interface Section6Props {
  data: Section6Data;
  onUpdate: (data: Section6Data) => void;
  errors?: { [key: string]: string };
}

function Section6({ data, onUpdate, errors = {} }: Section6Props) {
  const handleChange = (field: keyof Section6Data, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Existing Online Presence</h2>
        <p className="text-slate-600">Tell us about your presence on other platforms</p>
      </div>

      <div className="space-y-8">
        <div className="border-2 border-slate-300 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Zomato</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-3">
                Is the restaurant listed on Zomato?
              </label>
              <div className="flex gap-4">
                {['yes', 'no'].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="zomatoListed"
                      value={option}
                      checked={data.zomatoListed === option}
                      onChange={(e) => handleChange('zomatoListed', e.target.value)}
                      className="w-5 h-5 text-red-500 cursor-pointer"
                    />
                    <span className="ml-2 text-lg text-slate-900 capitalize">{option}</span>
                  </label>
                ))}
              </div>
              {errors.zomatoListed && (
                <p className="text-red-500 text-sm mt-2">{errors.zomatoListed}</p>
              )}
            </div>

            {data.zomatoListed === 'yes' && (
              <div>
                <label className="block text-lg font-semibold text-slate-900 mb-3">
                  Since how many months?
                </label>
                <input
                  type="number"
                  value={data.zomatoMonths}
                  onChange={(e) => handleChange('zomatoMonths', e.target.value)}
                  placeholder="e.g., 12"
                  className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.zomatoMonths ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
                  }`}
                />
                {errors.zomatoMonths && (
                  <p className="text-red-500 text-sm mt-2">{errors.zomatoMonths}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-2 border-slate-300 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Swiggy</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-3">
                Is the restaurant listed on Swiggy?
              </label>
              <div className="flex gap-4">
                {['yes', 'no'].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="swiggyListed"
                      value={option}
                      checked={data.swiggyListed === option}
                      onChange={(e) => handleChange('swiggyListed', e.target.value)}
                      className="w-5 h-5 text-red-500 cursor-pointer"
                    />
                    <span className="ml-2 text-lg text-slate-900 capitalize">{option}</span>
                  </label>
                ))}
              </div>
              {errors.swiggyListed && (
                <p className="text-red-500 text-sm mt-2">{errors.swiggyListed}</p>
              )}
            </div>

            {data.swiggyListed === 'yes' && (
              <div>
                <label className="block text-lg font-semibold text-slate-900 mb-3">
                  Since how many months?
                </label>
                <input
                  type="number"
                  value={data.swiggyMonths}
                  onChange={(e) => handleChange('swiggyMonths', e.target.value)}
                  placeholder="e.g., 12"
                  className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.swiggyMonths ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
                  }`}
                />
                {errors.swiggyMonths && (
                  <p className="text-red-500 text-sm mt-2">{errors.swiggyMonths}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-2 border-slate-300 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Additional Information</h3>
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">
              Additional Remarks or Notes
            </label>
            <textarea
              value={data.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Share any additional remarks, special requests, or notes about your restaurant..."
              rows={8}
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                errors.remarks ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.remarks && (
              <p className="text-red-500 text-sm mt-2">{errors.remarks}</p>
            )}
            <p className="text-sm text-slate-500 mt-2">
              {(data.remarks || '').length} characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section6;
