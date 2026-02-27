import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Clock, Users, Rocket, Award, BookOpen,
  MapPin, Briefcase, ChevronDown, Send, Bike, Store,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const whyPoints = [
  { icon: <TrendingUp className="w-8 h-8 text-white" />, title: 'Growth Opportunities', desc: 'Accelerate your career with clear promotion paths and mentorship.' },
  { icon: <Clock className="w-8 h-8 text-white" />, title: 'Flexible Work Environment', desc: 'Work schedules designed around your life, not the other way around.' },
  { icon: <Users className="w-8 h-8 text-white" />, title: 'Supportive Team Culture', desc: 'Collaborative teams that celebrate wins and grow through challenges together.' },
  { icon: <Rocket className="w-8 h-8 text-white" />, title: 'Fast Growing Company', desc: 'Be part of a rapidly expanding food-tech platform across India.' },
  { icon: <Award className="w-8 h-8 text-white" />, title: 'Performance Incentives', desc: 'Earn bonuses, rewards, and recognition for outstanding contributions.' },
  { icon: <BookOpen className="w-8 h-8 text-white" />, title: 'Learning Opportunities', desc: 'Regular training, workshops, and access to industry resources.' },
];

const jobs = [
  // Vendor & Field Agents
  { title: 'Vendor Onboarding Executive', city: 'Agra / Noida', type: 'Full-time', desc: (<><span>Help new restaurant partners get set up and thriving on the </span><span className="brand-font">Foodzippy</span><span> platform.</span></>), category: 'Vendor & Field Agents' },
  { title: 'Vendor Support Agent', city: 'Agra / Noida', type: 'Full-time', desc: 'Provide ongoing support to registered vendors, resolving issues and driving retention.', category: 'Vendor & Field Agents' },
  
  // Delivery Operations
  { title: 'Delivery Partner', city: 'Agra / Noida', type: 'Freelance / Part-time', desc: 'Deliver food orders quickly and reliably, earning attractive per-delivery pay.', category: 'Delivery Operations' },
  
  // Office & Corporate
  // { title: 'Customer Support Executive', city: 'Remote / Agra', type: 'Full-time', desc: 'Be the first point of contact for customers and vendors, resolving queries swiftly.', category: 'Office & Corporate Roles' },
  // { title: 'Operations Manager', city: 'Agra', type: 'Full-time', desc: 'Oversee daily operations across vendor onboarding, delivery, and support teams.', category: 'Office & Corporate Roles' },
  // { title: 'Marketing Executive', city: 'Remote / Agra', type: 'Full-time', desc: 'Drive brand awareness, social media growth, and campaign execution.', category: 'Office & Corporate Roles' },
];

const positions = jobs.map((j) => j.title);

// ─── Component ───────────────────────────────────────────────────────────────

function Careers() {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    city: '',
    message: '',
    resume: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, resume: e.target.files?.[0] ?? null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.position || !form.city) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com'}/api/careers/apply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            position: form.position,
            city: form.city,
            message: form.message,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Server error');
      setSubmitted(true);
    } catch (err) {
      setFormError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Group jobs by category
  const categories = Array.from(new Set(jobs.map((j) => j.category)));

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFFBEB] py-16 sm:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E82335]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F7C150]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E82335]/10 text-[#E82335] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Briefcase className="w-4 h-4" />
            We're Hiring
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Join Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E82335] to-[#F7C150]">
              Team
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Be part of our growing food delivery and vendor network platform.
          </p>
          <a
            href="#openings"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E82335] to-[#F7C150] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            View Open Roles
            <ChevronDown className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ── Why Work With Us ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#E82335] mb-3">Why Work With Us</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Perks and values that make <span className="brand-font">Foodzippy</span> a great place to build your career
              </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyPoints.map((pt, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#E82335] to-[#F7C150] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {pt.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#E82335] transition-colors">
                  {pt.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Job Openings ── */}
      <section id="openings" className="py-16 sm:py-20 bg-gradient-to-br from-[#FFF5F5] to-[#FFFBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#E82335] mb-3">Open Positions</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Find the role that matches your passion and skills
            </p>
          </div>

          {categories.map((cat) => (
            <div key={cat} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#E82335] pl-4">
                {cat}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs
                  .filter((j) => j.category === cat)
                  .map((job, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 flex flex-col"
                    >
                      <h4 className="text-lg font-bold text-gray-900 mb-3">{job.title}</h4>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          <MapPin className="w-3 h-3" />
                          {job.city}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-[#E82335] bg-[#E82335]/10 px-3 py-1 rounded-full">
                          <Briefcase className="w-3 h-3" />
                          {job.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-5">{job.desc}</p>
                      <a
                        href="#apply"
                        onClick={() => setForm((prev) => ({ ...prev, position: job.title }))}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E82335] to-[#F7C150] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow hover:shadow-md hover:scale-105 transition-all duration-300"
                      >
                        Apply Now
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Application Form ── */}
      <section id="apply" className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#E82335] mb-3">Apply Now</h2>
            <p className="text-lg text-gray-500">
              Fill in your details and we'll get back to you shortly
            </p>
          </div>

          {submitted ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-10 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for applying. Our team will review your application and reach out to you soon.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ fullName: '', email: '', phone: '', position: '', city: '', message: '', resume: null }); }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E82335] to-[#F7C150] text-white px-8 py-3 rounded-full font-semibold shadow hover:shadow-md transition-all"
              >
                Apply for Another Role
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-[#E82335]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E82335] transition-colors text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-[#E82335]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E82335] transition-colors text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-[#E82335]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E82335] transition-colors text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-[#E82335]">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E82335] transition-colors text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position Applying For <span className="text-[#E82335]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E82335] transition-colors text-gray-800 appearance-none bg-white"
                  >
                    <option value="">Select a position</option>
                    {positions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume / CV
                </label>
                <label className="flex items-center gap-3 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#E82335] transition-colors group">
                  <div className="w-10 h-10 bg-[#E82335]/10 rounded-lg flex items-center justify-center group-hover:bg-[#E82335]/20 transition-colors">
                    <Send className="w-5 h-5 text-[#E82335]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {form.resume ? form.resume.name : 'Upload your resume'}
                    </p>
                    <p className="text-xs text-gray-400">PDF, DOC, or DOCX (max 5MB)</p>
                  </div>
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us a bit about yourself or why you'd like to join..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E82335] transition-colors text-gray-800 placeholder-gray-400 resize-none"
                />
              </div>

              {formError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#E82335] to-[#F7C150] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Quick Join CTA ── */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#E82335] to-[#F7C150]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              Quick Join
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Skip the form — jump straight to the registration that fits you
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Delivery Partner */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/30 hover:bg-white/30 transition-all duration-300">
              <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <Bike className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Join as Delivery Partner</h3>
              <p className="text-white/80 mb-6 text-sm leading-relaxed">
                Deliver food, earn per delivery, and enjoy flexible working hours.
              </p>
              <button
                onClick={() => navigate('/delivery-partner-register')}
                className="inline-flex items-center gap-2 bg-white text-[#E82335] px-8 py-3 rounded-full font-bold hover:bg-yellow-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Register Now
              </button>
            </div>

            {/* Vendor Support Agent */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/30 hover:bg-white/30 transition-all duration-300">
              <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <Store className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Join as Vendor Support Agent</h3>
              <p className="text-white/80 mb-6 text-sm leading-relaxed">
                Help vendors succeed on <span className="brand-font">Foodzippy</span> and earn commissions for every onboarding.
              </p>
              <button
                onClick={() => navigate('/service-registration')}
                className="inline-flex items-center gap-2 bg-white text-[#E82335] px-8 py-3 rounded-full font-bold hover:bg-yellow-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Careers;
