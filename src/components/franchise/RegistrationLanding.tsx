interface RegistrationLandingProps {
  onStart: () => void;
}

function RegistrationLanding({ onStart }: RegistrationLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-6">
              <span className="text-3xl">🍕</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Join FoodZippy
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Expand your restaurant's reach with our delivery network. Complete a quick registration to get started with FoodZippy and connect with thousands of customers.
          </p>

          <div className="space-y-4 mb-10 text-left bg-slate-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <p className="text-slate-700">Simple registration process</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <p className="text-slate-700">Takes about 5-10 minutes</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <p className="text-slate-700">Secure and confidential</p>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 text-lg"
          >
            Start Registration
          </button>

          <p className="text-sm text-slate-500 mt-6">
            You can save your progress and come back later
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationLanding;
