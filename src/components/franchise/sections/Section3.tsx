interface Section3Data {
  primaryContactName: string;
  primaryContactMobile: string;
  alternateContactNumber: string;
  preferredOrderMethod: string;
  nextFollowUpDate: string;
}

interface Section3Props {
  data: Section3Data;
  onUpdate: (data: Section3Data) => void;
  errors?: { [key: string]: string };
}

function Section3({ data, onUpdate, errors = {} }: Section3Props) {
  const handleChange = (field: keyof Section3Data, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Contact for Order Processing</h2>
        <p className="text-slate-600">Who should we contact for order-related matters?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Primary Contact Name
          </label>
          <input
            type="text"
            value={data.primaryContactName}
            onChange={(e) => handleChange('primaryContactName', e.target.value)}
            placeholder="Enter contact person's name"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.primaryContactName ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.primaryContactName && (
            <p className="text-red-500 text-sm mt-2">{errors.primaryContactName}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Primary Contact Mobile Number
          </label>
          <input
            type="tel"
            value={data.primaryContactMobile}
            onChange={(e) => handleChange('primaryContactMobile', e.target.value)}
            placeholder="XXXXX XXXXX"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.primaryContactMobile ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.primaryContactMobile && (
            <p className="text-red-500 text-sm mt-2">{errors.primaryContactMobile}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Alternate Contact Number
          </label>
          <input
            type="tel"
            value={data.alternateContactNumber}
            onChange={(e) => handleChange('alternateContactNumber', e.target.value)}
            placeholder="XXXXX XXXXX"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.alternateContactNumber ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.alternateContactNumber && (
            <p className="text-red-500 text-sm mt-2">{errors.alternateContactNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Preferred Method for Receiving Orders
          </label>
          <select
            value={data.preferredOrderMethod}
            onChange={(e) => handleChange('preferredOrderMethod', e.target.value)}
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors bg-white ${
              errors.preferredOrderMethod ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          >
            <option value="">Select preferred method</option>
            <option value="phone">Phone Call</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="app">App Notification</option>
          </select>
          {errors.preferredOrderMethod && (
            <p className="text-red-500 text-sm mt-2">{errors.preferredOrderMethod}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Next Follow-up Date
          </label>
          <input
            type="date"
            value={data.nextFollowUpDate}
            onChange={(e) => handleChange('nextFollowUpDate', e.target.value)}
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.nextFollowUpDate ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.nextFollowUpDate && (
            <p className="text-red-500 text-sm mt-2">{errors.nextFollowUpDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Section3;
