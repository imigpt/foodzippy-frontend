interface Section5Data {
  accountHolderName: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
}

interface Section5Props {
  data: Section5Data;
  onUpdate: (data: Section5Data) => void;
  errors?: { [key: string]: string };
}

function Section5({ data, onUpdate, errors = {} }: Section5Props) {
  const handleChange = (field: keyof Section5Data, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Bank Details</h2>
        <p className="text-slate-600">Provide your bank account information for payments</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Account Holder Name
          </label>
          <input
            type="text"
            value={data.accountHolderName}
            onChange={(e) => handleChange('accountHolderName', e.target.value)}
            placeholder="Enter account holder's name"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.accountHolderName ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.accountHolderName && (
            <p className="text-red-500 text-sm mt-2">{errors.accountHolderName}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Bank Account Number
          </label>
          <input
            type="text"
            value={data.bankAccountNumber}
            onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
            placeholder="Enter account number"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.bankAccountNumber ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.bankAccountNumber && (
            <p className="text-red-500 text-sm mt-2">{errors.bankAccountNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            Bank Name
          </label>
          <input
            type="text"
            value={data.bankName}
            onChange={(e) => handleChange('bankName', e.target.value)}
            placeholder="e.g., HDFC Bank, ICICI Bank"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.bankName ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.bankName && (
            <p className="text-red-500 text-sm mt-2">{errors.bankName}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">
            IFSC Code
          </label>
          <input
            type="text"
            value={data.ifscCode}
            onChange={(e) => handleChange('ifscCode', e.target.value)}
            placeholder="e.g., HDFC0000001"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.ifscCode ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.ifscCode && (
            <p className="text-red-500 text-sm mt-2">{errors.ifscCode}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Section5;
