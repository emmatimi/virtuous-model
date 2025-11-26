
import React, { useState } from 'react';
import { submitContactMessage } from '../services/cms';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
        await submitContactMessage({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
        });
        
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Reset status after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
        console.error(error);
        setStatus('error');
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Info Side */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-8">Get in Touch</h2>
          <p className="text-gray-600 font-light mb-12 leading-relaxed">
            For booking inquiries, press, or collaborations, please fill out the form or contact my agency directly.
            Available for travel worldwide.
          </p>
          
          <div className="space-y-8">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Representation</h4>
              <p className="font-serif text-lg">Virtous Model Management</p>
              <p className="text-sm text-gray-600">Nigeria, Lagos</p>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Direct Email</h4>
              <a href="mailto:bookings@virtuousmodel.com" className="font-serif text-lg hover:underline">
                bookings@virtuousmodel.com
              </a>
            </div>

            <div>
               <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Socials</h4>
               <div className="flex gap-4 text-sm font-medium">
                 <a href="https://www.instagram.com/eniola__oj?igsh=dnE4ZzQwb2Rhd2Iz" className="hover:text-gray-500">Instagram</a>
                 <a href="#" className="hover:text-gray-500">LinkedIn</a>
               </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="bg-luxury-gray p-8 md:p-12 order-1 lg:order-2 fade-in-up">
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <h3 className="text-3xl font-serif mb-4">Message Sent</h3>
              <p className="text-gray-500">Thank you for your inquiry. We will be in touch shortly.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-8 text-xs uppercase tracking-widest border-b border-black pb-1"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Name</label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text" 
                    className="bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors rounded-none"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Email</label>
                  <input 
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    className="bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors rounded-none"
                    placeholder="jane@agency.com"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Subject</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors rounded-none"
                >
                   <option value="" disabled>Select inquiry type</option>
                   <option value="booking">Booking Inquiry</option>
                   <option value="press">Press / Interview</option>
                   <option value="collab">Collaboration</option>
                   <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Message</label>
                <textarea 
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4} 
                  className="bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors rounded-none resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              {status === 'error' && (
                  <p className="text-red-500 text-xs tracking-widest">Something went wrong. Please try again or email us directly.</p>
              )}

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="bg-black text-white px-10 py-4 uppercase text-xs tracking-[0.2em] w-full md:w-auto hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
