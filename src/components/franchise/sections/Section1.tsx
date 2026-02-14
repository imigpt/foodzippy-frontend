interface Section1Data {
  restaurantName: string;
  restaurantAddress: string;
  landmark: string;
  gstNumber: string;
  fssaiNumber: string;
  yearStarted: string;
  avgOrdersPerDay: string;
}

interface Section1Props {
  data: Section1Data;
  onUpdate: (data: Section1Data) => void;
  errors?: { [key: string]: string };
}

function Section1({ data, onUpdate, errors = {} }: Section1Props) {
  const handleChange = (field: keyof Section1Data, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Restaurant Details</h2>
        <p className="text-slate-600">Tell us about your restaurant</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Restaurant Name
          </label>
          <input
            type="text"
            value={data.restaurantName}
            onChange={(e) => handleChange('restaurantName', e.target.value)}
            placeholder="Enter restaurant name"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.restaurantName ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.restaurantName && (
            <p className="text-red-500 text-sm mt-2">{errors.restaurantName}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Full Restaurant Address
          </label>
          <textarea
            value={data.restaurantAddress}
            onChange={(e) => handleChange('restaurantAddress', e.target.value)}
            placeholder="Enter complete address"
            rows={3}
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors resize-none ${
              errors.restaurantAddress ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.restaurantAddress && (
            <p className="text-red-500 text-sm mt-2">{errors.restaurantAddress}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Landmark Near Restaurant
          </label>
          <input
            type="text"
            value={data.landmark}
            onChange={(e) => handleChange('landmark', e.target.value)}
            placeholder="e.g., Near Central Park"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.landmark ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.landmark && (
            <p className="text-red-500 text-sm mt-2">{errors.landmark}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            GST Number
          </label>
          <input
            type="text"
            value={data.gstNumber}
            onChange={(e) => handleChange('gstNumber', e.target.value)}
            placeholder="Enter GST number"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.gstNumber ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.gstNumber && (
            <p className="text-red-500 text-sm mt-2">{errors.gstNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            FSSAI Number
          </label>
          <input
            type="text"
            value={data.fssaiNumber}
            onChange={(e) => handleChange('fssaiNumber', e.target.value)}
            placeholder="Enter FSSAI number"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.fssaiNumber ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.fssaiNumber && (
            <p className="text-red-500 text-sm mt-2">{errors.fssaiNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Year Restaurant Started Operations
          </label>
          <input
            type="number"
            value={data.yearStarted}
            onChange={(e) => handleChange('yearStarted', e.target.value)}
            placeholder="e.g., 2020"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.yearStarted ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.yearStarted && (
            <p className="text-red-500 text-sm mt-2">{errors.yearStarted}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Average Online Orders Per Day
          </label>
          <input
            type="number"
            value={data.avgOrdersPerDay}
            onChange={(e) => handleChange('avgOrdersPerDay', e.target.value)}
            placeholder="e.g., 50"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.avgOrdersPerDay ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.avgOrdersPerDay && (
            <p className="text-red-500 text-sm mt-2">{errors.avgOrdersPerDay}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Section1;
